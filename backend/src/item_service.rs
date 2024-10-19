use crate::models::items_models::{Item, NewItem};
use crate::schema::items;
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

    items
        .filter(list_id.eq(list_id_param))
        .select(Item::as_select())
        .load::<Item>(conn)
}
