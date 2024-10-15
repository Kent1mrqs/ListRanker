use crate::schema::rankings;
use diesel::{Insertable, Queryable};
use serde_derive::{Deserialize, Serialize};

#[derive(Queryable, Serialize, Deserialize)]
pub struct Ranking {
    pub id: i32,
    pub user_id: Option<i32>,
    pub name: String,
    pub list_id: Option<i32>,
    pub ranking_type: String,
}

#[derive(Insertable, Deserialize, Serialize, Debug)]
#[diesel(table_name = rankings)]
pub struct NewRanking {
    pub user_id: Option<i32>,
    pub name: String,
    pub list_id: Option<i32>,
    pub ranking_type: String,
}


