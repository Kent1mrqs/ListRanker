use crate::models::ranking_items_models::{NewRankingItem, RankingItem};
use crate::schema::ranking_items;
use diesel::prelude::*;
use diesel::result::Error;
use diesel::{PgConnection, QueryResult, RunQueryDsl};

pub fn insert_ranking_items_in_bulk(conn: &mut PgConnection, new_ranking_items: Vec<NewRankingItem>) -> Result<usize, Error> {
    diesel::insert_into(ranking_items::table)
        .values(new_ranking_items)
        .execute(conn)
}

pub fn get_ranking_items_by_ranking_id(conn: &mut PgConnection, ranking_id_param: i32) -> QueryResult<Vec<RankingItem>> {
    use crate::schema::ranking_items::dsl::*;

    ranking_items
        .filter(ranking_id.eq(ranking_id_param))
        .load::<RankingItem>(conn)
}
