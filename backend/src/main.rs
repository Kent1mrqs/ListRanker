use actix_cors::Cors;
use actix_web::{web, App, HttpServer, Responder};

async fn hello() -> impl Responder {
    "Hello, world!"
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    HttpServer::new(|| {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);

        App::new()
            .wrap(cors)
            .route("/", web::get().to(hello))
    })
    .bind("127.0.0.1:8081")?
    .run()
    .await
}
