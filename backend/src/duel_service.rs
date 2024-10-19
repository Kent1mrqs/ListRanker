use crate::models::duel_models::{BattleResult, DuelResult, ItemDuel, NextDuelData};
use crate::ranking_item_service::{fetch_ranking_items_with_names, set_item_ranks};
use crate::schema::duels::dsl::duels;
use crate::schema::duels::{loser, winner};
use crate::schema::items::dsl::items;
use crate::schema::items::id;
use crate::schema::ranking_items::dsl::ranking_items;
use crate::schema::ranking_items::{ranking_id, score};
use diesel::dsl::{count_star, sum};
use diesel::prelude::*;
use rand::Rng;

/// Calculates the number of duels left by checking the total number of items
/// in the ranking and comparing the possible maximum score to the current total score.
fn number_duels_left(conn: &mut PgConnection, ranking_id_param: i32) -> i64 {
    println!("\nCalculating number of duels left for ranking ID: {}", ranking_id_param);
    // Get the total number of items in the ranking for the specified ranking ID
    let number_items: i64 = ranking_items
        .filter(ranking_id.eq(ranking_id_param))
        .count()
        .get_result(conn)
        .unwrap_or(0);

    // Calculate the maximum possible score based on the number of items
    let max_score = number_items * (number_items - 1) / 2;

    // Get the current total score from the database
    let total_score = get_total_score(conn, ranking_id_param);

    // Calculate and return the number of duels left by subtracting total score from max score
    let duels_left = max_score - total_score;
    println!("Number of duels left for ranking ID {}: {}\n", ranking_id_param, duels_left);

    duels_left
}

