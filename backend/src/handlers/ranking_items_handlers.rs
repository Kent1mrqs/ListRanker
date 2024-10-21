use crate::db::establish_connection;
use crate::models::ranking_items_models::NewRankings;
use crate::ranking_item_service;
use actix_web::{web, HttpResponse};

/// Retrieves ranking items associated with the specified ranking ID and returns them as a JSON response.
pub async fn fetch_ranking_items(path: web::Path<i32>) -> HttpResponse {
    let ranking_id = path.into_inner();
    let mut conn = establish_connection();

    match ranking_item_service::fetch_ranking_items_with_names(&mut conn, ranking_id) {
        Ok(items) => HttpResponse::Ok().json(items),
        Err(e) => {
            eprintln!("Error retrieving ranking items for ranking ID {}: {:?}", ranking_id, e);
            HttpResponse::InternalServerError().body("Error retrieving ranking items")
        }
    }
}

/// Updates the ranking items with the new ranking data provided in the request body.
/// Returns a JSON response with the updated items.
pub async fn update_ranking_items(new_items: web::Json<Vec<NewRankings>>) -> HttpResponse {
    let mut conn = establish_connection();

    match ranking_item_service::update_ranks(&mut conn, new_items.into_inner()) {
        Ok(items) => HttpResponse::Ok().json(items),
        Err(e) => {
            eprintln!("Error updating ranking items: {:?}", e);
            HttpResponse::InternalServerError().body("Error updating ranking items")
        }
    }
}
