use crate::models::items_models::{Item, NewItem, NewItemApi};
use crate::models::ranking_items_models::NewRankingItem;
use crate::schema::items::dsl::items;
use crate::schema::items::id;
use base64::Engine;
use diesel::prelude::*;
use diesel::result::Error;
use diesel::{PgConnection, QueryResult, RunQueryDsl};

/// Inserts multiple new items into the database in bulk.
/// Returns the number of successfully inserted items.
pub fn bulk_insert_items(conn: &mut PgConnection, new_items: Vec<NewItem>) -> Result<usize, Error> {
    match diesel::insert_into(items)
        .values(&new_items)
        .execute(conn) {
        Ok(rows_inserted) => {
            println!("Successfully inserted {} new items.", rows_inserted);
            Ok(rows_inserted)
        }
        Err(err) => {
            println!("Failed to insert items: {}", err);
            Err(err)
        }
    }
}

pub fn add_item_to_list(conn: &mut PgConnection, list_id_param: i32) -> Result<usize, Error> {
    use crate::schema::ranking_items::dsl::ranking_items;
    use crate::schema::rankings::dsl::{id as ranking_id_param, list_id, rankings};
    let item_data = NewItem {
        list_id: list_id_param,
        name: "".to_string(),
        image: convert_image("".to_string()),
    };

    let inserted_item_id = diesel::insert_into(items)
        .values(&item_data)
        .returning(id)
        .get_result(conn)?;

    let ranking_ids: Vec<i32> = rankings
        .filter(list_id.eq(list_id_param))
        .select(ranking_id_param)
        .load(conn)?;

    let mut ranking_items_vec = Vec::new();
    for ranking_id in ranking_ids {
        let ranking_item = NewRankingItem {
            wins: 0,
            defeats: 0,
            score: 0,
            rank: 1000,
            ranking_id,
            item_id: inserted_item_id,
        };
        ranking_items_vec.push(ranking_item);
    }

    diesel::insert_into(ranking_items)
        .values(&ranking_items_vec)
        .execute(conn)?;

    Ok(ranking_items_vec.len())
}

/// Retrieves all items associated with the specified list ID from the database.
/// Returns a vector of items corresponding to the given list ID.
pub fn fetch_items_by_list_id(conn: &mut PgConnection, list_id_param: i32) -> QueryResult<Vec<Item>> {
    use crate::schema::items::dsl::*;

    let raw_items: Vec<(i32, i32, String, Option<Vec<u8>>)> = items
        .filter(list_id.eq(list_id_param))
        .select((id, list_id, name, image))
        .load::<(i32, i32, String, Option<Vec<u8>>)>(conn)?;

    let converted_items: Vec<Item> = raw_items.into_iter().map(|(id_param, list_id_param, name_param, image_param)| {
        Item {
            id: id_param,
            list_id: list_id_param,
            name: name_param,
            image: image_param.map_or_else(|| "".to_string(), |bytes| convert_to_base64(bytes, "image/png")),
        }
    }).collect();

    Ok(converted_items)
}

/*pub fn edit_items(conn: &mut PgConnection, edit_item_list: Vec<NewItemId>) -> QueryResult<i32> {
    for item in &edit_item_list {
        diesel::update(items::table.find(item.id))
            .set((
                items::name.eq(&item.name),
                items::image.eq(&item.image)
            ))
            .execute(conn)?;
    }
    Ok(1)
}*/

pub fn convert_image(image: String) -> Option<Vec<u8>> {
    let base64_image = image
        .strip_prefix("data:image/png;base64,")
        .or_else(|| image.strip_prefix("data:image/jpeg;base64,"))
        .unwrap_or(&image);


    match base64::engine::general_purpose::STANDARD.decode(base64_image) {
        Ok(image_bytes) => Some(image_bytes),
        Err(_) => {
            eprintln!("Erreur lors du décodage de l'image en base64");
            None
        }
    }
}

pub fn convert_to_base64(bytes: Vec<u8>, mime_type: &str) -> String {
    if bytes.is_empty() {
        return "".to_string();
    }

    let base64_string = base64::engine::general_purpose::STANDARD.encode(&bytes);
    format!("data:{};base64,{}", mime_type, base64_string)
}

pub fn edit_item(conn: &mut PgConnection, item_id: i32, new_data: NewItemApi) -> QueryResult<usize> {
    use crate::schema::items;
    diesel::update(items::table.find(item_id))
        .set((
            items::name.eq(new_data.name),
            items::image.eq(convert_image(new_data.image)),
        ))
        .execute(conn)
}
pub fn delete_item(conn: &mut PgConnection, item_id: i32) -> QueryResult<usize> {
    diesel::delete(items.filter(id.eq(item_id)))
        .execute(conn)

    // TODO: DELETE FROM RANKING_ITEMS AND DUELS
}