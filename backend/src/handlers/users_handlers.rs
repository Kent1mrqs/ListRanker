use crate::db::establish_connection;
use crate::models::users_models::NewUserApi;
use crate::user_service;
use actix_web::{web, HttpResponse, Responder};

/// Retrieves all users from the database and returns them as a JSON response.
pub async fn fetch_all_users() -> HttpResponse {
    let mut conn = establish_connection();

    match user_service::fetch_all_users(&mut conn) {
        Ok(users) => HttpResponse::Ok().json(users), // Return users as JSON if successful
        Err(e) => {
            eprintln!("Error fetching users: {:?}", e);
            HttpResponse::InternalServerError().body("Error fetching users")
        }
    }
}


/// Handles user registration by saving a new user in the database.
/// Returns a JSON response with the registered user information or an error message.
pub async fn register_user(new_user: web::Json<NewUserApi>) -> HttpResponse {
    let mut conn = establish_connection();

    let user_data = NewUserApi {
        username: new_user.username.clone(),
        password: new_user.password.clone(),
    };

    match user_service::register_new_user(&mut conn, user_data) {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(e) => {
            eprintln!("Error creating user: {:?}", e);
            HttpResponse::InternalServerError().body("Error creating user")
        }
    }
}

/// Handles user login by verifying credentials and returning a login response.
/// Returns a JSON response with user information or an unauthorized error message.
pub async fn login_user(credentials: web::Json<NewUserApi>) -> impl Responder {
    let mut conn = establish_connection();

    match user_service::login_user(&mut conn, credentials.into_inner()) {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(_) => HttpResponse::Unauthorized().body("User not found"),
    }
}
