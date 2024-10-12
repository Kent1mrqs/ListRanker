/*use diesel::QueryResult;
use crate::schema::items;

use crate::models::{NewItem, Item};

pub fn create_new_item(conn: &mut PgConnection, new_item: NewItem) -> QueryResult<usize> {
    diesel::insert_into(items::table)
        .values(new_item)
        .execute(conn)
}

pub fn get_all_items(conn: &mut PgConnection) -> QueryResult<Vec<Item>> {
    use crate::schema::items::dsl::*;

    items.load::<Item>(conn)
}
*/