use crate::handlers::duel_handlers::Winner;
use crate::ranking_item_service::get_ranking_items_by_ranking_id;
use diesel::prelude::*;
use rand::Rng;
use serde_derive::Serialize;

#[derive(Serialize)]
pub struct ItemDuel {
    pub id: i32,
    pub name: String,
    pub image: String,
}

/// Je reçois l'id du ranking et l'id de l'item qui a gagné, à partir de là, je
pub fn next_duel(conn: &mut PgConnection, ranking_id: i32, winner: Winner) -> Result<(), Box<dyn std::error::Error>> {
    // Example logic; replace this with actual code
    // You can add code to perform operations, query the database, etc.
    Ok(()) // Ensure it returns `Result`
}


/// Je reçois l'id du ranking, je crée ou load une session?
pub fn init_duel(conn: &mut PgConnection, ranking_id: i32) -> Result<Vec<ItemDuel>, Box<dyn std::error::Error>> {
    let response = random_duel(conn, ranking_id)?;
    Ok(response)
}

/// Retrieves two different random items from a ranking list based on the given ranking ID.
pub fn random_duel(conn: &mut PgConnection, ranking_id: i32) -> Result<Vec<ItemDuel>, Box<dyn std::error::Error>> {
    let items = get_ranking_items_by_ranking_id(conn, ranking_id)?;
    let list_size = items.len();
    if list_size < 2 {
        return Err("Not enough items for a duel.".into());
    }

    let mut rng = rand::thread_rng();
    let mut position_1 = rng.gen_range(0..list_size);
    let mut position_2 = rng.gen_range(0..list_size);

    while position_1 == position_2 {
        position_2 = rng.gen_range(0..list_size);
    }

    let item_1 = ItemDuel {
        id: position_1 as i32,
        name: items[position_1].name.clone(),
        image: format!("image_{}.png", position_1),
    };
    let item_2 = ItemDuel {
        id: position_2 as i32,
        name: items[position_2].name.clone(),
        image: format!("image_{}.png", position_2),
    };

    Ok(vec![item_1, item_2])
}
pub fn store_winner(conn: &mut PgConnection, id_session: i32) -> () {}

pub fn create_session(conn: &mut PgConnection, id_session: i32) -> () {}

pub fn load_session(conn: &mut PgConnection, id_session: i32) -> () {}

pub fn generate_final_ranking(conn: &mut PgConnection, id_session: i32) -> () {}