/// Get the current total score of all ranking items
fn get_total_score(conn: &mut PgConnection, ranking_id_param: i32) -> i64 {
    let total_score: i64 = ranking_items
        .filter(ranking_id.eq(ranking_id_param))
        .select(sum(score))
        .first(conn)
        .unwrap_or(Some(0))
        .unwrap_or(0);
    total_score
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
/// Selects two unique sequence candidates for a duel from a specified range.
fn pick_unique_sequence_duel_candidates(max: i32, score_param: i32) -> (i32, i32) {
    let max = max as f64;
    let score_param = score_param as f64;

    let i: f64 = 2.0 * max - 1.0 - ((4.0 * max * (max - 1.0) + 1.0 - 8.0 * score_param).sqrt());
    let position_1 = (i / 2.0).floor();
    let c: f64 = position_1 * (2.0 * max - position_1 - 1.0) / 2.0;
    let delta_j: f64 = score_param - c;
    let j: f64 = position_1 + 1.0 + delta_j;
    let position_2 = j.floor();

    (position_1 as i32, position_2 as i32)
}

/// Determines the next duel or concludes the battle based on the given result.
pub fn process_next_duel(conn: &mut PgConnection, ranking_id_param: i32, battle_result: BattleResult) -> Result<DuelResult, Box<dyn std::error::Error>> {
    if !has_duel_occurred(conn, battle_result.winner, battle_result.loser) & !has_duel_occurred(conn, battle_result.loser, battle_result.winner) {
        record_battle_winner(conn, battle_result)?;
    } else {
        print!("Duel has already occured");
    }
    resolve_duel_state(conn, ranking_id_param)
}

/// Initializes the duel process by checking if the battle is complete and either generating a ranking or selecting duel candidates.
pub fn initialize_duel(conn: &mut PgConnection, ranking_id_param: i32) -> Result<DuelResult, Box<dyn std::error::Error>> {
    resolve_duel_state(conn, ranking_id_param)
}

/// Resolves the current state of the duel by determining if the battle is complete
/// and either generating rankings or picking duel candidates.
fn resolve_duel_state(conn: &mut PgConnection, ranking_id_param: i32) -> Result<DuelResult, Box<dyn std::error::Error>> {
    println!("\nResolving duel state for ranking ID: {}", ranking_id_param);

    // Check if there are no more duels left
    if number_duels_left(conn, ranking_id_param) <= 0 {
        println!("No more duels left for ranking ID: {}. Updating ranking...\n", ranking_id_param);

        let update_result = update_ranking(conn, ranking_id_param);
        match update_result {
            Ok(_) => println!("Ranking successfully updated for ranking ID: {}", ranking_id_param),
            Err(e) => eprintln!("Error updating ranking for ranking ID {}: {:?}", ranking_id_param, e),
        }

        Ok(DuelResult::Finished("fin".to_string()))
    } else {
        println!("Duels still left for ranking ID: {}. Picking next duel candidates...\n", ranking_id_param);

        let response = pick_duel_candidates(conn, ranking_id_param, pick_unique_sequence_duel_candidates)?;

        let duels_left = number_duels_left(conn, ranking_id_param);

        let data = NextDuelData {
            next_duel: response,
            duels_left,
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
/// It ensures that the selected items haven't already faced each other in a duel.
pub fn pick_duel_candidates(
    conn: &mut PgConnection,
    ranking_id_param: i32,
    algo: fn(i32, i32) -> (i32, i32),
) -> Result<Vec<ItemDuel>, Box<dyn std::error::Error>> {
    use crate::schema::ranking_items::ranking_id;

    println!("\nPicking duel candidates for ranking ID: {}", ranking_id_param);

    // Get the total number of items in the ranking list
    let list_size: i64 = ranking_items
        .filter(ranking_id.eq(ranking_id_param))
        .select(count_star())
        .first(conn)?;

    // Check if there are enough items to create a duel
    if list_size < 2 {
        println!("Not enough items to create a duel for ranking ID: {}", ranking_id_param);
        return Err("Not enough items for a duel.".into());
    }

    // Retrieve the current total score for the ranking ID
    let score_number = get_total_score(conn, ranking_id_param);

    // Fetch the list of ranking items along with their names
    let items_list = fetch_ranking_items_with_names(conn, ranking_id_param)?;

    // Use the algorithm to determine initial positions for duel candidates
    let (position_id_1, position_id_2) = algo(list_size as i32, score_number as i32);

    // Ensure that the two positions selected haven't had a duel before
    /*    while has_duel_occurred(conn, position_id_1, position_id_2) || has_duel_occurred(conn, position_id_2, position_id_1) {
            println!(
                "Duel has already occurred between items {} and {}. Picking new candidates...",
                position_id_1, position_id_2
            );
            (position_id_1, position_id_2) = algo(list_size as i32, score_number as i32);
            println!(
                "New duel candidate positions picked by algorithm: {}, {}",
                position_id_1, position_id_2
            );
        }*/

    // Create ItemDuel objects for the selected items
    let item_1 = ItemDuel {
        id: position_id_1,
        name: items_list[position_id_1 as usize].name.clone(),
    };
    let item_2 = ItemDuel {
        id: position_id_2,
        name: items_list[position_id_2 as usize].name.clone(),
    };

    println!(
        "Duel candidates selected: {} (ID: {}), {} (ID: {})\n",
        item_1.name, item_1.id, item_2.name, item_2.id
    );

    Ok(vec![item_1, item_2])
}

/// Records the winner of a battle by inserting the battle result and updating the winner's score.
pub fn record_battle_winner(conn: &mut PgConnection, battle_result: BattleResult) -> QueryResult<usize> {
    use crate::schema::ranking_items::{item_id, ranking_id, score};
    use crate::schema::items::position_list;

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

/// Resets the scores in ranking_items and deletes all duels associated with the given ranking ID.
pub fn reset_duel(conn: &mut PgConnection, ranking_id_param: i32) -> QueryResult<usize> {
    use crate::schema::ranking_items;
    use crate::schema::duels;

    conn.transaction::<_, diesel::result::Error, _>(|conn| {
        // Reset scores
        let update_result = diesel::update(ranking_items.filter(ranking_items::ranking_id.eq(ranking_id_param)))
            .set(score.eq(0))
            .execute(conn);
        match update_result {
            Ok(count) => {
                println!("Update successful, {} rows affected", count);
                if count == 0 {
                    return Err(diesel::result::Error::NotFound);
                }
            }
            Err(e) => {
                println!("Error resetting scores: {:?}", e);
                return Err(e);
            }
        }
        // Delete associated duels
        let delete_result = diesel::delete(duels.filter(duels::ranking_id.eq(ranking_id_param)))
            .execute(conn);

        match delete_result {
            Ok(count) => {
                println!("Delete successful, {} rows deleted", count);
                Ok(count)
            }
            Err(e) => {
                println!("Error deleting duels: {:?}", e);
                Err(e)
            }
        }
    })
}