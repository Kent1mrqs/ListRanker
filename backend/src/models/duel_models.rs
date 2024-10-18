use crate::schema::duels;
use diesel::Insertable;
use serde_derive::{Deserialize, Serialize};

#[derive(Serialize)]
pub enum DuelResult {
    Finished(String),
    NextDuel(Vec<ItemDuel>),
}

#[derive(Serialize)]
pub struct ItemDuel {
    pub id: i32,
    pub name: String,
    pub image: String,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = duels)]
pub struct BattleResult {
    pub ranking_id: i32,
    pub winner: i32,
    pub loser: i32,
}

#[allow(dead_code)]
pub struct ScoreId {
    pub id: i32,
    pub score: i32,
}
