use crate::models::ranking_items_models::{NewRankingItem, NewRankings, RankingItem, RankingItemWithName};
use crate::schema::ranking_items;
use diesel::prelude::*;
use diesel::result::Error;
use diesel::{PgConnection, QueryResult, RunQueryDsl};

pub fn insert_ranking_items_in_bulk(conn: &mut PgConnection, new_ranking_items: Vec<NewRankingItem>) -> Result<usize, Error> {
    use crate::schema::ranking_items;
    diesel::insert_into(ranking_items::table)
        .values(&new_ranking_items)
        .execute(conn)
}


pub fn get_ranking_items_by_ranking_id(conn: &mut PgConnection, ranking_id_param: i32) -> QueryResult<Vec<RankingItemWithName>> {
    use crate::schema::ranking_items::dsl::*;
    use crate::schema::items::dsl::{id as table_items_id, items as items_table, name as item_name_col};
    ranking_items
        .filter(ranking_id.eq(ranking_id_param))
        .inner_join(items_table.on(table_items_id.eq(item_id)))
        .select((ranking_items::all_columns(), item_name_col))
        .load::<(RankingItem, String)>(conn)
        .map(|results| {
            results.into_iter().map(|(ranking_item, item_name)| {
                RankingItemWithName {
                    id: ranking_item.id,
                    ranking_id: ranking_item.ranking_id,
                    item_id: ranking_item.item_id,
                    rank: ranking_item.rank,
                    name: item_name,
                }
            }).collect()
        })
}

pub fn exchange_rank_with_id(conn: &mut PgConnection, new_item_order: Vec<NewRankings>) -> Result<usize, Error> {
    for item in &new_item_order {
        let current_item: RankingItem = ranking_items::table
            .find(item.id)
            .first(conn)?;

        let target_item: RankingItem = ranking_items::table
            .filter(ranking_items::rank.eq(item.new_rank))
            .first(conn)?;

        diesel::update(ranking_items::table.find(target_item.id))
            .set(ranking_items::rank.eq(current_item.rank))
            .execute(conn)?;

        diesel::update(ranking_items::table.find(item.id))
            .set(ranking_items::rank.eq(item.new_rank))
            .execute(conn)?;
    }
    Ok(new_item_order.len())
}