extern crate diesel;

pub mod schema {
    include!("schema.rs");
}

mod user_service;
mod list_service;
mod item_service;
mod models;

use diesel::prelude::*;
use user_service::{ get_users};
use list_service::{ get_lists};

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
                web::resource("/users").route(web::get().to(get_users)),
            )
            .service(
                web::resource("/lists").route(web::get().to(get_lists)),
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


