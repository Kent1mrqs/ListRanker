use crate::db::establish_connection;
use crate::item_service;
use actix_web::{web, HttpResponse};

pub async fn get_items_by_list(path: web::Path<i32>) -> HttpResponse {
    let list_id_param = path.into_inner();
    let mut conn = establish_connection();

    match item_service::get_items_by_list_id(&mut conn, list_id_param) {
        Ok(items) => HttpResponse::Ok().json(items),
        Err(_) => HttpResponse::InternalServerError().body("Error retrieving items"),
    }
}
