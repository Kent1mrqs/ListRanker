use crate::item_service::convert_to_base64;
use crate::models::duel_models::{BattleResult, DuelResult, ItemDuel, NextDuelData};
use crate::models::ranking_items_models::RankingItemWithNameAndImage;
use crate::ranking_item_service::{fetch_ranking_items_with_names, set_item_ranks};
use crate::schema::duels::dsl::duels;
use crate::schema::items::dsl::items;
use crate::schema::items::{id, position_list};
use crate::schema::ranking_items::dsl::ranking_items;
use crate::schema::ranking_items::{ranking_id, score};
use diesel::dsl::count_star;
use diesel::prelude::*;
use rand::Rng;

/// Calculates the number of duels left by checking the total number of items
/// in the ranking and comparing the possible maximum score to the current total score.
fn number_duels_left(conn: &mut PgConnection, ranking_id_param: i32) -> i64 {
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

    duels_left
}

/// Get the current total score of all ranking items
fn get_total_score(conn: &mut PgConnection, ranking_id_param: i32) -> i64 {
    use crate::schema::duels::dsl::*;
    let total_score: i64 = duels
        .filter(ranking_id.eq(ranking_id_param))
        .count()
        .get_result(conn)
        .unwrap_or(0);
    total_score
}

fn get_min_max_scores(conn: &mut PgConnection, ranking_id_parama: i32) -> QueryResult<(Option<i32>, Option<i32>)> {
    use crate::schema::ranking_items::dsl::*;

    let min_score = ranking_items
        .filter(ranking_id.eq(ranking_id_parama))
        .select(diesel::dsl::min(score))
        .first::<Option<i32>>(conn)?;
    let max_score = ranking_items
        .filter(ranking_id.eq(ranking_id_parama))
        .select(diesel::dsl::max(score))
        .first::<Option<i32>>(conn)?;

    Ok((min_score, max_score))
}


/// Selects two unique random candidates for a duel from a specified range.
fn pick_unique_random_duel_candidates(max: i32, _score_number: i32, _conn: &mut PgConnection, _ranking_id_param: i32) -> (i32, i32) {
    let mut rng = rand::thread_rng();
    let position_1 = rng.gen_range(0..max);
    let position_2 = loop {
        let pos = rng.gen_range(0..max);
        if pos != position_1 {
            break pos;
        }
    };
    (position_1, position_2)
}

