use crate::handlers::duel_handlers::Winner;
use crate::models::ranking_items_models::RankingItemWithName;
use crate::ranking_item_service::get_ranking_items_by_ranking_id;
use crate::schema::ranking_items::dsl::ranking_items;
use crate::schema::ranking_items::{id, score};
use diesel::prelude::*;
use rand::Rng;
use serde_derive::Serialize;

#[derive(Serialize)]
pub struct ItemDuel {
    pub id: i32,
    pub name: String,
    pub image: String,
}

fn battle_over(ranking_id_param: i32) -> bool {
    false
}
#[derive(Serialize)]
pub enum DuelResult {
    Finished(String),
    NextDuel(Vec<ItemDuel>),
}

/// Je reçois l'id du ranking et l'id de l'item qui a gagné
pub fn next_duel(conn: &mut PgConnection, ranking_id_param: i32, winner: Winner) -> Result<DuelResult, Box<dyn std::error::Error>> {
    store_winner(conn, winner).expect("TODO: panic message");

    if battle_over(ranking_id_param) {
        Ok(DuelResult::Finished("fin".to_string()))
    } else {
        let response = pick_duel_candidates(conn, ranking_id_param, add_one_to_winner)?;
        Ok(DuelResult::NextDuel(response))
    }
}

fn pick_random_dual_candidates(max: usize) -> (usize, usize) {
    let mut rng = rand::thread_rng();
    let position_1 = rng.gen_range(0..max);
    let mut position_2 = rng.gen_range(0..max);
    while position_1 == position_2 {
        position_2 = rng.gen_range(0..max);
    }
    (position_1, position_2)
}


/// Call the algorithm
pub fn init_duel(conn: &mut PgConnection, ranking_id_param: i32) -> Result<Vec<ItemDuel>, Box<dyn std::error::Error>> {
    let response = pick_duel_candidates(conn, ranking_id_param, add_one_to_winner)?;
    Ok(response)
}


/// Retrieves two items from a ranking list based on the given ranking ID and algorithm.
pub fn pick_duel_candidates(conn: &mut PgConnection, ranking_id_param: i32, algo: fn(usize, Vec<RankingItemWithName>) -> (usize, usize)) -> Result<Vec<ItemDuel>, Box<dyn std::error::Error>> {
    let items = get_ranking_items_by_ranking_id(conn, ranking_id_param)?;
    let list_size = items.len();
    if list_size < 2 {
        return Err("Not enough items for a duel.".into());
    }

    let (position_1, position_2) = algo(list_size, items.clone());

    let item_1 = ItemDuel {
        id: position_1 as i32,
        name: items[position_1].name.clone(),
        image: format!("image_{}.png", position_1),
    };
    let item_2 = ItemDuel {
        id: position_2 as i32,
        name: items[position_2].name.clone(),
        image: format!("image_{}.png", position_2),
    };

    Ok(vec![item_1, item_2])
}

#[derive(Debug)]
struct ScoreId {
    id: i32,
    score: i32,
}

/// Pour que ce soit intelligent, il faut qu'on puisse comparer
fn add_one_to_winner(max: usize, items: Vec<RankingItemWithName>) -> (usize, usize) {
    let new_items: Vec<ScoreId> = items.into_iter()
        .map(|item| ScoreId {
            id: item.id.clone(),
            score: item.score.clone(),
        })
        .collect();
    print!("{:?}", new_items);
    pick_random_dual_candidates(max)
}


pub fn store_winner(conn: &mut PgConnection, winner: Winner) -> QueryResult<usize> {
    diesel::update(ranking_items)
        .filter(id.eq(winner.id))
        .set(score.eq(score + 1))
        .execute(conn)
}

