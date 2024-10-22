use diesel::pg::PgConnection;
use diesel::prelude::*;
use dotenv::dotenv;
use std::env;

pub fn establish_connection() -> PgConnection {
    dotenv().ok();


    let db_password = env::var("POSTGRES_PASSWORD").unwrap_or_else(|_| "secret".to_string());
    let db_user = env::var("POSTGRES_USER").unwrap_or_else(|_| "user".to_string());
    let db_host = "localhost";
    let db_port = "5432";
    let database_db = env::var("POSTGRES_DB").unwrap_or_else(|_| "db".to_string());

    let database_url = format!("postgres://{}:{}@{}:{}/{}", db_user, db_password, db_host, db_port, database_db);

    PgConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url))
}
