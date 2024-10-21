use crate::schema::duels;
use diesel::Insertable;
use serde_derive::{Deserialize, Serialize};

#[derive(Serialize)]
pub struct NextDuelData {
    pub(crate) next_duel: Vec<ItemDuel>,
    pub(crate) duels_left: i64,
}

#[derive(Serialize)]
pub enum DuelResult {
    Finished(String),
    NextDuelData(NextDuelData),
}


#[derive(Serialize)]
pub struct ItemDuel {
    pub id: i32,
    pub name: String,
    pub image: String,
}

#[derive(Insertable, Deserialize, Clone)]
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
