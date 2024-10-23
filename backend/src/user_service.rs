use crate::models::users_models::{Claims, LoginWithToken, NewUserApi, NewUserDb, User};
use crate::schema::users::dsl::users;
use crate::schema::users::{id, username};
use actix_web::dev::{Service, ServiceResponse};
use actix_web::{dev::ServiceRequest, Error, HttpMessage};
use bcrypt::{hash, verify, DEFAULT_COST};
use diesel::prelude::*;
use diesel::QueryResult;
use dotenv::dotenv;
use jsonwebtoken::{decode, encode, DecodingKey, EncodingKey, Header, Validation};
use std::env;
use std::time::{SystemTime, UNIX_EPOCH};

/// Retrieves all users from the database.
pub fn fetch_all_users(conn: &mut PgConnection) -> QueryResult<Vec<User>> {
    users.load::<User>(conn)
}

/// Creates a new user in the database and returns the login response containing the user's ID and username.
pub fn register_new_user(conn: &mut PgConnection, new_user: NewUserApi) -> Result<LoginWithToken, diesel::result::Error> {
    dotenv().ok();
    let secret_key = env::var("SECRET_KEY").expect("SECRET_KEY must be set");

    let existing_user = users
        .filter(username.eq(&new_user.username))
        .first::<User>(conn)
        .optional()?;

    if existing_user.is_some() {
        return Err(diesel::result::Error::DatabaseError(
            diesel::result::DatabaseErrorKind::UniqueViolation,
            Box::new("Username already exists".to_string()),
        ));
    }

    let hashed_password = hash(&new_user.password, DEFAULT_COST).expect("Failed to hash password");

    let new_user_to_insert = NewUserDb {
        username: new_user.username.clone(),
        password_hash: hashed_password,
    };

    let inserted_user: (i32, String) = diesel::insert_into(users)
        .values(&new_user_to_insert)
        .returning((id, username))
        .get_result(conn)?;

    let token = generate_jwt(&inserted_user.0.to_string(), &secret_key).expect("Failed to generate token");

    Ok(LoginWithToken {
        id: inserted_user.0,
        username: inserted_user.1,
        token,
    })
}

pub fn login_user(conn: &mut PgConnection, credentials: NewUserApi) -> Result<LoginWithToken, diesel::result::Error> {
    dotenv().ok();
    let secret_key = env::var("SECRET_KEY").expect("SECRET_KEY must be set");

    let user_in_db = users
        .filter(username.eq(&credentials.username))
        .first::<User>(conn);

    let user_in_db = match user_in_db {
        Ok(user) => user,
        Err(_) => return Err(diesel::result::Error::NotFound),
    };

    if verify(&credentials.password, &user_in_db.password_hash).unwrap_or(false) {
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


fn validate_jwt(token: &str, secret_key: String) -> Result<Claims, jsonwebtoken::errors::Error> {
    let token_data = decode::<Claims>(
        token,
        &DecodingKey::from_secret(secret_key.as_ref()),
        &Validation::default(),
    )?;
    Ok(token_data.claims)
}


pub async fn jwt_middleware<S>(
    req: ServiceRequest,
    srv: &S,
) -> Result<ServiceResponse, Error>
where
    S: Service<ServiceRequest, Response=ServiceResponse, Error=Error> + 'static,
{
    let auth_header = req.headers().get("Authorization");
    if let Some(auth_header) = auth_header {
        if let Ok(auth_str) = auth_header.to_str() {
            if auth_str.starts_with("Bearer ") {
                let token = auth_str[7..].trim();
                let secret_key = std::env::var("SECRET_KEY").expect("SECRET_KEY must be set");

                match validate_jwt(token, secret_key) {
                    Ok(claims) => {
                        req.extensions_mut().insert(claims);
                        return Ok(srv.call(req).await?);
                    }
                    Err(_) => {
                        return Err(actix_web::error::ErrorUnauthorized("Invalid token"));
                    }
                }
            }
        }
    }
    Err(actix_web::error::ErrorUnauthorized("Invalid or missing token"))
}



