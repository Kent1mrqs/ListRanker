use crate::item_service::get_items_by_list_id;
use crate::models::items_models::Item;
use crate::models::ranking_items_models::NewRankingItem;
use crate::models::rankings_models::{NewRanking, Ranking};
use crate::ranking_item_service::insert_ranking_items_in_bulk;
use crate::schema::rankings::list_id;
use diesel::prelude::*;

pub fn get_all_rankings(conn: &mut PgConnection, user_id_param: i32) -> QueryResult<Vec<Ranking>> {
    use crate::schema::rankings::dsl::*;
    rankings
        .filter(user_id.eq(user_id_param))
        .load::<Ranking>(conn)
}

pub fn create_new_ranking(conn: &mut PgConnection, new_ranking: NewRanking) -> QueryResult<usize> {
    use crate::schema::rankings::dsl::id;
    use crate::schema::rankings;

    diesel::insert_into(rankings::table)
        .values(&new_ranking)
        .execute(conn)?;

    let other_ranking_id: i32 = rankings::table
        .order(id.desc())
        .select(id)
        .first(conn)?;

    let list_id_param: i32 = rankings::table
        .filter(id.eq(other_ranking_id))
        .select(list_id)
        .first(conn)?;

    let ranking_items: Vec<Item> = get_items_by_list_id(conn, list_id_param)?;

    let new_ranking_items: Vec<NewRankingItem> = ranking_items.into_iter()
        .map(|item| NewRankingItem {
            item_id: item.id,
            ranking_id: other_ranking_id,
            rank: 0,
        })
        .collect();

    insert_ranking_items_in_bulk(conn, new_ranking_items)?;
    Ok(other_ranking_id as usize)
}
