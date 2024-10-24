use crate::db::establish_connection;
use crate::duel_service;
use crate::models::duel_models::BattleResultApi;
use actix_web::{web, HttpResponse};

/// Handles the request to process the next duel by updating the duel state with the winner's information.
/// Returns a JSON response with the updated duel result.
pub async fn handle_next_duel(path: web::Path<i32>, json_battle_result: web::Json<BattleResultApi>) -> HttpResponse {
    let mut conn = establish_connection();
    let ranking_id = path.into_inner();
    let battle_result = json_battle_result.into_inner();

    match duel_service::process_next_duel(&mut conn, ranking_id, battle_result) {
        Ok(result) => HttpResponse::Ok().json(result),
        Err(e) => {
            eprintln!("Error during processing next duel: {:?}", e);
            HttpResponse::InternalServerError().body("Error processing duel")
        }
    }
}
/// Handles the request to initialize a duel for the specified ranking ID.
/// Returns a JSON response with the duel initialization result.
pub async fn handle_init_duel(path: web::Path<i32>) -> HttpResponse {
    let mut conn = establish_connection();
    let ranking_id = path.into_inner();

    println!("Starting duel initialization for ranking ID: {}", ranking_id);

    match duel_service::initialize_duel(&mut conn, ranking_id) {
        Ok(result) => {
            println!("Duel initialization successful for ranking ID: {}", ranking_id);
            HttpResponse::Ok().json(result)
        }
        Err(e) => {
            eprintln!("Error while initializing duel for ranking ID {}: {:?}", ranking_id, e);
            HttpResponse::InternalServerError().body("Error initializing duel")
        }
    }
}

pub async fn handle_reset_duel(path: web::Path<i32>) -> HttpResponse {
    let mut conn = establish_connection();
    let ranking_id = path.into_inner();

    match duel_service::reset_duel(&mut conn, ranking_id) {
        Ok(result) => HttpResponse::Ok().json(result),
        Err(e) => {
            eprintln!("Error during reseting duel: {:?}", e);
            HttpResponse::InternalServerError().body("Error reseting duel")
        }
    }
}