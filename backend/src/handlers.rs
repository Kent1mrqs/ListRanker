use actix_web::HttpResponse;
use crate::db;
use crate::user_service;
use crate::list_service;

pub async fn get_users() -> HttpResponse {
    let mut conn = db::establish_connection();
    match user_service::get_all_users(&mut conn) {
        Ok(users) => HttpResponse::Ok().json(users),
        Err(_) => HttpResponse::InternalServerError().body("Error fetching users"),
    }
}

pub async fn get_lists() -> HttpResponse {
    let mut conn = db::establish_connection();
    match list_service::get_all_lists(&mut conn) {
        Ok(lists) => HttpResponse::Ok().json(lists),
        Err(_) => HttpResponse::InternalServerError().body("Error fetching lists"),
    }
}
