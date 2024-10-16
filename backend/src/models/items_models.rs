use crate::schema::items;
use diesel::{Insertable, Queryable};
use serde_derive::{Deserialize, Serialize};

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