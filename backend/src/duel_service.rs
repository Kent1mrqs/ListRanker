use crate::models::duel_models::{BattleResult, DuelResult, ItemDuel};
use crate::ranking_item_service::{get_ranking_items_by_ranking_id, update_ranks};
use crate::schema::duels::dsl::duels;
use crate::schema::duels::{loser, winner};
use crate::schema::items::dsl::items;
use crate::schema::ranking_items::dsl::ranking_items;
use diesel::dsl::{count, count_star, sum};
use diesel::prelude::*;
use rand::Rng;

fn battle_over(conn: &mut PgConnection, ranking_id_param: i32) -> bool {
    use crate::schema::ranking_items::{id, ranking_id, score};
    let number_items: i64 = ranking_items
        .filter(ranking_id.eq(ranking_id_param))
        .select(count(id))
        .first(conn)
        .unwrap_or(0);
    let max_score = number_items.clone() * (number_items - 1) / 2;

    let total_score = ranking_items
        .filter(ranking_id.eq(ranking_id_param))
        .select(sum(score))
        .first(conn)
        .unwrap_or(Some(0))
        .unwrap_or(0);

    total_score >= max_score
}

/// Je reçois l'id du ranking et l'id de l'item qui a gagné
pub fn next_duel(conn: &mut PgConnection, ranking_id_param: i32, battle_result: BattleResult) -> Result<DuelResult, Box<dyn std::error::Error>> {
    store_winner(conn, battle_result).expect("TODO: panic message");

    if battle_over(conn, ranking_id_param) {
        generate_ranking(conn, ranking_id_param);
        Ok(DuelResult::Finished("fin".to_string()))
    } else {
        let response = pick_duel_candidates(conn, ranking_id_param, find_duel)?;
        Ok(DuelResult::NextDuel(response))
    }
}

fn pick_random_dual_candidates(max: i64) -> (i32, i32) {
    let mut rng = rand::thread_rng();
    let position_1 = rng.gen_range(0..max) as i32;
    let mut position_2 = rng.gen_range(0..max) as i32;
    while position_1 == position_2 {
        position_2 = rng.gen_range(0..max) as i32;
    }
    (position_1, position_2)
}


/// Call the algorithm
pub fn init_duel(conn: &mut PgConnection, ranking_id_param: i32) -> Result<Vec<ItemDuel>, Box<dyn std::error::Error>> {
    let response = pick_duel_candidates(conn, ranking_id_param, find_duel)?;
    Ok(response)
}

pub fn already_done_duel(conn: &mut PgConnection, item_1_id: i32, item_2_id: i32) -> bool {
    let item_1_id = item_1_id;
    let item_2_id = item_2_id;

    let result = duels
        .filter(loser.eq(item_1_id))
        .filter(winner.eq(item_2_id))
        .select((loser, winner))
        .first::<(i32, i32)>(conn)
        .optional();

    match result {
        Ok(Some(_)) => true,
        Ok(None) => false,
        Err(_) => false,
    }
}


/// Retrieves two items from a ranking list based on the given ranking ID and algorithm.
pub fn pick_duel_candidates(conn: &mut PgConnection, ranking_id_param: i32, algo: fn(i64) -> (i32, i32)) -> Result<Vec<ItemDuel>, Box<dyn std::error::Error>> {
    use crate::schema::ranking_items::ranking_id;
    let list_size: i64 = ranking_items
        .filter(ranking_id.eq(ranking_id_param))
        .select(count_star())
        .first(conn)?;
    if list_size < 2 {
        return Err("Not enough items for a duel.".into());
    }
    let items_list = get_ranking_items_by_ranking_id(conn, ranking_id_param)?;
    let (mut position_id_1, mut position_id_2) = algo(list_size);

    while already_done_duel(conn, position_id_1, position_id_2) || already_done_duel(conn, position_id_2, position_id_1) {
        (position_id_1, position_id_2) = algo(list_size);
    }

    let item_1 = ItemDuel {
        id: position_id_1,
        name: items_list[position_id_1 as usize].name.clone(),
        image: format!("image_{}.png", position_id_1),
    };
    let item_2 = ItemDuel {
        id: position_id_2,
        name: items_list[position_id_2 as usize].name.clone(),
        image: format!("image_{}.png", position_id_2),
    };

    Ok(vec![item_1, item_2])
}

fn find_duel(max: i64) -> (i32, i32) {
    pick_random_dual_candidates(max)
}


pub fn store_winner(conn: &mut PgConnection, battle_result: BattleResult) -> QueryResult<usize> {
    use crate::schema::ranking_items::{item_id, ranking_id, score};
    use crate::schema::items::{id, position_list};

    diesel::insert_into(duels)
        .values(&battle_result)
        .execute(conn)?;

    let item_id_to_update: i32 = ranking_items
        .filter(ranking_id.eq(battle_result.ranking_id))
        .inner_join(items.on(id.eq(item_id)))
        .filter(position_list.eq(battle_result.winner))
        .select(item_id)
        .first(conn)?;

    diesel::update(ranking_items)
        .filter(item_id.eq(item_id_to_update))
        .set(score.eq(score + 1))
        .execute(conn)
}

pub fn generate_ranking(conn: &mut PgConnection, ranking_id_param: i32) -> QueryResult<usize> {
    use crate::schema::ranking_items::{id, ranking_id, score};

    let new_rank_order = ranking_items
        .filter(ranking_id.eq(ranking_id_param))
        .order(score.desc())
        .select((id, score))
        .load(conn)?;

    let updated_count = update_ranks(conn, new_rank_order)?;
    Ok(updated_count)
}