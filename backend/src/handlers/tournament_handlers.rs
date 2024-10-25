use crate::db::establish_connection;
use crate::tournament_service;
use actix_web::{web, HttpResponse};

pub async fn handle_reset_tournament(path: web::Path<i32>) -> HttpResponse {
    let mut conn = establish_connection();
    let ranking_id = path.into_inner();

    match tournament_service::reset_tournament(&mut conn, ranking_id) {
        Ok(result) => HttpResponse::Ok().json(result),
        Err(e) => {
            eprintln!("Error during reseting duel: {:?}", e);
            HttpResponse::InternalServerError().body("Error reseting duel")
        }
    }
}


pub async fn handle_generate_round(path: web::Path<i32>) -> HttpResponse {
    let mut conn = establish_connection();
    let ranking_id = path.into_inner();

    println!("Starting tournament initialization for ranking ID: {}", ranking_id);

    match tournament_service::generate_round(&mut conn, ranking_id) {
        Ok(result) => {
            println!("Tournament initialization successful for ranking ID: {}", ranking_id);
            HttpResponse::Ok().json(result)
        }
        Err(e) => {
            eprintln!("Error while initializing tournament for ranking ID {}: {:?}", ranking_id, e);
            HttpResponse::InternalServerError().body("Error initializing tournament")
        }
    }
}
pub async fn handle_process_round(path: web::Path<i32>, data: web::Json<Vec<i32>>) -> HttpResponse {
    let mut conn = establish_connection();
    let ranking_id = path.into_inner();

    println!("Next round for ranking ID: {}", ranking_id);

    match tournament_service::process_round(&mut conn, ranking_id, data.into_inner()) {
        Ok(result) => {
            println!("Next round successful for ranking ID: {}", ranking_id);
            HttpResponse::Ok().json(result)
        }
        Err(e) => {
            eprintln!("Error while next round for ranking ID {}: {:?}", ranking_id, e);
            HttpResponse::InternalServerError().body("Error initializing tournament")
        }
    }
}