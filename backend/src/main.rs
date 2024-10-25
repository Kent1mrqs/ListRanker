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
mod middleware;
mod tournament_service;

use crate::middleware::JwtMiddleware;
use actix_cors::Cors;
use actix_web::middleware::Logger;
use actix_web::{web, App, HttpServer, Responder};
use dotenv::dotenv;
use std::env;

async fn index() -> impl Responder {
    "Hello world!"
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init();
    dotenv().ok();
    let secret_key = env::var("SECRET_KEY").expect("SECRET_KEY must be set");

    env::set_var("RUST_LOG", "actix_web=info");
    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(cors)
            .wrap(Logger::default())
            .service(
                web::resource("/register")
                    .route(web::post().to(handlers::users_handlers::register_user)))
            .service(
                web::resource("/login")
                    .route(web::post().to(handlers::users_handlers::login_user)))
            .service(
                web::resource("/users")
                    .wrap(JwtMiddleware::new(secret_key.clone()))
                    .route(web::get().to(handlers::users_handlers::fetch_all_users))
            )
            .service(
                web::resource("/lists")
                    .wrap(JwtMiddleware::new(secret_key.clone()))
                    .route(web::post().to(handlers::lists_handlers::create_list))
            )
            .service(
                web::resource("/lists/{user_id}")
                    .wrap(JwtMiddleware::new(secret_key.clone()))
                    .route(web::get().to(handlers::lists_handlers::fetch_user_lists))
            )
            .service(
                web::resource("/list/{list_id}")
                    .wrap(JwtMiddleware::new(secret_key.clone()))
                    .route(web::delete().to(handlers::lists_handlers::remove_list)),
            )
            .service(
                web::resource("/list-edit/{list_id}")
                    .wrap(JwtMiddleware::new(secret_key.clone()))
                    .route(web::put().to(handlers::lists_handlers::edit_list_handler)),
            )
            .service(
                web::resource("/items/{list_id}")
                    .wrap(JwtMiddleware::new(secret_key.clone()))
                    .route(web::get().to(handlers::items_handlers::fetch_items_by_list)),
            )
            .service(
                web::resource("/item-edit/{item_id}")
                    .wrap(JwtMiddleware::new(secret_key.clone()))
                    .route(web::put().to(handlers::items_handlers::edit_item_by_id)),
            )
            .service(
                web::resource("/item-delete/{item_id}")
                    .wrap(JwtMiddleware::new(secret_key.clone()))
                    .route(web::delete().to(handlers::items_handlers::delete_item_by_id)),
            )
            .service(
                web::resource("/item-create/{list_id}")
                    .wrap(JwtMiddleware::new(secret_key.clone()))
                    .route(web::post().to(handlers::items_handlers::add_item)),
            )
            .service(
                web::resource("/rankings/{userId}")
                    .wrap(JwtMiddleware::new(secret_key.clone()))
                    .route(web::get().to(handlers::rankings_handlers::fetch_user_rankings))
            )
            .service(
                web::resource("/ranking-items")
                    .wrap(JwtMiddleware::new(secret_key.clone()))
                    .route(web::post().to(handlers::ranking_items_handlers::update_ranking_items))
            )
            .service(
                web::resource("/ranking-items/{rankingId}")
                    .wrap(JwtMiddleware::new(secret_key.clone()))
                    .route(web::get().to(handlers::ranking_items_handlers::fetch_ranking_items))
            )
            .service(
                web::resource("/rankings")
                    .wrap(JwtMiddleware::new(secret_key.clone()))
                    .route(web::post().to(handlers::rankings_handlers::create_ranking)),
            )
            .service(
                web::resource("/duels-next/{ranking_id}")
                    .wrap(JwtMiddleware::new(secret_key.clone()))
                    .route(web::post().to(handlers::duel_handlers::handle_next_duel)),
            )
            .service(
                web::resource("/duels-init/{ranking_id}")
                    .wrap(JwtMiddleware::new(secret_key.clone()))
                    .route(web::get().to(handlers::duel_handlers::handle_init_duel)),
            )
            .service(
                web::resource("/duels-reset/{ranking_id}")
                    .wrap(JwtMiddleware::new(secret_key.clone()))
                    .route(web::post().to(handlers::duel_handlers::handle_reset_duel)),
            )
            .service(
                web::resource("/tournament-reset/{ranking_id}")
                    .wrap(JwtMiddleware::new(secret_key.clone()))
                    .route(web::post().to(handlers::tournament_handlers::handle_reset_tournament)),
            )
            .service(
                web::resource("/tournament-init/{ranking_id}")
                    .wrap(JwtMiddleware::new(secret_key.clone()))
                    .route(web::get().to(handlers::tournament_handlers::handle_generate_round)),
            )
            .service(
                web::resource("/tournament-next/{ranking_id}")
                    .wrap(JwtMiddleware::new(secret_key.clone()))
                    .route(web::post().to(handlers::tournament_handlers::handle_process_round)),
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


