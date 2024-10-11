use diesel::{Insertable, Queryable};
use serde::Serialize;
use super::schema::users;
use super::schema::lists;
use super::schema::items;

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

#[derive(Queryable, serde::Serialize)]
pub struct Item {
    pub item_id: i32,
    pub list_id: Option<i32>,
    pub name: String,
}

#[derive(Insertable, serde::Deserialize)] // Ajoutez serde::Deserialize ici
#[diesel(table_name = items)]
pub struct NewItem<'a> {
    pub list_id: Option<i32>, // L'ID de la liste à laquelle appartient l'item (nullable)
    pub name: &'a str,        // Le nom de l'item (chaîne de caractères)
}