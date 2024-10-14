use super::schema::lists;
use crate::models::items::NewItemApi;
use diesel::{Insertable, Queryable};
use serde_derive::{Deserialize, Serialize};


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