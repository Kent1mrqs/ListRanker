extern crate diesel;

pub mod schema {
    include!("models/schema.rs");
}

mod user_service;
mod list_service;
mod item_service;
mod ranking_service;
mod ranking_item_service;
mod models;
mod handlers;
mod db;
mod duel_service;

use actix_cors::Cors;
use actix_web::{web, App, HttpServer, Responder};

async fn index() -> impl Responder {
    "Hello world!"
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(cors)
            .service(
                web::resource("/register")
                    .route(web::post().to(handlers::users_handlers::register)))
            .service(
                web::resource("/login")
                    .route(web::post().to(handlers::users_handlers::login)))
            .service(
                web::resource("/users")
                    .route(web::get().to(handlers::users_handlers::get_users))
            )
            .service(
                web::resource("/lists")
                    .route(web::post().to(handlers::lists_handlers::create_list))
            )
            .service(
                web::resource("/lists/{user_id}")
                    .route(web::get().to(handlers::lists_handlers::get_lists))
            )
            .service(
                web::resource("/list/{list_id}")
                    .route(web::delete().to(handlers::lists_handlers::delete_list)),
            )
            .service(
                web::resource("/items/{list_id}")
                    .route(web::get().to(handlers::items_handlers::get_items_by_list)),
            )
            .service(
                web::resource("/rankings/{userId}")
                    .route(web::get().to(handlers::rankings_handlers::get_rankings))
            )
            .service(
                web::resource("/ranking-items")
                    .route(web::post().to(handlers::ranking_items_handlers::update_ranking_items_by_ranking))
            )
            .service(
                web::resource("/ranking-items/{rankingId}")
                    .route(web::get().to(handlers::ranking_items_handlers::get_ranking_items_by_ranking))
            )
            .service(
                web::resource("/rankings")
                    .route(web::post().to(handlers::rankings_handlers::create_ranking)),
            )
            .service(
                web::resource("/duels-next/{ranking_id}")
                    .route(web::post().to(handlers::duel_handlers::next_duel_handler)),
            )
            .service(
                web::resource("/duels-init/{ranking_id}")
                    .route(web::get().to(handlers::duel_handlers::init_duel_handler)),
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


