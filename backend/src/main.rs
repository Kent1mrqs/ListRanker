extern crate diesel;

pub mod schema {
    include!("schema.rs"); // Incluez ici votre schéma
}

// Import du module user_service
mod user_service;

use diesel::prelude::*;
use user_service::{create_new_user, get_all_users, NewUser}; // Importer les fonctions et structures nécessaires

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
}
