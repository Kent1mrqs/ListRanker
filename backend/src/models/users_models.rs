use crate::schema::users;
use diesel::{Insertable, Queryable};
use serde::{Deserialize, Serialize};

#[derive(Queryable, Deserialize, Serialize)]
pub struct User {
    pub id: i32,
    pub username: String,
    pub password_hash: String,
}

#[derive(Insertable, Deserialize, Serialize, Debug)]
#[diesel(table_name = users)]
pub struct NewUser {
    pub username: String,
    pub password_hash: String,
}

#[derive(Serialize)]
pub struct LoginResponse {
    pub(crate) id: i32,
    pub(crate) username: String,
}
#[derive(Serialize)]
pub struct LoginWithToken {
    pub(crate) id: i32,
    pub(crate) username: String,
    pub(crate) token: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub(crate) sub: String,
    pub(crate) exp: usize,
}
