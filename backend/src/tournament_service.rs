use crate::models::duel_models::ItemDuel;
use crate::models::ranking_items_models::RankingItemWithNameAndImage;
use crate::ranking_item_service::fetch_ranking_items_with_names;
use crate::schema::ranking_items::dsl::ranking_items;
use crate::schema::ranking_items::{item_id, rank, ranking_id, score};
use diesel::prelude::*;
use rand::seq::SliceRandom;
use rand::thread_rng;

pub fn reset_tournament(conn: &mut PgConnection, ranking_id_param: i32) -> QueryResult<usize> {
    let update_result = diesel::update(ranking_items)
        .filter(ranking_id.eq(ranking_id_param))
        .set(rank.eq(0))
        .execute(conn);

    match update_result {
        Ok(count) => {
            println!("Update successful, {} rows updated", count);
            Ok(count)
        }
        Err(e) => {
            eprintln!("Error updating tournament: {:?}", e);
            Err(e)
        }
    }
}

pub fn generate_round(conn: &mut PgConnection, ranking_id_param: i32) -> Result<Vec<(ItemDuel, ItemDuel)>, Box<dyn std::error::Error>> {
    let mut rng = thread_rng();
    let items_result: QueryResult<Vec<RankingItemWithNameAndImage>> = fetch_ranking_items_with_names(conn, ranking_id_param);
    let items_left = number_items_left_in_tournament(conn, ranking_id_param);
    let total_items = number_total_items_in_tournament(conn, ranking_id_param);
    println!("generate round");
    if items_left == 1 {
        diesel::update(ranking_items)
            .filter(rank.eq(0))
            .set(rank.eq(1))
            .execute(conn)?;
    }
    match items_result {
        Ok(items) => {
            let mut filtered_items: Vec<RankingItemWithNameAndImage> = items.into_iter()
                .filter(|item| item.rank == 0) // Utiliser une fonction Rust pour filtrer les items
                .collect();

            if items_left == total_items {
                filtered_items.shuffle(&mut rng);
                for (index, item) in filtered_items.iter().enumerate() {
                    diesel::update(ranking_items)
                        .filter(ranking_id.eq(ranking_id_param).and(item_id.eq(item.id)))
                        .set(score.eq(index as i32))
                        .execute(conn)?;
                }
            } else {
                filtered_items.sort_by(|a, b| b.score.cmp(&a.score))
            }

            let new_items: Vec<ItemDuel> = filtered_items.into_iter()
                .map(ItemDuel::from)
                .collect();

            Ok(create_pairs(new_items))
        }
        Err(e) => {
            eprintln!("Failed to fetch items: {:?}", e);
            Err(Box::new(e))
        }
    }
}

pub fn process_round(conn: &mut PgConnection, ranking_id_param: i32, data: Vec<i32>) -> Result<Vec<(ItemDuel, ItemDuel)>, Box<dyn std::error::Error>> {
    use crate::schema::ranking_items::dsl::rank;
    let position = 2 * data.len() as i32; // Calculate position

    for id_param in data {
        diesel::update(ranking_items)
            .filter(item_id.eq(id_param))
            .set(rank.eq(position))
            .execute(conn)?;
    }

    generate_round(conn, ranking_id_param)
}


fn create_pairs<T: Clone>(array: Vec<T>) -> Vec<(T, T)> {
    array
        .chunks_exact(2)
        .map(|chunk| (chunk[0].clone(), chunk[1].clone()))
        .collect()
}


fn number_duels_max_tournament(conn: &mut PgConnection, ranking_id_param: i32) -> i64 {
    let number_items: i64 = ranking_items
        .filter(ranking_id.eq(ranking_id_param))
        .count()
        .get_result(conn)
        .unwrap_or(0);

    let number_duels_max = number_items * (number_items + 2) / 8;

    number_duels_max
}
fn number_items_left_in_tournament(conn: &mut PgConnection, ranking_id_param: i32) -> i64 {
    let number_items: i64 = ranking_items
        .filter(ranking_id.eq(ranking_id_param))
        .filter(rank.eq(0))
        .count()
        .get_result(conn)
        .unwrap_or(0);

    number_items
}

fn number_total_items_in_tournament(conn: &mut PgConnection, ranking_id_param: i32) -> i64 {
    let number_items: i64 = ranking_items
        .filter(ranking_id.eq(ranking_id_param))
        .count()
        .get_result(conn)
        .unwrap_or(0);

    number_items
}