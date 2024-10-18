use crate::db::establish_connection;
use crate::duel_service;
use actix_web::{web, HttpResponse};
use serde_derive::Deserialize;

#[derive(Deserialize)]
pub struct Winner {
    pub id: i32,
}

pub async fn next_duel_handler(path: web::Path<i32>, json_winner: web::Json<Winner>) -> HttpResponse {
    let mut conn = establish_connection();
    let ranking_id = path.into_inner();
    let winner = json_winner.into_inner();

    match duel_service::next_duel(&mut conn, ranking_id, winner) {
        Ok(items) => HttpResponse::Ok().json(items),
        Err(e) => {
            eprintln!("Error during next duel: {:?}", e);
            HttpResponse::InternalServerError().body("Error duel")
        }
    }
}
pub async fn init_duel_handler(path: web::Path<i32>) -> HttpResponse {
    let mut conn = establish_connection();
    let ranking_id = path.into_inner();

    match duel_service::init_duel(&mut conn, ranking_id) {
        Ok(items) => HttpResponse::Ok().json(items),
        Err(e) => {
            eprintln!("Error during init duel: {:?}", e);
            HttpResponse::InternalServerError().body("Error duel")
        }
    }
}