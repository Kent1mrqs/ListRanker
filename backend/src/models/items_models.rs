use crate::schema::items;
use diesel::{Identifiable, Insertable, Queryable, Selectable};
use serde_derive::{Deserialize, Serialize};

#[derive(Queryable, Selectable, Deserialize, Serialize, Identifiable)]
pub struct Item {
    pub id: i32,
    pub list_id: i32,
    pub name: String,
    pub image: String,
    pub position_list: i32,
}

#[derive(Insertable, Serialize, Deserialize, Debug)]
#[diesel(table_name = items)]
pub struct NewItem {
    pub list_id: i32,
    pub name: String,
    pub position_list: i32,
    pub image: Option<Vec<u8>>,
}
#[derive(Insertable, Serialize, Deserialize, Debug)]
#[diesel(table_name = items)]
pub struct NewEditItem {
    pub name: String,
    pub image: Option<Vec<u8>>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NewItemApi {
    pub name: String,
    pub image: String,
}
#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct NewItemId {
    pub name: String,
    pub image: String,
    pub id: i32,
}