extern crate diesel;

pub mod schema {
    include!("models/schema.rs");
}

mod user_service;
mod list_service;
mod item_service;
mod models;
mod handlers;
mod db;

use actix_cors::Cors;
use actix_web::{web, App, HttpServer, Responder};

async fn index() -> impl Responder {
    "Hello world!"
}
/*
async fn init_users() {
    let new_user = NewUser {
        username: "example_user".to_string(),
        email: "user@example.com".to_string(),
        password_hash: "hashed_password".to_string(),
    };

     create_user(new_user).await;
}*/

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // init_users().await;

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(cors)
            .service(
                web::resource("/users")
                    .route(web::get().to(handlers::users_handlers::get_users))
                    .route(web::post().to(handlers::users_handlers::create_user))
            )
            .service(
                web::resource("/lists")
                    .route(web::get().to(handlers::lists_handlers::get_lists))
                    .route(web::post().to(handlers::lists_handlers::create_list))
            )
            .service(
                web::resource("/items/{list_id}")
                    .route(web::get().to(handlers::items_handlers::get_items_by_list)),
            )
            .service(
                web::scope("/app")
                    .route("/index.html", web::get().to(index)),
            )
    })
        .bind(("127.0.0.1", 8080))?
        .run()
        .await
}


