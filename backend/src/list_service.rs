use actix_web::{HttpResponse, Responder};
use diesel::prelude::*;
use diesel::QueryResult;
use serde::Serialize; // Importez `Serialize` pour sérialiser les utilisateurs en JSON
use crate::schema::lists;

// Structure List (représentant une ligne dans la table lists)
#[derive(Queryable, Serialize)]
pub struct List {
    pub list_id: i32,          // Correspond à list_id INT dans la table
    pub user_id: Option<i32>,  // Correspond à user_id INT NULLABLE dans la table
    pub name: String,          // Correspond à name VARCHAR(255) NOT NULL
}

// Structure NewList (pour insérer une nouvelle liste)
#[derive(Insertable)]
#[diesel(table_name = lists)] // Référence correcte à la table
pub struct NewList<'a> {
    pub list_id: i32,
    pub user_id: Option<i32>,   // L'ID de l'utilisateur auquel appartient la liste (nullable)
    pub name: &'a str,          // Le nom de la liste (chaîne de caractères)
}

// Fonction pour insérer une nouvelle liste
pub fn create_new_list(conn: &mut PgConnection, new_list: NewList) -> QueryResult<usize> {
    diesel::insert_into(lists::table)
        .values(new_list)
        .execute(conn)
}

// Fonction pour récupérer toutes les listes
pub fn get_all_lists(conn: &mut PgConnection) -> QueryResult<Vec<List>> {
    use crate::schema::lists::dsl::*;

    lists.load::<List>(conn) // Charge directement les données
}

pub async fn get_lists() -> impl Responder {

    // Connexion à la base de données (dans une vraie application, utilisez un pool de connexions)
    let database_url = "postgres://user:secret@192.168.1.53/db"; // Changez ici avec vos données
    let mut conn = PgConnection::establish(&database_url)
        .expect("Erreur lors de la connexion à la base de données");

    match get_all_lists(&mut conn) {
        Ok(lists) => {
            // Retourner les utilisateurs en JSON
            HttpResponse::Ok().json(lists)
        }
        Err(err) => {
            println!("Erreur lors de la récupération des lists : {}", err);
            HttpResponse::InternalServerError().finish()
        }
    }
}