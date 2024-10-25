use crate::item_service::{bulk_insert_items, convert_image};
use crate::models::items_models::{NewItem, NewItemApi};
use crate::models::lists_models::{EditList, List, NewListDb};
use diesel::prelude::*;
use diesel::QueryResult;

/// Retrieves all lists associated with the specified user ID from the database.
pub fn fetch_user_lists(conn: &mut PgConnection, user_id_param: i32) -> QueryResult<Vec<List>> {
    use crate::schema::lists::dsl::{lists, user_id};
    lists.filter(user_id.eq(user_id_param)).load::<List>(conn)
}

/// Creates a new list in the database and inserts the associated items, returning the ID of the newly created list.
pub fn register_new_list(conn: &mut PgConnection, new_list: NewListDb, items: Vec<NewItemApi>) -> QueryResult<usize> {
    use crate::schema::lists::dsl::id;
    use crate::schema::lists;

    diesel::insert_into(lists::table)
        .values(&new_list)
        .execute(conn)?;

    let new_list_id: i32 = lists::table
        .order(id.desc())
        .select(id)
        .first(conn)?;

    let new_items: Vec<NewItem> = items.into_iter()
        .enumerate()
        .map(|(_index, item)| NewItem {
            list_id: new_list_id,
            name: item.name.clone(),
            image: convert_image(item.image.clone()),
        })
        .collect();


    bulk_insert_items(conn, new_items)?;
    Ok(new_list_id as usize)
}

/// Removes the list and its associated items from the database based on the given list ID.
/// Returns the number of deleted records.
pub fn delete_list(conn: &mut PgConnection, list_id: i32) -> QueryResult<usize> {
    use crate::schema::items::dsl::{items, list_id as item_list_id};
    use crate::schema::lists::dsl::{id, lists};

    conn.transaction::<_, diesel::result::Error, _>(|conn| {
        diesel::delete(items.filter(item_list_id.eq(list_id)))
            .execute(conn)?;

        diesel::delete(lists.filter(id.eq(list_id)))
            .execute(conn)
    })
}

pub fn edit_list(conn: &mut PgConnection, list_id: i32, data: EditList) -> QueryResult<usize> {
    use crate::schema::lists::dsl::{id, lists, name};
    conn.transaction::<_, diesel::result::Error, _>(|transaction_conn| {
        diesel::update(lists.filter(id.eq(list_id)))
            .set(name.eq(data.name))
            .execute(transaction_conn)?;
        //edit_items(transaction_conn, data.items)?;
        Ok(1)
    })
}