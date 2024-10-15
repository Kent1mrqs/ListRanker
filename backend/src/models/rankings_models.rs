use crate::schema::rankings;
use diesel::{Queryable, Selectable};
use serde_derive::{Deserialize, Serialize};

#[derive(Queryable, Selectable, Serialize, Deserialize)]
#[diesel(table_name = rankings)]
pub struct Ranking {
    pub id: i32,
    pub user_id: Option<i32>, // Champ nullable
    pub name: String,
    pub ranking_type: String,
}