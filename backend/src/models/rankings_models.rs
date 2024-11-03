use crate::schema::rankings;
use diesel::{Insertable, Queryable, Selectable};
use serde_derive::{Deserialize, Serialize};

#[derive(Queryable, Insertable, Selectable, Serialize, Deserialize, Debug)]
pub struct Ranking {
    pub id: i32,
    pub user_id: i32,
    pub name: String,
    pub list_id: i32,
    pub ranking_type: String,
    pub creation_method: String,
}

#[derive(Insertable, Deserialize, Serialize, Debug)]
#[diesel(table_name = rankings)]
pub struct NewRanking {
    pub user_id: i32,
    pub name: String,
    pub list_id: i32,
    pub ranking_type: String,
    pub creation_method: String,
}

#[derive(Deserialize, Serialize)]
pub struct NewRankingApi {
    pub name: String,
    pub list_id: i32,
    pub ranking_type: String,
    pub creation_method: String,
}


