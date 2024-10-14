use crate::item_service::insert_items_in_bulk;
use crate::models::{List, NewItem, NewItemApi, NewListDb};
use diesel::prelude::*;
use diesel::QueryResult;

pub fn create_new_list(conn: &mut PgConnection, new_list: NewListDb, elements: Vec<NewItemApi>) -> QueryResult<usize> {
    use crate::schema::lists;
    print!("{:?}", new_list);
    print!("{:?}", elements);
    diesel::insert_into(lists::table)
        .values(&new_list) // Ajoutez le `&` pour passer une référence
        .execute(conn)?;

    let list_id: i32 = lists::table
        .order(lists::dsl::list_id.desc())
        .select(lists::dsl::list_id)
        .first(conn)?;

    let new_items: Vec<NewItem> = elements.into_iter()
        .map(|item| NewItem {
            list_id: Some(list_id),
            name: item.name.clone(),
        })
        .collect();

    insert_items_in_bulk(conn, new_items)?;
    Ok(list_id as usize)
}


pub fn get_all_lists(conn: &mut PgConnection) -> QueryResult<Vec<List>> {
    use crate::schema::lists::dsl::*;

    lists.load::<List>(conn)
}

