use crate::models::rankings_models::Ranking;
use crate::schema::rankings;
use diesel::prelude::*;

pub fn get_all_rankings(conn: &mut PgConnection) -> QueryResult<Vec<Ranking>> {
    rankings::dsl::rankings
        .load::<Ranking>(conn)
}