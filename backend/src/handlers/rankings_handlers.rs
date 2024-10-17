use crate::db::establish_connection;
use crate::models::rankings_models::NewRanking;
use crate::ranking_service;
use actix_web::{web, HttpResponse};

pub async fn get_rankings(path: web::Path<i32>) -> HttpResponse {
    let mut conn = establish_connection();
    let user_id = path.into_inner();
    match ranking_service::get_all_rankings(&mut conn, user_id) {
        Ok(rankings) => HttpResponse::Ok().json(rankings),
        Err(_) => HttpResponse::InternalServerError().body("Error retrieving rankings"),
    }
}

pub async fn create_ranking(new_ranking: web::Json<NewRanking>) -> HttpResponse {
    println!("Requête reçue pour créer un classement : {:?}", new_ranking);

    let mut conn = establish_connection();

    let list_data = NewRanking {
        name: new_ranking.name.clone(),
        user_id: new_ranking.user_id,
        list_id: new_ranking.list_id,
        ranking_type: new_ranking.ranking_type.clone(),
        creation_method: new_ranking.creation_method.clone(),
    };

    match ranking_service::create_new_ranking(&mut conn, list_data) {
        Ok(list) => {
            println!("Liste créée avec succès : {:?}", list);
            HttpResponse::Ok().json(list)
        }
        Err(e) => {
            println!("Erreur lors de la création de la liste : {:?}", e);
            HttpResponse::InternalServerError().body("Error creating list")
        }
    }
}
