use diesel::prelude::*;
use diesel::QueryResult;

use crate::models::{List, NewList};

pub fn create_new_list(conn: &mut PgConnection, new_list: NewList) -> QueryResult<usize> {
    use crate::schema::lists;

    diesel::insert_into(lists::table)
        .values(&new_list) // Ajoutez le `&` pour passer une référence
        .execute(conn)
}


pub fn get_all_lists(conn: &mut PgConnection) -> QueryResult<Vec<List>> {
    use crate::schema::lists::dsl::*;

    lists.load::<List>(conn) // Charge directement les données
}

