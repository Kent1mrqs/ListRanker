extern crate diesel;

pub mod schema {
    include!("schema.rs");
}

// Import du module user_service
mod user_service;
mod list_service;
mod item_service;

use diesel::prelude::*;
use user_service::{create_new_user, get_all_users, NewUser};
use list_service::{create_new_list, get_all_lists, NewList};
use item_service::{create_new_item, get_all_items, NewItem};

use actix_cors::Cors;
use actix_web::{web, App, HttpServer, HttpResponse, Responder};

async fn index() -> impl Responder {
    "Hello world!"
}

async fn get_users() -> impl Responder {
    use user_service::get_all_users; // Importez la fonction ici

    // Connexion à la base de données (dans une vraie application, utilisez un pool de connexions)
    let database_url = "postgres://user:secret@192.168.1.53/db"; // Changez ici avec vos données
    let mut conn = PgConnection::establish(&database_url)
        .expect("Erreur lors de la connexion à la base de données");

    match get_all_users(&mut conn) {
        Ok(users) => {
            // Retourner les utilisateurs en JSON
            HttpResponse::Ok().json(users)
        }
        Err(err) => {
            println!("Erreur lors de la récupération des utilisateurs : {}", err);
            HttpResponse::InternalServerError().finish()
        }
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let database_url = "postgres://user:secret@192.168.1.53/db"; // Changez ici avec vos données
    let mut conn = PgConnection::establish(&database_url)
        .expect("Erreur lors de la connexion à la base de données");

    // Créer un nouvel utilisateur
    let new_user = NewUser {
        username: "example_user",
        email: "user@example.com",
        password_hash: "hashed_password",
    };

    match create_new_user(&mut conn, new_user) {
        Ok(_) => println!("Nouvel utilisateur ajouté avec succès!"),
        Err(err) => println!("Erreur lors de l'ajout de l'utilisateur : {}", err),
    }

    // Récupérer tous les utilisateurs
    match get_all_users(&mut conn) {
        Ok(users) => {
            for user in users {
                println!("ID: {}, Username: {}, Email: {}", user.id, user.username, user.email);
            }
        }
        Err(err) => println!("Erreur lors de la récupération des utilisateurs : {}", err),
    }

    // Créer une nouvelle liste
    let new_list = NewList {
        user_id: None,
        list_id: 1,
        name: "Ma première liste",
    };

    match create_new_list(&mut conn, new_list) {
        Ok(_) => println!("Nouvelle liste ajoutée avec succès!"),
        Err(err) => println!("Erreur lors de l'ajout de la liste : {}", err),
    }

    // Récupérer toutes les listes
    match get_all_lists(&mut conn) {
        Ok(lists) => {
            for list in lists {
                println!("ID: {}, User ID: {:?}, Name: {}", list.list_id, list.user_id, list.name); // Affiche `user_id` comme Option
            }
        }
        Err(err) => println!("Erreur lors de la récupération des listes : {}", err),
    }

    // Créer une nouvelle liste
    let new_item = NewItem {
        list_id: None,
        name: "Mon premier item",
    };

    match create_new_item(&mut conn, new_item) {
        Ok(_) => println!("Nouvelle liste ajoutée avec succès!"),
        Err(err) => println!("Erreur lors de l'ajout de la liste : {}", err),
    }

    match get_all_items(&mut conn) {
        Ok(items) => {
            for item in items {
                println!("ID: {}, List ID: {:?}, Name: {}", item.item_id, item.list_id, item.name);
            }
        }
        Err(err) => println!("Erreur lors de la récupération des items : {}", err),
    }

    HttpServer::new(move || {
        let cors = Cors::default()
            .allow_any_origin()
            .allow_any_method()
            .allow_any_header()
            .max_age(3600);
        App::new()
            .wrap(cors)
            .service(
                // Définir la route pour récupérer les utilisateurs
                web::resource("/users").route(web::get().to(get_users)),
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


