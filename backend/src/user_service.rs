use crate::models::users_models::{Claims, LoginWithToken, NewUser, User};
use crate::schema::users::dsl::users;
use crate::schema::users::{id, username};
use diesel::prelude::*;
use diesel::QueryResult;
use std::env;

use dotenv::dotenv;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use std::time::{SystemTime, UNIX_EPOCH};

/// Retrieves all users from the database.
pub fn fetch_all_users(conn: &mut PgConnection) -> QueryResult<Vec<User>> {
    users.load::<User>(conn)
}

/// Creates a new user in the database and returns the login response containing the user's ID and username.
pub fn register_new_user(conn: &mut PgConnection, new_user: NewUser) -> Result<LoginWithToken, diesel::result::Error> {
    dotenv().ok();
    let secret_key = env::var("SECRET_KEY").expect("SECRET_KEY must be set");

    let inserted_user: (i32, String) = diesel::insert_into(users)
        .values(&new_user)
        .returning((id, username))
        .get_result(conn)?;

    let token = generate_jwt(&inserted_user.0.to_string(), &secret_key).expect("Failed to generate token");
    println!("{}", token);
    Ok(LoginWithToken {
        id: inserted_user.0,
        username: inserted_user.1,
        token,
    })
}

pub fn login_user(conn: &mut PgConnection, credentials: NewUser) -> Result<LoginWithToken, diesel::result::Error> {
    dotenv().ok();
    let secret_key = env::var("SECRET_KEY").expect("SECRET_KEY must be set");

    let user_in_db = users
        .filter(username.eq(&credentials.username))
        .first::<User>(conn);

    let user_in_db = match user_in_db {
        Ok(user) => user,
        Err(_) => return Err(diesel::result::Error::NotFound),
    };

    if credentials.password_hash == user_in_db.password_hash {
        let token = generate_jwt(&user_in_db.id.to_string(), &secret_key).expect("Failed to generate token");

        let response = LoginWithToken {
            id: user_in_db.id,
            username: user_in_db.username,
            token,
        };
        Ok(response)
    } else {
        Err(diesel::result::Error::NotFound)
    }
}

fn generate_jwt(user_id: &str, secret_key: &str) -> Result<String, jsonwebtoken::errors::Error> {
    let expiration = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .unwrap()
        .as_secs() + 3600; // 1 heure

    let claims = Claims {
        sub: user_id.to_owned(),
        exp: expiration as usize,
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(secret_key.as_ref()),
    )
}


fn _validate_jwt(token: &str, secret_key: &str) -> Result<Claims, jsonwebtoken::errors::Error> {
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret_key.as_ref()),
        &Validation::default(),
    )?;
    Ok(token_data.claims)
}
