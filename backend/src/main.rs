#![allow(non_local_definitions)]

#[macro_use]
extern crate diesel;

use diesel::prelude::*;
use diesel::pg::PgConnection;
use diesel::Connection;
use dotenv::dotenv;
use std::env;

pub mod schema {
    table! {
        users (user_id) {
            user_id -> Int4,
            username -> Varchar,
            email -> Varchar,
            password_hash -> Varchar,
        }
    }
}

use self::schema::users::dsl::*;

#[derive(Queryable)]
struct User {
    user_id: i32,
    username: String,
    email: String,
    password_hash: String,
}

fn main() {
    dotenv().ok();

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let mut connection = PgConnection::establish(&database_url)
        .expect(&format!("Error connecting to {}", database_url));

    let results = users
        .limit(5)
        .load::<User>(&mut connection)
        .expect("Error loading users");

    for user in results {
        println!(
            "{}: {} ({}) - Password Hash: {}",
            user.user_id, user.username, user.email, user.password_hash
        );
    }
}
