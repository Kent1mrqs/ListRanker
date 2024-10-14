use crate::item_service::insert_items_in_bulk;
use crate::models::items_models::{NewItem, NewItemApi};
use crate::models::lists_models::{List, NewListDb};
use crate::schema::lists;
use diesel::prelude::*;
use diesel::QueryResult;
// Assurez-vous que cette ligne est présente


pub fn create_new_list(conn: &mut PgConnection, new_list: NewListDb, elements: Vec<NewItemApi>) -> QueryResult<usize> {
    print!("{:?}", new_list);
    print!("{:?}", elements);
    diesel::insert_into(lists::table)
        .values(&new_list) // Ajoutez le `&` pour passer une référence
        .execute(conn)?;

    let other_list_id: i32 = lists::table
        .order(lists::dsl::list_id.desc())
        .select(lists::dsl::list_id)
        .first(conn)?;

    let new_items: Vec<NewItem> = elements.into_iter()
        .map(|item| NewItem {
            list_id: Some(other_list_id),
            name: item.name.clone(),
        })
        .collect();

    insert_items_in_bulk(conn, new_items)?;
    Ok(other_list_id as usize)
}


pub fn get_all_lists(conn: &mut PgConnection) -> QueryResult<Vec<List>> {
    // use crate::schema::lists::dsl::*;

    lists::dsl::lists.load::<List>(conn)
}

