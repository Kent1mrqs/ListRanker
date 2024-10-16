use crate::item_service::insert_items_in_bulk;
use crate::models::items_models::{NewItem, NewItemApi};
use crate::models::lists_models::{List, NewListDb};
use crate::schema::lists;
use diesel::prelude::*;
use diesel::QueryResult;

pub fn get_all_lists(conn: &mut PgConnection) -> QueryResult<Vec<List>> {
    lists::dsl::lists.load::<List>(conn)
}

pub fn create_new_list(conn: &mut PgConnection, new_list: NewListDb, items: Vec<NewItemApi>) -> QueryResult<usize> {
    use crate::schema::lists::dsl::id;

    diesel::insert_into(lists::table)
        .values(&new_list)
        .execute(conn)?;

    let other_list_id: i32 = lists::table
        .order(id.desc())
        .select(id)
        .first(conn)?;

    let new_items: Vec<NewItem> = items.into_iter()
        .map(|item| NewItem {
            list_id: Some(other_list_id),
            name: item.name.clone(),
        })
        .collect();

    insert_items_in_bulk(conn, new_items)?;
    Ok(other_list_id as usize)
}

pub fn remove_list(conn: &mut PgConnection, list_id_param: i32) -> QueryResult<usize> {
    use crate::schema::items::dsl::{items, list_id};
    use crate::schema::lists::dsl::{id, lists};

    diesel::delete(items.filter(list_id.eq(list_id_param)))
        .execute(conn)?;

    diesel::delete(lists.filter(id.eq(list_id_param)))
        .execute(conn)
}
