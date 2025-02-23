use crate::models::items_models::NewItemApi;
use crate::schema::lists;
use diesel::{Insertable, Queryable};
use serde_derive::{Deserialize, Serialize};

#[derive(Queryable, Deserialize, Serialize)]
pub struct List {
    pub list_id: i32,
    pub user_id: i32,
    pub name: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct NewListApi {
    pub name: String,
    #[serde(skip_serializing_if = "Vec::is_empty", default)]
    pub items: Vec<NewItemApi>,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct EditList {
    pub name: String,
    //pub items: Vec<NewItemApi>,
}

#[derive(Insertable, Deserialize, Serialize, Debug)]
#[diesel(table_name = lists)]
pub struct NewListDb {
    pub user_id: i32,
    pub name: String,
}