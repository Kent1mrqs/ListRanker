use crate::schema::ranking_items;
use diesel::{Insertable, Queryable, Selectable};
use serde_derive::{Deserialize, Serialize};

#[derive(Queryable, Insertable, Selectable, Deserialize, Serialize, Debug)]
pub struct RankingItem {
    pub id: i32,
    pub ranking_id: i32,
    pub item_id: i32,
    pub rank: i32,
}

#[derive(Insertable, Serialize, Deserialize, Debug)]
#[diesel(table_name = ranking_items)]
pub struct NewRankingItem {
    pub ranking_id: i32,
    pub item_id: i32,
    pub rank: i32,
}

#[derive(Queryable, Serialize, Clone, Debug)]
pub struct RankingItemWithName {
    pub(crate) id: i32,
    pub(crate) ranking_id: i32,
    pub(crate) item_id: i32,
    pub(crate) rank: i32,
    pub(crate) name: String,
}
#[derive(Deserialize, Serialize, Debug)]
pub struct NewRankings {
    pub(crate) id: i32,
    pub(crate) new_rank: i32,
}