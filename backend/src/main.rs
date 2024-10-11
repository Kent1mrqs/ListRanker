extern crate diesel;

pub mod schema {
    include!("schema.rs"); // incluez ici votre schéma
}

use diesel::prelude::*;
use diesel::Insertable;
use diesel::PgConnection;
use diesel::QueryResult;

#[derive(Insertable)]
#[diesel(table_name = schema::users)] // Référence correcte à la table
pub struct NewUser<'a> {
    pub username: &'a str,
    pub email: &'a str,
    pub password_hash: &'a str,
}

fn create_new_user(conn: &mut PgConnection, new_user: NewUser) -> QueryResult<usize> {
    use schema::users;

    diesel::insert_into(users::table)
        .values(new_user) // Pas de référence sur new_user ici
        .execute(conn)
}

fn main() {
    let database_url = "postgres://user:secret@192.168.1.53/db"; // changez ici avec vos données
    let mut conn = PgConnection::establish(&database_url)
        .expect("Erreur lors de la connexion à la base de données");

    let new_user = NewUser {
        username: "example_user",
        email: "user@example.com",
        password_hash: "hashed_password",
    };

    match create_new_user(&mut conn, new_user) {
        Ok(_) => println!("Nouvel utilisateur ajouté avec succès!"),
        Err(err) => println!("Erreur lors de l'ajout de l'utilisateur : {}", err),
    }
}
