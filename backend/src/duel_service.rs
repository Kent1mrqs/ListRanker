use crate::models::duel_models::{BattleResultApi, BattleResultDb, DuelResult, ItemDuel, NextDuelData};
use crate::models::ranking_items_models::RankingItemWithNameAndImage;
use crate::ranking_item_service::{fetch_ranking_items_with_names, set_item_ranks};
use crate::schema::duels::dsl::duels;
use crate::schema::ranking_items::dsl::ranking_items;
use crate::schema::ranking_items::{item_id, ranking_id, score};
use diesel::prelude::*;
use diesel::result::Error;
use rand::seq::SliceRandom;
use rand::thread_rng;
use std::time::Instant;

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

fn get_min_max_scores(conn: &mut PgConnection, ranking_id_param: i32) -> QueryResult<(Option<i32>, Option<i32>)> {
    use crate::schema::ranking_items::dsl::*;

    let min_score = ranking_items
        .filter(ranking_id.eq(ranking_id_param))
        .select(diesel::dsl::min(score))
        .first::<Option<i32>>(conn)?;
    let max_score = ranking_items
        .filter(ranking_id.eq(ranking_id_param))
        .select(diesel::dsl::max(score))
        .first::<Option<i32>>(conn)?;

    Ok((min_score, max_score))
}

pub fn _get_explicit_duels(conn: &mut PgConnection, ranking_id_param: i32) -> QueryResult<i64> {
    use crate::schema::duels::dsl::*;
    duels
        .filter(ranking_id.eq(ranking_id_param))
        .filter(explicit.eq(true))
        .count()
        .get_result(conn)
}

