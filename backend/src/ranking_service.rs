use crate::item_service::get_items_by_list_id;
use crate::models::items_models::Item;
use crate::models::ranking_items_models::NewRankingItem;
use crate::models::rankings_models::{NewRanking, Ranking};
use crate::ranking_item_service::insert_ranking_items_in_bulk;
use diesel::prelude::*;

pub fn get_all_rankings(conn: &mut PgConnection, user_id_param: i32) -> QueryResult<Vec<Ranking>> {
    use crate::schema::rankings::dsl::*;
    rankings
        .filter(user_id.eq(user_id_param))
        .load::<Ranking>(conn)
}

pub fn create_new_ranking(conn: &mut PgConnection, new_ranking: NewRanking) -> QueryResult<usize> {
    let other_ranking_id = insert_ranking(conn, &new_ranking)?;
    let list_id_param = get_list_id_by_ranking_id(conn, other_ranking_id)?;
    let ranking_items = get_items_by_list_id(conn, list_id_param)?;

    let new_ranking_items = create_new_ranking_items(&ranking_items, other_ranking_id);

    insert_ranking_items_in_bulk(conn, new_ranking_items)?;
    Ok(other_ranking_id as usize)
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
