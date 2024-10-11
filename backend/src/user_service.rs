use actix_web::{HttpResponse, Responder};
use diesel::prelude::*;
use diesel::{QueryResult, Insertable, Queryable};
use serde::Serialize; // Importez `Serialize` pour sérialiser les utilisateurs en JSON
use crate::schema::users; // Importe le schéma des utilisateurs

// Structure représentant les utilisateurs dans la base de données
#[derive(Queryable, Serialize)] // Ajoutez `Serialize` ici pour permettre la sérialisation en JSON
pub struct User {
    pub id: i32,
    pub username: String,
    pub email: String,
    pub password_hash: String,
}

// Structure pour insérer un nouvel utilisateur
#[derive(Insertable)]
#[diesel(table_name = users)] // Référence correcte à la table
pub struct NewUser<'a> {
    pub username: &'a str,
    pub email: &'a str,
    pub password_hash: &'a str,
}

// Fonction pour créer un nouvel utilisateur
pub fn create_new_user(conn: &mut PgConnection, new_user: NewUser) -> QueryResult<usize> {
    use crate::schema::users;

    diesel::insert_into(users::table)
        .values(new_user)
        .execute(conn)
}

// Fonction pour récupérer tous les utilisateurs
pub fn get_all_users(conn: &mut PgConnection) -> QueryResult<Vec<User>> {
    use crate::schema::users::dsl::*; // Utiliser le module DSL pour faciliter l'écriture des requêtes

    users.load::<User>(conn)
}

pub async fn get_users() -> impl Responder {

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