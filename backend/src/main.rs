extern crate diesel;

pub mod schema {
    include!("schema.rs"); // incluez ici votre schéma
}

use diesel::prelude::*;
use diesel::Insertable;
use diesel::PgConnection;
use diesel::QueryResult;
use diesel::Queryable;

// Structure représentant les utilisateurs dans la base de données
#[derive(Queryable)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub email: String,
    pub password_hash: String,
}

// Structure pour insérer un nouvel utilisateur
#[derive(Insertable)]
#[diesel(table_name = schema::users)] // Référence correcte à la table
pub struct NewUser<'a> {
    pub username: &'a str,
    pub email: &'a str,
    pub password_hash: &'a str,
}

// Fonction pour créer un nouvel utilisateur
fn create_new_user(conn: &mut PgConnection, new_user: NewUser) -> QueryResult<usize> {
    use schema::users;

    diesel::insert_into(users::table)
        .values(new_user) // Pas de référence sur new_user ici
        .execute(conn)
}

// Fonction pour récupérer tous les utilisateurs
fn get_all_users(conn: &mut PgConnection) -> QueryResult<Vec<User>> {
    use schema::users::dsl::*; // Utiliser le module DSL pour faciliter l'écriture des requêtes

    users.load::<User>(conn)
}

fn main() {
    let database_url = "postgres://user:secret@192.168.1.53/db"; // changez ici avec vos données
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
