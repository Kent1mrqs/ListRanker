use crate::db::establish_connection;
use crate::list_service;
use crate::models::lists_models::{EditList, NewListApi, NewListDb};
use crate::models::users_models::Claims;
use actix_web::{web, HttpMessage, HttpRequest, HttpResponse};

/// Retrieves all lists associated with the specified user ID and returns them as a JSON response.
pub async fn fetch_user_lists(req: HttpRequest) -> HttpResponse {
    let mut conn = establish_connection();
    if let Some(claims) = req.extensions().get::<Claims>() {
        let user_id = &claims.sub;

        match list_service::fetch_user_lists(&mut conn, user_id.parse().unwrap_or_default()) {
            Ok(lists) => HttpResponse::Ok().json(lists),
            Err(e) => {
                eprintln!("Error fetching lists for user ID {}: {:?}", user_id, e);
                HttpResponse::InternalServerError().body("Error fetching lists")
            }
        }
    } else {
        HttpResponse::Unauthorized().body("Unauthorized")
    }
}

/// Creates a new list based on the provided data and returns the created list as a JSON response.
pub async fn create_list(req: HttpRequest, new_list: web::Json<NewListApi>) -> HttpResponse {
    let mut conn = establish_connection();


    if let Some(claims) = req.extensions().get::<Claims>() {
        let user_id = &claims.sub;

        let list_data = NewListDb {
            user_id: user_id.parse().unwrap_or_default(),
            name: new_list.name.clone(),
        };

        match list_service::register_new_list(&mut conn, list_data, new_list.items.clone()) {
            Ok(created_list) => HttpResponse::Ok().json(created_list),
            Err(e) => {
                println!("Error creating list: {:?}", e);
                HttpResponse::InternalServerError().body("Error creating list")
            }
        }
    } else {
        HttpResponse::Unauthorized().body("Unauthorized")
    }
}

/// Deletes the specified list and returns a success message as a JSON response.
pub async fn remove_list(path: web::Path<i32>) -> HttpResponse {
    let list_id = path.into_inner();

    let mut conn = establish_connection();

    match list_service::delete_list(&mut conn, list_id) {
        Ok(result) => HttpResponse::Ok().json(result),
        Err(e) => {
            println!("Error deleting the list: {:?}", e);
            HttpResponse::InternalServerError().body("Error removing list")
        }
    }
}

/// Edit the specified list and returns a success message as a JSON response.
pub async fn edit_list_handler(path: web::Path<i32>, edited_list: web::Json<EditList>) -> HttpResponse {
    let list_id = path.into_inner();

    let mut conn = establish_connection();

    match list_service::edit_list(&mut conn, list_id, edited_list.into_inner()) {
        Ok(result) => HttpResponse::Ok().json(result),
        Err(e) => {
            println!("Error editing the list: {:?}", e);
            HttpResponse::InternalServerError().body("Error editing list")
        }
    }
}