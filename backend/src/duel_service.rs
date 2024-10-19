use crate::models::duel_models::{BattleResult, DuelResult, ItemDuel, NextDuelData};
use crate::ranking_item_service::{fetch_ranking_items_with_names, set_item_ranks};
use crate::schema::duels::dsl::duels;
use crate::schema::duels::{loser, winner};
use crate::schema::items::dsl::items;
use crate::schema::ranking_items::dsl::ranking_items;
use diesel::dsl::{count_star, sum};
use diesel::prelude::*;
use rand::Rng;

fn number_duels_left(conn: &mut PgConnection, ranking_id_param: i32) -> i64 {
    use crate::schema::ranking_items::{ranking_id, score};

    // Get the total number of items in the ranking
    let number_items: i64 = ranking_items
        .filter(ranking_id.eq(ranking_id_param))
        .count()
        .get_result(conn)
        .unwrap_or(0);

    // Calculate the maximum possible score
    let max_score = number_items * (number_items - 1) / 2;

    // Get the current total score of all ranking items
    let total_score: i64 = ranking_items
        .filter(ranking_id.eq(ranking_id_param))
        .select(sum(score))
        .first(conn)
        .unwrap_or(Some(0))
        .unwrap_or(0);

    max_score - total_score
}

/// Selects two unique random candidates for a duel from a specified range.
fn pick_unique_random_duel_candidates(max: i64) -> (i32, i32) {
    let mut rng = rand::thread_rng();
    let position_1 = rng.gen_range(0..max) as i32;
    let position_2 = loop {
        let pos = rng.gen_range(0..max) as i32;
        if pos != position_1 {
            break pos;
        }
    };
    (position_1, position_2)
}

/// Determines the next duel or concludes the battle based on the given result.
pub fn process_next_duel(conn: &mut PgConnection, ranking_id_param: i32, battle_result: BattleResult) -> Result<DuelResult, Box<dyn std::error::Error>> {
    record_battle_winner(conn, battle_result)?;
    resolve_duel_state(conn, ranking_id_param)
}

/// Initializes the duel process by checking if the battle is complete and either generating a ranking or selecting duel candidates.
pub fn initialize_duel(conn: &mut PgConnection, ranking_id_param: i32) -> Result<DuelResult, Box<dyn std::error::Error>> {
    resolve_duel_state(conn, ranking_id_param)
}

/// Resolves the current state of the duel by determining if the battle is complete and either generating rankings or picking duel candidates.
fn resolve_duel_state(conn: &mut PgConnection, ranking_id_param: i32) -> Result<DuelResult, Box<dyn std::error::Error>> {
    if number_duels_left(conn, ranking_id_param) == 0 {
        let _ = update_ranking(conn, ranking_id_param);
        Ok(DuelResult::Finished("fin".to_string()))
    } else {
        let response = pick_duel_candidates(conn, ranking_id_param, pick_unique_random_duel_candidates)?;
        let data = NextDuelData {
            next_duel: response,
            duels_left: number_duels_left(conn, ranking_id_param),
        };

        Ok(DuelResult::NextDuelData(data))
    }
}

/// Checks if a duel between the specified items has already occurred.
pub fn has_duel_occurred(conn: &mut PgConnection, item_1_id: i32, item_2_id: i32) -> bool {
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
    let items_list = fetch_ranking_items_with_names(conn, ranking_id_param)?;
    let (mut position_id_1, mut position_id_2) = algo(list_size);

    while has_duel_occurred(conn, position_id_1, position_id_2) || has_duel_occurred(conn, position_id_2, position_id_1) {
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

/// Records the winner of a battle by inserting the battle result and updating the winner's score.
pub fn record_battle_winner(conn: &mut PgConnection, battle_result: BattleResult) -> QueryResult<usize> {
    use crate::schema::ranking_items::{item_id, ranking_id, score};
    use crate::schema::items::{id, position_list};

    // Insert the battle result into the duels table
    diesel::insert_into(duels)
        .values(&battle_result)
        .execute(conn)?;

    // Retrieve the item ID of the winner based on the ranking and position
    let item_id_to_update: i32 = ranking_items
        .filter(ranking_id.eq(battle_result.ranking_id))
        .inner_join(items.on(id.eq(item_id))) // inner join on items to get position_list
        .filter(position_list.eq(battle_result.winner))
        .select(item_id)
        .first(conn)?;

    // Update the score of the winner
    diesel::update(ranking_items)
        .filter(item_id.eq(item_id_to_update))
        .set(score.eq(score + 1))
        .execute(conn)
}

/// Updates the ranking by reordering items based on their scores and returns the count of updated records.
pub fn update_ranking(conn: &mut PgConnection, ranking_id_param: i32) -> QueryResult<usize> {
    use crate::schema::ranking_items::{id, ranking_id, score};

    // Load the items in the specified ranking ordered by score in descending order
    let new_rank_order = ranking_items
        .filter(ranking_id.eq(ranking_id_param))
        .order(score.desc())
        .select((id, score))
        .load(conn)?;

    // Update the ranks based on the new order and return the count of updated records
    let updated_count = set_item_ranks(conn, new_rank_order)?;
    Ok(updated_count)
}