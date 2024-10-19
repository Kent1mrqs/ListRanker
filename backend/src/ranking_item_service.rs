use crate::models::ranking_items_models::{NewRankingItem, NewRankings, RankingItem, RankingItemWithName};
use crate::schema::ranking_items;
use diesel::prelude::*;
use diesel::result::Error;
use diesel::{PgConnection, QueryResult, RunQueryDsl};

/// Inserts multiple ranking items into the database in a single batch operation.
///
/// This function takes a vector of new ranking items and inserts them into the ranking_items table.
/// It returns the number of items successfully inserted or an error if the operation fails.
pub fn insert_ranking_items_bulk(conn: &mut PgConnection, ranking_items: Vec<NewRankingItem>) -> Result<usize, Error> {
    use crate::schema::ranking_items;

    diesel::insert_into(ranking_items::table)
        .values(&ranking_items)
        .execute(conn)
}

/// Retrieves ranking items associated with a specific ranking ID, including item names.
///
/// This function fetches ranking items for the given ranking ID, joining with the items table
/// to include item names. It returns a vector of RankingItemWithName structs or an error if the
/// operation fails.
pub fn fetch_ranking_items_with_names(conn: &mut PgConnection, ranking_id_param: i32) -> QueryResult<Vec<RankingItemWithName>> {
    use crate::schema::ranking_items::dsl::*;
    use crate::schema::items::dsl::{id as item_id_col, items as items_table, name as item_name_col};

    ranking_items
        .filter(ranking_id.eq(ranking_id_param))
        .inner_join(items_table.on(item_id_col.eq(item_id)))
        .select((ranking_items::all_columns(), item_name_col))
        .load::<(RankingItem, String)>(conn)
        .map(|results| results.into_iter().map(|(ranking_item, item_name)| {
            RankingItemWithName {
                id: ranking_item.id,
                ranking_id: ranking_item.ranking_id,
                item_id: ranking_item.item_id,
                rank: ranking_item.rank,
                name: item_name,
                score: ranking_item.score,
            }
        }).collect())
}

/// Exchanges ranks of ranking items based on the new item order provided.
///
/// This function updates the ranks of items in the database according to the specified new rankings.
/// It returns the number of items whose ranks were successfully updated or an error if the operation fails.
pub fn update_ranks(conn: &mut PgConnection, new_rankings: Vec<NewRankings>) -> Result<usize, Error> {
    for ranking in &new_rankings {
        // Fetch the current item and its current rank
        let current_item: RankingItem = ranking_items::table
            .find(ranking.id)
            .first(conn)?;

        // Fetch the target item based on the new rank
        let target_item: RankingItem = ranking_items::table
            .filter(ranking_items::rank.eq(ranking.new_rank))
            .first(conn)?;

        // Swap ranks: Set target item's rank to current item's rank
        diesel::update(ranking_items::table.find(target_item.id))
            .set(ranking_items::rank.eq(current_item.rank))
            .execute(conn)?;

        // Update the current item's rank to the new rank
        diesel::update(ranking_items::table.find(ranking.id))
            .set(ranking_items::rank.eq(ranking.new_rank))
            .execute(conn)?;
    }
    Ok(new_rankings.len()) // Return the count of updated rankings
}

/// Updates the ranks of items in the ranking_items table based on the provided new ranks.
/// Each tuple in the input vector contains the item ID and the new rank index.
/// Returns the number of successfully updated ranks.
pub fn set_item_ranks(conn: &mut PgConnection, new_ranks: Vec<(i32, i32)>) -> Result<usize, Error> {
    for (index, (item_id, _)) in new_ranks.iter().enumerate() {
        diesel::update(ranking_items::table.filter(ranking_items::id.eq(item_id)))
            .set(ranking_items::rank.eq((index + 1) as i32))
            .execute(conn)?;
    }

    Ok(new_ranks.len())
}