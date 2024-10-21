use crate::db::establish_connection;
use crate::item_service;
use actix_web::{web, HttpResponse};

/// Retrieves items associated with the specified list ID and returns them as a JSON response.
pub async fn fetch_items_by_list(path: web::Path<i32>) -> HttpResponse {
    let list_id = path.into_inner();
    let mut conn = establish_connection();

    match item_service::fetch_items_by_list_id(&mut conn, list_id) {
        Ok(items) => HttpResponse::Ok().json(items),
        Err(e) => {
            eprintln!("Error retrieving items for list ID {}: {:?}", list_id, e);
            HttpResponse::InternalServerError().body("Error retrieving items")
        }
    }
}
