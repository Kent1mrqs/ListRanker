use crate::db::establish_connection;
use crate::item_service;
use crate::models::items_models::NewItemApi;
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

pub async fn edit_item_by_id(path: web::Path<i32>, new_item: web::Json<NewItemApi>) -> HttpResponse {
    let item_id = path.into_inner();
    let mut conn = establish_connection();

    match item_service::edit_item(&mut conn, item_id, new_item.into_inner()) {
        Ok(items) => HttpResponse::Ok().json(items),
        Err(e) => {
            eprintln!("Error editing item for item ID {}: {:?}", item_id, e);
            HttpResponse::InternalServerError().body("Error editing item")
        }
    }
}

pub async fn delete_item_by_id(path: web::Path<i32>) -> HttpResponse {
    let item_id = path.into_inner();
    let mut conn = establish_connection();

    match item_service::delete_item(&mut conn, item_id) {
        Ok(items) => HttpResponse::Ok().json(items),
        Err(e) => {
            eprintln!("Error deleting item for item ID {}: {:?}", item_id, e);
            HttpResponse::InternalServerError().body("Error deleting items")
        }
    }
}

pub async fn add_item(path: web::Path<i32>, _new_item: web::Json<NewItemApi>) -> HttpResponse {
    let list_id_param = path.into_inner();
    let mut conn = establish_connection();

    match item_service::add_item_to_list(&mut conn, list_id_param) {
        Ok(item) => HttpResponse::Ok().json(item),
        Err(e) => {
            eprintln!("Error adding item for list ID {}: {:?}", list_id_param, e);
            HttpResponse::InternalServerError().body("Error deleting items")
        }
    }
}
