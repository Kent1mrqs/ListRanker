use crate::db;
use crate::db::establish_connection;
use crate::list_service;
use crate::models::{NewListApi, NewListDb};
use actix_web::{web, HttpResponse};

pub async fn get_lists() -> HttpResponse {
    let mut conn = db::establish_connection();
    match list_service::get_all_lists(&mut conn) {
        Ok(lists) => HttpResponse::Ok().json(lists),
        Err(_) => HttpResponse::InternalServerError().body("Error fetching lists"),
    }
}

pub async fn create_list(new_list: web::Json<NewListApi>) -> HttpResponse {
    println!("Requête reçue pour créer une liste : {:?}", new_list);

    let mut conn = establish_connection();

    let list_data = NewListDb {
        user_id: new_list.user_id,
        name: new_list.name.clone(),
    };

    match list_service::create_new_list(&mut conn, list_data, new_list.elements.clone()) {
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
