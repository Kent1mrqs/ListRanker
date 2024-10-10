#[macro_use]
extern crate diesel;
extern crate dotenv;

use actix_web::{web, App, HttpServer, Responder};
use diesel::pg::PgConnection;
use dotenv::dotenv;
use serde::{Deserialize, Serialize};
use std::env;
use std::net::{TcpListener, TcpStream};
use std::io::{Read, Write};

// Model: User struct with id, name, email
#[derive(Serialize, Deserialize, Queryable, Insertable)]
#[table_name = "users"]
struct User {
    id: Option<i32>,
    name: String,
    email: String,
}

// DATABASE URL
const DB_URL: &str = "postgres://citizix_user:S3cret@localhost:5432/citizix_db";

// Constants
const OK_RESPONSE: &str = "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n\r\n";
const NOT_FOUND: &str = "HTTP/1.1 404 NOT FOUND\r\n\r\n";
const INTERNAL_ERROR: &str = "HTTP/1.1 500 INTERNAL ERROR\r\n\r\n";

// Main function
fn main() {
    // Start server and print port
    let listener = TcpListener::bind(format!("0.0.0.0:8080")).unwrap();
    println!("Server listening on port 8080");

    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                handle_client(stream);
            }
            Err(e) => {
                println!("Unable to connect: {}", e);
            }
        }
    }
}

// Handle requests
fn handle_client(mut stream: TcpStream) {
    let mut buffer = [0; 1024];
    let mut request = String::new();

    match stream.read(&mut buffer) {
        Ok(size) => {
            request.push_str(String::from_utf8_lossy(&buffer[..size]).as_ref());

            let (status_line, content) = match &*request {
               // r if r.starts_with("POST /users") => handle_post_request(r),
                //r if r.starts_with("GET /users/") => handle_get_request(r),
               // r if r.starts_with("GET /users") => handle_get_all_request(r),
               // r if r.starts_with("PUT /users/") => handle_put_request(r),
               // r if r.starts_with("DELETE /users/") => handle_delete_request(r),
                _ => (NOT_FOUND.to_string(), "404 not found".to_string()),
            };

            stream.write_all(format!("{}{}", status_line, content).as_bytes()).unwrap();
        }
        Err(e) => eprintln!("Unable to read stream: {}", e),
    }
}
