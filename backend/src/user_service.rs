use diesel::prelude::*;
use diesel::QueryResult;
use diesel::Insertable;
use diesel::Queryable;
use crate::schema::users; // Importe le schéma des utilisateurs
use serde::Serialize;

// Structure représentant les utilisateurs dans la base de données
#[derive(Queryable, Serialize)]
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
