use diesel::prelude::*;
use diesel::QueryResult;
use crate::schema::lists;

// Structure List (représentant une ligne dans la table lists)
#[derive(Queryable)]
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
