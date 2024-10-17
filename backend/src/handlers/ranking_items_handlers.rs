use crate::db::establish_connection;
use crate::models::ranking_items_models::NewRankings;
use crate::ranking_item_service;
use actix_web::{web, HttpResponse};

pub async fn get_ranking_items_by_ranking(path: web::Path<i32>) -> HttpResponse {
    let ranking_id_param = path.into_inner();
    let mut conn = establish_connection();

    match ranking_item_service::get_ranking_items_by_ranking_id(&mut conn, ranking_id_param) {
        Ok(items) => HttpResponse::Ok().json(items),
        Err(_) => HttpResponse::InternalServerError().body("Error retrieving items"),
    }
}
pub async fn update_ranking_items_by_ranking(new_items: web::Json<Vec<NewRankings>>) -> HttpResponse {
    let mut conn = establish_connection();

    match ranking_item_service::exchange_rank_with_id(&mut conn, new_items.into_inner()) {
        Ok(items) => HttpResponse::Ok().json(items),
        Err(_) => HttpResponse::InternalServerError().body("Error retrieving items"),
    }
}
