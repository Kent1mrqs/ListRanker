use crate::item_service::fetch_items_by_list_id;
use crate::models::items_models::Item;
use crate::models::ranking_items_models::NewRankingItem;
use crate::models::rankings_models::{NewRanking, Ranking};
use crate::ranking_item_service::insert_ranking_items_bulk;
use diesel::prelude::*;

/// Retrieves all rankings associated with the specified user.
pub fn fetch_user_rankings(conn: &mut PgConnection, user_id_param: i32) -> QueryResult<Vec<Ranking>> {
    use crate::schema::rankings::dsl::*;
    rankings
        .filter(user_id.eq(user_id_param))
        .load::<Ranking>(conn)
}

/// Creates a new ranking in the database and returns the ID of the newly created ranking.
pub fn register_new_ranking(conn: &mut PgConnection, new_ranking: NewRanking) -> QueryResult<usize> {
    let ranking_id = insert_ranking(conn, &new_ranking)?;
    let list_id = get_list_id_by_ranking_id(conn, ranking_id)?;
    let ranking_items: Vec<Item> = fetch_items_by_list_id(conn, list_id)?;

    let new_ranking_items = create_new_ranking_items(&ranking_items, ranking_id);

    insert_ranking_items_bulk(conn, new_ranking_items)?;
    Ok(ranking_id as usize)
}

/// Inserts a new ranking into the database and returns its ID.
fn insert_ranking(conn: &mut PgConnection, new_ranking: &NewRanking) -> QueryResult<i32> {
    use crate::schema::rankings;
    diesel::insert_into(rankings::table)
        .values(new_ranking)
        .execute(conn)?;

    rankings::table
        .order(rankings::dsl::id.desc())
        .select(rankings::dsl::id)
        .first(conn)
}

/// Retrieves the ID of the list associated with a given ranking.
fn get_list_id_by_ranking_id(conn: &mut PgConnection, ranking_id: i32) -> QueryResult<i32> {
    use crate::schema::rankings::dsl::{id, list_id};
    use crate::schema::rankings;
    rankings::table
        .filter(id.eq(ranking_id))
        .select(list_id)
        .first(conn)
}

/// Creates a list of new ranking items from an existing list of items.
fn create_new_ranking_items(ranking_items: &[Item], ranking_id: i32) -> Vec<NewRankingItem> {
    ranking_items.iter()
        .enumerate()
        .map(|(index, item)| NewRankingItem {
            item_id: item.id,
            ranking_id,
            score: 0,
            rank: (index + 1) as i32,
        })
        .collect()
}

