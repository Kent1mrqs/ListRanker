use crate::models::users_models::{NewUser, User};
use diesel::prelude::*;
use diesel::QueryResult;

pub fn get_all_users(conn: &mut PgConnection) -> QueryResult<Vec<User>> {
    use crate::schema::users::dsl::*;

    users.load::<User>(conn)
}

pub fn create_new_user(conn: &mut PgConnection, new_user: NewUser) -> QueryResult<usize> {
    use crate::schema::users;

    diesel::insert_into(users::table)
        .values(new_user)
        .execute(conn)
}
