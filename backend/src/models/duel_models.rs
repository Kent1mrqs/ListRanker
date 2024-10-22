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

#[derive(Serialize, Clone)]
pub struct ItemDuelWithNameAndImage {
    pub id: i32,
    pub name: String,
    pub image: Option<Vec<u8>>,
}

#[derive(Insertable, Deserialize, Clone)]
#[diesel(table_name = duels)]
pub struct BattleResultApi {
    pub ranking_id: i32,
    pub winner: i32,
    pub loser: i32,
}
#[derive(Insertable, Deserialize, Clone)]
#[diesel(table_name = duels)]
pub struct BattleResultDb {
    pub ranking_id: i32,
    pub winner: i32,
    pub loser: i32,
    pub explicit: bool,
}

#[allow(dead_code)]
pub struct ScoreId {
    pub id: i32,
    pub score: i32,
}