/// Selects two unique random candidates for a duel from a specified range.
fn pick_unique_random_duel_candidates(conn: &mut PgConnection, ranking_id_param: i32) -> (ItemDuel, ItemDuel) {
    let filtered_items: QueryResult<Vec<RankingItemWithNameAndImage>> = fetch_ranking_items_with_names(conn, ranking_id_param);
    match filtered_items {
        Ok(items) => {
            let mut rng = thread_rng();
            let mut shuffled_items = items.clone();
            shuffled_items.shuffle(&mut rng);

            let selected_duels: Vec<ItemDuel> = shuffled_items.into_iter()
                .take(2)
                .map(ItemDuel::from)
                .collect();
            (selected_duels[0].clone(), selected_duels[1].clone())
        }
        Err(e) => {
            eprintln!("Failed to fetch items: {:?}", e);
            panic!("No items found")
        }
    }
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

fn get_items_with_value(conn: &mut PgConnection, ranking_id_param: i32, other_score: Option<i32>) -> Vec<ItemDuel> {
    if let Some(other_score) = other_score {
        let items_result: QueryResult<Vec<RankingItemWithNameAndImage>> = fetch_ranking_items_with_names(conn, ranking_id_param);
        match items_result {
            Ok(items) => {
                items.into_iter()
                    .filter(|item| item.score == other_score)
                    .map(ItemDuel::from)
                    .collect()
            }
            Err(e) => {
                eprintln!("Failed to fetch items: {:?}", e);
                Vec::new()
            }
        }
    } else {
        Vec::new()
    }
}

/// Selects two unique sequence candidates for a duel from a specified range.
fn pick_min_max_duel_candidates(conn: &mut PgConnection, ranking_id_param: i32) -> (ItemDuel, ItemDuel) {
    let (min_score, max_score) = match get_min_max_scores(conn, ranking_id_param) {
        Ok((min_score, max_score)) => {
            (min_score, max_score)
        }
        Err(_e) => {
            (None, None)
        }
    };
    let min_items: Vec<ItemDuel> = get_items_with_value(conn, ranking_id_param, min_score);
    let max_items: Vec<ItemDuel> = get_items_with_value(conn, ranking_id_param, max_score);
    let min_item = min_items.first().cloned().ok_or(Error::NotFound);
    let max_item = max_items.first().cloned().ok_or(Error::NotFound);

    (min_item.expect("reason"), max_item.expect("reason"))
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
pub fn process_next_duel(conn: &mut PgConnection, ranking_id_param: i32, battle_result: BattleResultApi) -> Result<DuelResult, Box<dyn std::error::Error>> {
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

    if duels_left <= 0 {
        let update_result = update_ranking(conn, ranking_id_param);
        match update_result {
            Ok(_) => println!("Ranking successfully updated for ranking ID: {}", ranking_id_param),
            Err(e) => eprintln!("Error updating ranking for ranking ID {}: {:?}", ranking_id_param, e),
        }

        Ok(DuelResult::Finished("fin".to_string()))
    } else {
        let response: Vec<ItemDuel> = pick_duel_candidates(conn, ranking_id_param, pick_min_max_duel_candidates)?;

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
pub fn pick_duel_candidates(conn: &mut PgConnection, ranking_id_param: i32, algo: fn(&mut PgConnection, i32) -> (ItemDuel, ItemDuel)) -> Result<Vec<ItemDuel>, Box<dyn std::error::Error>> {
    let start = Instant::now();

    println!("\n---- Picking duel candidates for ranking ID: {} ----", ranking_id_param);

    let duration = start.elapsed();

    println!("Execution time of pick_duel_candidates 1: {:?}", duration);
    let (mut result_1, mut result_2) = algo(conn, ranking_id_param);
    let duration = start.elapsed();
    // TODO: Optimize pick_min_max_duel_candidates
    println!("Execution time of pick_duel_candidates 2: {:?}", duration);
    while has_duel_occurred(conn, result_1.id, result_2.id, ranking_id_param)
        || has_duel_occurred(conn, result_2.id, result_1.id, ranking_id_param)
    {
        println!(
            "Duel has already occurred between items {:?} and {:?}. Picking new candidates...",
            result_1.id, result_2.id
        );
        let (new_result_1, new_result_2) = pick_unique_random_duel_candidates(conn, ranking_id_param);
        println!(
            "New duel candidate positions picked by algorithm: {}, {}",
            new_result_1.id, new_result_2.id
        );
        result_1 = new_result_1;
        result_2 = new_result_2;
    }

    let item_1 = ItemDuel {
        id: result_1.id.clone(),
        name: result_1.name.clone(),
        image: result_1.image.clone(),
    };
    let item_2 = ItemDuel {
        id: result_2.id.clone(),
        name: result_2.name.clone(),
        image: result_2.image.clone(),
    };

    println!(
        "Duel candidates selected: {} (ID: {}), {} (ID: {})",
        item_1.name, item_1.id, item_2.name, item_2.id
    );

    println!("---- Duel selection complete ----\n");

    Ok(vec![item_1, item_2])
}

/// Records the winner of a battle by inserting the battle result and updating the winner's score.
pub fn record_battle_winner(conn: &mut PgConnection, battle_result: BattleResultApi) -> QueryResult<usize> {
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
    duel_results.push(BattleResultDb {
        ranking_id: battle_result.ranking_id,
        winner: battle_result.winner,
        loser: battle_result.loser,
        explicit: true,
    });

    for w in &winners {
        println!(
            "> Adding implicit duel result: Winner ID: {}, Loser ID: {}",
            *w, battle_result.loser
        );
        if !has_duel_occurred(conn, battle_result.loser, *w, battle_result.ranking_id) {
            duel_results.push(BattleResultDb {
                ranking_id: battle_result.ranking_id,
                winner: *w,
                loser: battle_result.loser,
                explicit: false,
            });
            count_winner = count_winner + 1
        }
    }

    for l in &losers {
        println!(
            "> Adding implicit duel result: Winner ID: {}, Loser ID: {}",
            battle_result.winner, *l
        );
        if !has_duel_occurred(conn, *l, battle_result.winner, battle_result.ranking_id) {
            duel_results.push(BattleResultDb {
                ranking_id: battle_result.ranking_id,
                loser: *l,
                winner: battle_result.winner,
                explicit: false,
            });
            count_loser = count_loser + 1
        }
    }

    conn.transaction::<_, diesel::result::Error, _>(|transaction_conn| {
        diesel::update(ranking_items)
            .filter(item_id.eq(battle_result.winner))
            .set(score.eq(score + 1 + count_loser))
            .execute(transaction_conn)?;

        for w in &winners {
            if !has_duel_occurred(transaction_conn, battle_result.loser, *w, battle_result.ranking_id) {
                diesel::update(ranking_items)
                    .filter(item_id.eq(w))
                    .set(score.eq(score + 1))
                    .execute(transaction_conn)?;
            }
        }
        for l in &losers {
            if !has_duel_occurred(transaction_conn, *l, battle_result.winner, battle_result.ranking_id) {
                diesel::update(ranking_items)
                    .filter(item_id.eq(l))
                    .set(score.eq(score - 1))
                    .execute(transaction_conn)?;
            }
        }

        diesel::insert_into(duels)
            .values(&duel_results)
            .execute(transaction_conn)?;

        diesel::update(ranking_items)
            .filter(item_id.eq(battle_result.loser))
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

pub fn generate_tournament(conn: &mut PgConnection, ranking_id_param: i32) -> Vec<(ItemDuel, ItemDuel)> {
    let mut rng = thread_rng();
    let items_result: QueryResult<Vec<RankingItemWithNameAndImage>> = fetch_ranking_items_with_names(conn, ranking_id_param);

    match items_result {
        Ok(items) => {
            let filtered_items: Vec<ItemDuel> = items.into_iter()
                .map(ItemDuel::from)
                .collect();

            let mut shuffled_items = filtered_items.clone();
            shuffled_items.shuffle(&mut rng);

            create_pairs(shuffled_items)
        }
        Err(e) => {
            eprintln!("Failed to fetch items: {:?}", e);
            Vec::new()
        }
    }
}

pub fn init_tournament(conn: &mut PgConnection, ranking_id_param: i32) -> Result<Vec<(ItemDuel, ItemDuel)>, Box<dyn std::error::Error>> {
    let tournament = generate_tournament(conn, ranking_id_param);
    println!("{:?}", tournament);
    let _number_duels_max = number_duels_max_tournament(conn, ranking_id_param);
    Ok(tournament)
    //diesel::update(ranking_items)
    //    .filter(ranking_id.eq(ranking_id_param))
    //    .set(pool.eq())
}

pub fn next_round(conn: &mut PgConnection, ranking_id_param: i32, data: Vec<i32>) -> Result<Vec<(ItemDuel, ItemDuel)>, Box<dyn std::error::Error>> {
    use crate::schema::ranking_items::dsl::rank;
    let position = 2 * data.len() as i32;
    //  let _number_duels_max = number_duels_max_tournament(conn, ranking_id_param)?;

    for id_param in data {
        diesel::update(ranking_items)
            .filter(item_id.eq(id_param))
            .set(rank.eq(position))
            .execute(conn)?;
    }
    let filtered_items: QueryResult<Vec<RankingItemWithNameAndImage>> = fetch_ranking_items_with_names(conn, ranking_id_param);


    match filtered_items {
        Ok(items) => {
            if items.len() == 1 {
                println!("over");
                Ok(Vec::new())
            } else {
                println!("next pair");
                let pairs = create_pairs(
                    items
                        .into_iter()
                        //  .filter(|item| item.rank == 0)
                        .map(ItemDuel::from)
                        .collect()
                );
                println!("{:?}", pairs);
                Ok(pairs)
            }
        }
        Err(e) => {
            eprintln!("Failedd to fetch items: {:?}", e);
            Ok(Vec::new())
        }
    }
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