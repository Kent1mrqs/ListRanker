use crate::db;
use crate::db::establish_connection;
use crate::list_service;
use crate::models::lists_models::{NewListApi, NewListDb};
use actix_web::{web, HttpResponse};

/// Retrieves all lists associated with the specified user ID and returns them as a JSON response.
pub async fn fetch_user_lists(path: web::Path<i32>) -> HttpResponse {
    let mut conn = db::establish_connection();
    let user_id = path.into_inner();

    match list_service::fetch_user_lists(&mut conn, user_id) {
        Ok(lists) => HttpResponse::Ok().json(lists),
        Err(e) => {
            eprintln!("Error fetching lists for user ID {}: {:?}", user_id, e);
            HttpResponse::InternalServerError().body("Error fetching lists")
        }
    }
}

/// Creates a new list based on the provided data and returns the created list as a JSON response.
pub async fn create_list(new_list: web::Json<NewListApi>) -> HttpResponse {
    let mut conn = establish_connection();

    // Constructing the NewListDb object from the incoming request
    let list_data = NewListDb {
        user_id: new_list.user_id,
        name: new_list.name.clone(),
    };

    match list_service::register_new_list(&mut conn, list_data, new_list.items.clone()) {
        Ok(created_list) => HttpResponse::Ok().json(created_list),
        Err(e) => {
            println!("Error creating list: {:?}", e);
            HttpResponse::InternalServerError().body("Error creating list")
        }
    }
}

/// Deletes the specified list and returns a success message as a JSON response.
pub async fn remove_list(path: web::Path<i32>) -> HttpResponse {
    let list_id = path.into_inner();

    let mut conn = establish_connection();

    match list_service::delete_list(&mut conn, list_id) {
        Ok(_) => HttpResponse::Ok().body("List removed successfully"),
        Err(e) => {
            println!("Error deleting the list: {:?}", e);
            HttpResponse::InternalServerError().body("Error removing list")
        }
    }
}