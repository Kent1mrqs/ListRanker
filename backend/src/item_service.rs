use crate::schema::items;
use diesel::result::Error;
use diesel::{PgConnection, QueryResult, RunQueryDsl};
use diesel::prelude::*;
use crate::models::{Item, NewItem};

pub fn insert_items_in_bulk(
    conn: &mut PgConnection,
    new_items: Vec<NewItem>,
) -> Result<usize, Error> {
    diesel::insert_into(items::table)
        .values(&new_items)
        .execute(conn)
}

pub fn get_items_by_list_id(conn: &mut PgConnection, list_id_param: i32) -> QueryResult<Vec<Item>> {
    use crate::schema::items::dsl::*;

    items
        .filter(list_id.eq(list_id_param))
        .load::<Item>(conn)
}
