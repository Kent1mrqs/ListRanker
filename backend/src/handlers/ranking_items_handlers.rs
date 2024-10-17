use crate::db::establish_connection;
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
