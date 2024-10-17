use crate::models::users_models::{LoginResponse, NewUser, User};
use crate::schema::users::dsl::users;
use crate::schema::users::{id, username};
use diesel::prelude::*;
use diesel::QueryResult;

pub fn get_all_users(conn: &mut PgConnection) -> QueryResult<Vec<User>> {
    users.load::<User>(conn)
}

pub fn create_new_user(conn: &mut PgConnection, new_user: NewUser) -> Result<LoginResponse, diesel::result::Error> {
    let inserted_user: (i32, String) = diesel::insert_into(users)
        .values(&new_user)
        .returning((id, username))
        .get_result(conn)?;

    Ok(LoginResponse {
        id: inserted_user.0,
        username: inserted_user.1,
    })
}

