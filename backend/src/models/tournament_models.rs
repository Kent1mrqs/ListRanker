use crate::models::duel_models::ItemDuel;
use serde_derive::Serialize;

#[derive(Serialize)]
pub struct NextTournamentData {
    pub(crate) next_duel: Vec<(ItemDuel, ItemDuel)>,
    pub(crate) duels_left: i64,
}
