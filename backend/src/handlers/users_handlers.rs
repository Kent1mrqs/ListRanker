use crate::db::establish_connection;
use crate::models::users_models::{LoginResponse, NewUser, User};
use crate::{db, user_service};
use actix_web::{web, HttpResponse, Responder};
use diesel::prelude::*;
use diesel::RunQueryDsl;

pub async fn get_users() -> HttpResponse {
    let mut conn = db::establish_connection();
    match user_service::get_all_users(&mut conn) {
        Ok(users) => HttpResponse::Ok().json(users),
        Err(_) => HttpResponse::InternalServerError().body("Error fetching users"),
    }
}

pub async fn register(new_user: web::Json<NewUser>) -> HttpResponse {
    let mut conn = establish_connection();
    let user_data = NewUser {
        username: new_user.username.clone(),
        password_hash: new_user.password_hash.clone(),
    };
    match user_service::create_new_user(&mut conn, user_data) {
        Ok(user) => {
            HttpResponse::Ok().json(user)
        }
        Err(e) => {
            println!("Erreur lors de la création de l'utilisateur : {:?}", e);
            HttpResponse::InternalServerError().body("Erreur lors de la création de l'utilisateur")
        }
    }
}

pub async fn login(user: web::Json<NewUser>) -> impl Responder {
    use crate::schema::users::dsl::*;
    let mut conn = establish_connection();

    let user_in_db = users
        .filter(username.eq(&user.username))
        .first::<User>(&mut conn);

    match user_in_db {
        Ok(user_in_db) => {
            if user.password_hash == user_in_db.password_hash {
                println!("OK");
                let response = LoginResponse {
                    id: user_in_db.id,
                    username: user_in_db.username,
                };
                HttpResponse::Ok().json(response)
            } else {
                println!("Invalid credentials");
                HttpResponse::Unauthorized().body("Invalid credentials")
            }
        }
        Err(_) => HttpResponse::Unauthorized().body("User not found"),
    }
}
