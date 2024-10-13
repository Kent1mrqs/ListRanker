use crate::schema::items;
use diesel::result::Error;
use diesel::{PgConnection, QueryResult, RunQueryDsl};

use crate::models::{Item, NewItem};

pub fn insert_items_in_bulk(
    conn: &mut PgConnection,
    new_items: Vec<NewItem>,
) -> Result<usize, Error> {
    diesel::insert_into(items::table)
        .values(&new_items) // Insère tous les éléments en une fois
        .execute(conn) // Retourne le nombre d'éléments insérés
}

pub fn get_all_items(conn: &mut PgConnection) -> QueryResult<Vec<Item>> {
    use crate::schema::items::dsl::*;

    items.load::<Item>(conn)
}
