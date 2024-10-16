use crate::db;
use crate::db::establish_connection;
use crate::list_service;
use crate::models::lists_models::{NewListApi, NewListDb};
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

    match list_service::create_new_list(&mut conn, list_data, new_list.items.clone()) {
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
/*
pub async fn put_list(list_id: i32, new_list: web::Json<NewListApi>) -> HttpResponse {
    println!("Requête reçue pour modifier une liste : {:?}", new_list);

    let mut conn = establish_connection();

    let list_data = NewListDb {
        user_id: new_list.user_id,
        name: new_list.name.clone(),
    };

    match list_service::edit_list(&mut conn, list_data, new_list.items.clone()) {
        Ok(list) => {
            println!("Liste modifiée avec succès : {:?}", list);
            HttpResponse::Ok().json(list)
        }
        Err(e) => {
            println!("Erreur lors de la modification de la liste : {:?}", e);
            HttpResponse::InternalServerError().body("Error editing list")
        }
    }
}
*/
pub async fn delete_list(path: web::Path<i32>) -> HttpResponse {
    let list_id = path.into_inner();

    println!("Requête reçue pour supprimer la liste : {:?}", list_id);

    let mut conn = establish_connection();

    match list_service::remove_list(&mut conn, list_id) {
        Ok(list) => {
            println!("Liste supprimée avec succès : {:?}", list_id);
            HttpResponse::Ok().json(list)
        }
        Err(e) => {
            println!("Erreur lors de la supression de la liste : {:?}", e);
            HttpResponse::InternalServerError().body("Error removing list")
        }
    }
}