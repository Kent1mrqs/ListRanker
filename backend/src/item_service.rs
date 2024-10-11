use diesel::prelude::*;
use diesel::QueryResult;
use crate::schema::items;

// Structure représentant un item (représentant une ligne dans la table items)
#[derive(Queryable)]
pub struct Item {
    pub item_id: i32,
    pub list_id: Option<i32>, // list_id est nullable
    pub name: String,
}

// Structure pour insérer un nouvel item
#[derive(Insertable)]
#[diesel(table_name = items)] // Référence correcte à la table
pub struct NewItem<'a> {
    pub list_id: Option<i32>, // L'ID de la liste à laquelle appartient l'item (nullable)
    pub name: &'a str,        // Le nom de l'item (chaîne de caractères)
}

// Fonction pour insérer un nouvel item
pub fn create_new_item(conn: &mut PgConnection, new_item: NewItem) -> QueryResult<usize> {
    diesel::insert_into(items::table)
        .values(new_item)
        .execute(conn)
}

// Fonction pour récupérer tous les items
pub fn get_all_items(conn: &mut PgConnection) -> QueryResult<Vec<Item>> {
    use crate::schema::items::dsl::*;

    items.load::<Item>(conn) // Charge directement les données
}
