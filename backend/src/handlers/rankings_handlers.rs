use crate::db::establish_connection;
use crate::models::rankings_models::NewRanking;
use crate::ranking_service;
use actix_web::{web, HttpResponse};

/// Retrieves rankings for a specified user and returns them as a JSON response.
pub async fn fetch_user_rankings(path: web::Path<i32>) -> HttpResponse {
    let mut conn = establish_connection();
    let user_id = path.into_inner();

    match ranking_service::fetch_user_rankings(&mut conn, user_id) {
        Ok(rankings) => HttpResponse::Ok().json(rankings),
        Err(e) => {
            eprintln!("Error retrieving rankings for user ID {}: {:?}", user_id, e);
            HttpResponse::InternalServerError().body("Error retrieving rankings")
        }
    }
}

/// Creates a new ranking based on the provided data and returns the created ranking as a JSON response.
pub async fn create_ranking(new_ranking: web::Json<NewRanking>) -> HttpResponse {
    let mut conn = establish_connection();

    let ranking_data = NewRanking {
        name: new_ranking.name.clone(),
        user_id: new_ranking.user_id,
        list_id: new_ranking.list_id,
        ranking_type: new_ranking.ranking_type.clone(),
        creation_method: new_ranking.creation_method.clone(),
    };

    match ranking_service::register_new_ranking(&mut conn, ranking_data) {
        Ok(created_ranking) => HttpResponse::Ok().json(created_ranking),
        Err(e) => {
            println!("Error creating ranking: {:?}", e);
            HttpResponse::InternalServerError().body("Error creating ranking")
        }
    }
}
