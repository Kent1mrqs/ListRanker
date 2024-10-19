use crate::models::items_models::{Item, NewItem};
use crate::schema::items;
use base64::Engine;
use diesel::prelude::*;
use diesel::prelude::*;
use diesel::result::Error;
use diesel::{PgConnection, QueryResult, RunQueryDsl};

/// Inserts multiple new items into the database in bulk.
/// Returns the number of successfully inserted items.
pub fn bulk_insert_items(conn: &mut PgConnection, new_items: Vec<NewItem>) -> Result<usize, Error> {
    diesel::insert_into(items::table)
        .values(&new_items)
        .execute(conn)
}

/// Retrieves all items associated with the specified list ID from the database.
/// Returns a vector of items corresponding to the given list ID.
pub fn fetch_items_by_list_id(conn: &mut PgConnection, list_id_param: i32) -> QueryResult<Vec<Item>> {
    use crate::schema::items::dsl::*;

    // Charger les items avec les images sous forme brute (Vec<u8>)
    let raw_items: Vec<(i32, i32, String, i32, Option<Vec<u8>>)> = items
        .filter(list_id.eq(list_id_param))
        .select((id, list_id, name, position_list, image))
        .load::<(i32, i32, String, i32, Option<Vec<u8>>)>(conn)?;

    // Convertir les images en base64 et remplacer par une chaîne vide si l'image est None
    let converted_items: Vec<Item> = raw_items.into_iter().map(|(id_param, list_id_param, name_param, position_list_param, image_param)| {
        Item {
            id: id_param,
            list_id: list_id_param,
            name: name_param,
            position_list: position_list_param,
            image: image_param.map_or_else(|| "".to_string(), |bytes| convert_to_base64(bytes, "image/png")),
        }
    }).collect();

    Ok(converted_items)
}

pub fn convert_image(image: String) -> Option<Vec<u8>> {
    // Supprimer le préfixe de la chaîne Base64 si présent
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
    let base64_string = base64::engine::general_purpose::STANDARD.encode(&bytes);
    format!("data:{};base64,{}", mime_type, base64_string)
}