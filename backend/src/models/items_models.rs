use crate::schema::items;
use diesel::{Identifiable, Insertable, Queryable};
use serde_derive::{Deserialize, Serialize};

#[derive(Queryable, Deserialize, Serialize, Identifiable)]
pub struct Item {
    pub id: i32,
    pub list_id: i32,
    pub name: String,
    pub position_list: i32,
}

#[derive(Insertable, Serialize, Deserialize, Debug)]
#[diesel(table_name = items)]
pub struct NewItem {
    pub list_id: i32,
    pub name: String,
    pub position_list: i32,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NewItemApi {
    pub name: String,
}