/// Selects two unique sequence candidates for a duel from a specified range.
fn _pick_unique_sequence_duel_candidates(max: i32, score_param: i32) -> (i32, i32) {
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

fn get_items_with_value(conn: &mut PgConnection, ranking_id_param: i32, other_score: Option<i32>) -> Vec<i32> {
    use crate::schema::items::dsl::id as items_id;
    let items_result: Vec<i32> = if let Some(other_score) = other_score {
        ranking_items
            .filter(ranking_id.eq(ranking_id_param))
            .filter(score.eq(other_score))
            .inner_join(items.on(items_id.eq(crate::schema::ranking_items::item_id)))
            .select(position_list)
            .load(conn)
            .unwrap_or_default()
    } else {
        Vec::new()
    };
    items_result
}

/// Selects two unique sequence candidates for a duel from a specified range.
fn pick_min_max_duel_candidates(_max: i32, _score_param: i32, conn: &mut PgConnection, ranking_id_param: i32) -> (i32, i32) {
    let (min_score, max_score) = match get_min_max_scores(conn, ranking_id_param) {
        Ok((min_score, max_score)) => {
            (min_score, max_score)
        }
        Err(_e) => {
            (None, None)
        }
    };
    let min_items: Vec<i32> = get_items_with_value(conn, ranking_id_param, min_score);
    let max_items: Vec<i32> = get_items_with_value(conn, ranking_id_param, max_score);


    if let (Some(min_item), Some(max_item)) = (min_items.first(), max_items.first()) {
        return (*min_item, *max_item);
    }
    (-1, -1)
}

/// Retrieves a list of item IDs that have beaten the specified winner in previous duels.
fn get_items_who_beat_winner(conn: &mut PgConnection, ranking_id_param: i32, winner_id: i32) -> QueryResult<Vec<i32>> {
    use crate::schema::duels::{loser, ranking_id, winner};

    duels
        .filter(ranking_id.eq(ranking_id_param))
        .filter(loser.eq(winner_id))
        .select(winner)
        .load(conn)
}

/// Retrieves a list of item IDs that were defeated by the specified loser in previous duels.
fn get_items_beaten_by_loser(conn: &mut PgConnection, ranking_id_param: i32, loser_id: i32) -> QueryResult<Vec<i32>> {
    use crate::schema::duels::{loser, ranking_id, winner};

    duels
        .filter(ranking_id.eq(ranking_id_param))
        .filter(winner.eq(loser_id))
        .select(loser)
        .load(conn)
}

/// Determines the next duel or concludes the battle based on the given result.
pub fn process_next_duel(conn: &mut PgConnection, ranking_id_param: i32, battle_result: BattleResult) -> Result<DuelResult, Box<dyn std::error::Error>> {
    if !has_duel_occurred(conn, battle_result.winner, battle_result.loser, ranking_id_param) & !has_duel_occurred(conn, battle_result.loser, battle_result.winner, ranking_id_param) {
        record_battle_winner(conn, battle_result)?;
    } else {
        print!("Duel has already occured");
    }
    resolve_duel_state(conn, ranking_id_param)
}

/// Initializes the duel process by checking if the battle is complete and either generating a ranking or selecting duel candidates.
pub fn initialize_duel(conn: &mut PgConnection, ranking_id_param: i32) -> Result<DuelResult, Box<dyn std::error::Error>> {
    if get_total_score(conn, ranking_id_param) == 0 {
        let response = pick_duel_candidates(conn, ranking_id_param, pick_unique_random_duel_candidates)?;

        let data = NextDuelData {
            next_duel: response,
            duels_left: number_duels_left(conn, ranking_id_param),
        };

        Ok(DuelResult::NextDuelData(data))
    } else {
        resolve_duel_state(conn, ranking_id_param)
    }
}

/// Resolves the current state of the duel by determining if the battle is complete
/// and either generating rankings or picking duel candidates.
fn resolve_duel_state(conn: &mut PgConnection, ranking_id_param: i32) -> Result<DuelResult, Box<dyn std::error::Error>> {
    let duels_left = number_duels_left(conn, ranking_id_param);

    // Check if there are no more duels left
    if duels_left <= 0 {
        let update_result = update_ranking(conn, ranking_id_param);
        match update_result {
            Ok(_) => println!("Ranking successfully updated for ranking ID: {}", ranking_id_param),
            Err(e) => eprintln!("Error updating ranking for ranking ID {}: {:?}", ranking_id_param, e),
        }

        Ok(DuelResult::Finished("fin".to_string()))
    } else {
        let response = pick_duel_candidates(conn, ranking_id_param, pick_min_max_duel_candidates)?;

        let data = NextDuelData {
            next_duel: response,
            duels_left,
        };

        Ok(DuelResult::NextDuelData(data))
    }
}

/// Checks if a duel between the specified items has already occurred.
pub fn has_duel_occurred(conn: &mut PgConnection, item_1_id: i32, item_2_id: i32, ranking_id_param: i32) -> bool {
    use crate::schema::duels::dsl::{duels, loser, ranking_id, winner};
    let result = duels
        .filter(ranking_id.eq(ranking_id_param))
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
    algo: fn(i32, i32, &mut PgConnection, i32) -> (i32, i32),
) -> Result<Vec<ItemDuel>, Box<dyn std::error::Error>> {
    use crate::schema::ranking_items::ranking_id;

    println!("\n---- Picking duel candidates for ranking ID: {} ----", ranking_id_param);

    let list_size: i64 = ranking_items
        .filter(ranking_id.eq(ranking_id_param))
        .select(count_star())
        .first(conn)?;

    if list_size < 2 {
        return Err("Not enough items for a duel.".into());
    }

    let score_number = get_total_score(conn, ranking_id_param);

    let items_list: Vec<RankingItemWithNameAndImage> = fetch_ranking_items_with_names(conn, ranking_id_param)?;

    let (mut position_id_1, mut position_id_2) = algo(list_size as i32, score_number as i32, conn, ranking_id_param);

    while has_duel_occurred(conn, position_id_1, position_id_2, ranking_id_param)
        || has_duel_occurred(conn, position_id_2, position_id_1, ranking_id_param)
    {
        println!(
            "Duel has already occurred between items {} and {}. Picking new candidates...",
            position_id_1, position_id_2
        );
        let (new_position_id_1, new_position_id_2) = pick_unique_random_duel_candidates(list_size as i32, score_number as i32, conn, ranking_id_param);
        println!(
            "New duel candidate positions picked by algorithm: {}, {}",
            new_position_id_1, new_position_id_2
        );
        position_id_1 = new_position_id_1;
        position_id_2 = new_position_id_2;
    }

    let item_1 = ItemDuel {
        id: position_id_1,
        name: items_list[position_id_1 as usize].name.clone(),
        image: items_list[position_id_1 as usize]
            .image
            .clone()
            .map_or_else(|| "".to_string(), |bytes| convert_to_base64(bytes, "image/png")),
    };
    let item_2 = ItemDuel {
        id: position_id_2,
        name: items_list[position_id_2 as usize].name.clone(),
        image: items_list[position_id_2 as usize]
            .image
            .clone()
            .map_or_else(|| "".to_string(), |bytes| convert_to_base64(bytes, "image/png")),
    };

    println!(
        "Duel candidates selected: {} (ID: {}), {} (ID: {})",
        item_1.name, item_1.id, item_2.name, item_2.id
    );

    println!("---- Duel selection complete ----\n");

    Ok(vec![item_1, item_2])
}

fn get_item_id_by_position(conn: &mut PgConnection, ranking_id_param: i32, position: i32) -> QueryResult<i32> {
    use crate::schema::items::position_list;
    use crate::schema::ranking_items::item_id;
    ranking_items
        .filter(ranking_id.eq(ranking_id_param))
        .inner_join(items.on(id.eq(item_id))) // jointure interne pour obtenir position_list
        .filter(position_list.eq(position))
        .select(item_id)
        .first(conn)
}

/// Records the winner of a battle by inserting the battle result and updating the winner's score.
pub fn record_battle_winner(conn: &mut PgConnection, battle_result: BattleResult) -> QueryResult<usize> {
    use crate::schema::ranking_items::{item_id, score};
    let winners: Vec<i32> = get_items_who_beat_winner(conn, battle_result.ranking_id, battle_result.winner)?;
    println!(
        "Items that have beaten the winner (ID: {}): {:?}",
        battle_result.loser, winners
    );

    let losers: Vec<i32> = get_items_beaten_by_loser(conn, battle_result.ranking_id, battle_result.loser)?;
    println!(
        "Items that were beaten by the loser (ID: {}): {:?}",
        battle_result.winner, losers
    );

    let mut duel_results = Vec::new();
    let mut count_winner = 0;
    let mut count_loser = 0;
    duel_results.push(battle_result.clone());

    for w in &winners {
        println!(
            "> Adding implicit duel result: Winner ID: {}, Loser ID: {}",
            *w, battle_result.loser
        );
        if !has_duel_occurred(conn, battle_result.loser, *w, battle_result.ranking_id) {
            duel_results.push(BattleResult {
                ranking_id: battle_result.ranking_id,
                winner: *w,
                loser: battle_result.loser,
            });
            count_winner = count_winner + 1
        }
    }
    println!("count_winner : {}", count_winner);
    for l in &losers {
        println!(
            "> Adding implicit duel result: Winner ID: {}, Loser ID: {}",
            battle_result.winner, *l
        );
        if !has_duel_occurred(conn, *l, battle_result.winner, battle_result.ranking_id) {
            duel_results.push(BattleResult {
                ranking_id: battle_result.ranking_id,
                loser: *l,
                winner: battle_result.winner,
            });
            count_loser = count_loser + 1
        }
    }
    println!("count_loser : {}", count_loser);
    conn.transaction::<_, diesel::result::Error, _>(|transaction_conn| {
        let winner_id = get_item_id_by_position(transaction_conn, battle_result.ranking_id, battle_result.winner)?;
        let loser_id = get_item_id_by_position(transaction_conn, battle_result.ranking_id, battle_result.loser)?;

        diesel::update(ranking_items)
            .filter(item_id.eq(winner_id))
            .set(score.eq(score + 1 + count_loser))
            .execute(transaction_conn)?;

        for w in &winners {
            if !has_duel_occurred(transaction_conn, battle_result.loser, *w, battle_result.ranking_id) {
                let wid = get_item_id_by_position(transaction_conn, battle_result.ranking_id, *w)?;
                diesel::update(ranking_items)
                    .filter(item_id.eq(wid))
                    .set(score.eq(score + 1))
                    .execute(transaction_conn)?;
            }
        }
        for l in &losers {
            if !has_duel_occurred(transaction_conn, *l, battle_result.winner, battle_result.ranking_id) {
                let lid = get_item_id_by_position(transaction_conn, battle_result.ranking_id, *l)?;
                diesel::update(ranking_items)
                    .filter(item_id.eq(lid))
                    .set(score.eq(score - 1))
                    .execute(transaction_conn)?;
            }
        }

        diesel::insert_into(duels)
            .values(&duel_results)
            .execute(transaction_conn)?;


        diesel::update(ranking_items)
            .filter(item_id.eq(loser_id))
            .set(score.eq(score - 1 - count_winner))
            .execute(transaction_conn)?;

        println!(
            "Transaction completed. Total duel results recorded: {}",
            duel_results.len()
        );

        Ok(duel_results.len())
    })
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