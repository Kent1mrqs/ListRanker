use super::schema::items;
use super::schema::lists;
use super::schema::users;
use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};

#[derive(
    Queryable,
    Deserialize,
    Serialize
)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub email: String,
    pub password_hash: String,
}

#[derive(Insertable, Deserialize, Serialize, Debug)]
#[diesel(table_name = users)]
pub struct NewUser {
    pub username: String,
    pub email: String,
    pub password_hash: String,
}

#[derive(Queryable, Deserialize, Serialize)]
pub struct Item {
    pub item_id: i32,
    pub list_id: Option<i32>,
    pub name: String,
}

#[derive(Insertable, Serialize, Deserialize, Debug)]
#[diesel(table_name = items)]
pub struct NewItem {
    pub list_id: Option<i32>,
    pub name: String,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NewItemApi {
    pub name: String,
}

#[derive(Queryable, Deserialize, Serialize)]
pub struct List {
    pub list_id: i32,
    pub user_id: Option<i32>,
    pub name: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct NewListApi {
    pub user_id: Option<i32>,
    pub name: String,
    #[serde(skip_serializing_if = "Vec::is_empty", default)]
    pub elements: Vec<NewItemApi>,
}

#[derive(Insertable, Deserialize, Serialize, Debug)]
#[diesel(table_name = lists)]
pub struct NewListDb {
    pub user_id: Option<i32>,
    pub name: String,
}

