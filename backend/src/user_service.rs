use crate::models::users_models::{LoginResponse, NewUser, User};
use crate::schema::users::dsl::users;
use crate::schema::users::{id, username};
use diesel::prelude::*;
use diesel::QueryResult;

/// Retrieves all users from the database.
pub fn fetch_all_users(conn: &mut PgConnection) -> QueryResult<Vec<User>> {
    users.load::<User>(conn)
}

/// Creates a new user in the database and returns the login response containing the user's ID and username.
pub fn register_new_user(conn: &mut PgConnection, new_user: NewUser) -> Result<LoginResponse, diesel::result::Error> {
    let inserted_user: (i32, String) = diesel::insert_into(users)
        .values(&new_user)
        .returning((id, username))
        .get_result(conn)?;

    Ok(LoginResponse {
        id: inserted_user.0,
        username: inserted_user.1,
    })
}