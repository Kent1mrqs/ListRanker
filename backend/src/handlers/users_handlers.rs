use crate::db::establish_connection;
use crate::models::users_models::{LoginResponse, NewUser, User};
use crate::user_service;
use actix_web::{web, HttpResponse, Responder};
use diesel::prelude::*;
use diesel::RunQueryDsl;

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
pub async fn register_user(new_user: web::Json<NewUser>) -> HttpResponse {
    let mut conn = establish_connection();

    // Prepare user data for registration
    let user_data = NewUser {
        username: new_user.username.clone(),
        password_hash: new_user.password_hash.clone(),
    };

    // Attempt to register the new user
    match user_service::register_new_user(&mut conn, user_data) {
        Ok(user) => HttpResponse::Ok().json(user), // Respond with the registered user data if successful
        Err(e) => {
            eprintln!("Error creating user: {:?}", e);
            HttpResponse::InternalServerError().body("Error creating user")
        }
    }
}

/// Handles user login by verifying credentials and returning a login response.
/// Returns a JSON response with user information or an unauthorized error message.
pub async fn login_user(credentials: web::Json<NewUser>) -> impl Responder {
    use crate::schema::users::dsl::*;
    let mut conn = establish_connection();

    // Fetch user from the database by username
    let user_in_db_result = users
        .filter(username.eq(&credentials.username))
        .first::<User>(&mut conn);

    match user_in_db_result {
        Ok(user_in_db) => {
            // Validate password
            if credentials.password_hash == user_in_db.password_hash {
                let response = LoginResponse {
                    id: user_in_db.id,
                    username: user_in_db.username,
                };
                HttpResponse::Ok().json(response) // Respond with user information if credentials are valid
            } else {
                eprintln!("Invalid credentials for username: {}", credentials.username);
                HttpResponse::Unauthorized().body("Invalid credentials")
            }
        }
        Err(_) => HttpResponse::Unauthorized().body("User not found"), // Respond if user is not found
    }
}
