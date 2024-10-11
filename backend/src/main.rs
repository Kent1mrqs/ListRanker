extern crate diesel;

pub mod schema {
    include!("schema.rs");
}

// Import du module user_service
mod user_service;
mod list_service;

use diesel::prelude::*;
use user_service::{create_new_user, get_all_users, NewUser};
use list_service::{create_new_list, get_all_lists, NewList};

fn main() {
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

}
