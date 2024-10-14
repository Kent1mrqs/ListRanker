use crate::db::establish_connection;
use crate::ranking_service;
use actix_web::HttpResponse;

pub async fn get_rankings() -> HttpResponse {
    let mut conn = establish_connection();

    match ranking_service::get_all_rankings(&mut conn) {
        Ok(rankings) => HttpResponse::Ok().json(rankings),
        Err(_) => HttpResponse::InternalServerError().body("Error retrieving rankings"),
    }
}