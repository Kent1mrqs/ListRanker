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
pub struct List {
    pub list_id: i32,
    pub user_id: Option<i32>,
    pub name: String,
}

#[derive(Insertable, Deserialize, Serialize, Debug)]
#[diesel(table_name = lists)]
pub struct NewList {
    pub user_id: Option<i32>,
    pub name: String,
}


#[derive(Queryable, serde::Serialize)]
pub struct Item {
    pub item_id: i32,
    pub list_id: Option<i32>,
    pub name: String,
}

#[derive(Insertable, serde::Deserialize)]
#[diesel(table_name = items)]
pub struct NewItem<'a> {
    pub list_id: Option<i32>,
    pub name: &'a str,
}