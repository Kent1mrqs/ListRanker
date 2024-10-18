use crate::db::establish_connection;
use crate::duel_service;
use crate::models::duel_models::BattleResult;
use actix_web::{web, HttpResponse};

/// Handles the request to process the next duel by updating the duel state with the winner's information.
/// Returns a JSON response with the updated duel result.
pub async fn handle_next_duel(path: web::Path<i32>, json_battle_result: web::Json<BattleResult>) -> HttpResponse {
    let mut conn = establish_connection();
    let ranking_id = path.into_inner(); // Extract the ranking ID from the path
    let winner = json_battle_result.into_inner(); // Get the battle information from the request body

    match duel_service::process_next_duel(&mut conn, ranking_id, winner) {
        Ok(result) => HttpResponse::Ok().json(result), // Return the updated duel result as JSON if successful
        Err(e) => {
            eprintln!("Error during processing next duel: {:?}", e); // Log the error
            HttpResponse::InternalServerError().body("Error processing duel") // Handle error with a descriptive message
        }
    }
}

/// Handles the request to initialize a duel for the specified ranking ID.
/// Returns a JSON response with the duel initialization result.
pub async fn handle_init_duel(path: web::Path<i32>) -> HttpResponse {
    let mut conn = establish_connection();
    let ranking_id = path.into_inner(); // Extract the ranking ID from the path

    match duel_service::initialize_duel(&mut conn, ranking_id) {
        Ok(result) => HttpResponse::Ok().json(result), // Return the initialization result as JSON if successful
        Err(e) => {
            eprintln!("Error during initializing duel: {:?}", e);
            HttpResponse::InternalServerError().body("Error initializing duel")
        }
    }
}