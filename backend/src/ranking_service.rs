use crate::models::rankings_models::{NewRanking, Ranking};
use diesel::prelude::*;

pub fn get_all_rankings(conn: &mut PgConnection) -> QueryResult<Vec<Ranking>> {
    use crate::schema::rankings::dsl::*;
    rankings.load::<Ranking>(conn)
}

pub fn create_new_ranking(conn: &mut PgConnection, new_ranking: NewRanking) -> QueryResult<usize> {
    use crate::schema::rankings::dsl::*;

    diesel::insert_into(rankings)
        .values(&new_ranking)
        .execute(conn)
}
