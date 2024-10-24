use crate::user_service::validate_jwt;
use actix_web::dev::{Service, ServiceRequest, ServiceResponse, Transform};
use actix_web::{Error, HttpMessage};
use futures::future::{ok, Ready};
use std::future::Future;
use std::pin::Pin;
use std::task::{Context, Poll};

pub struct JwtMiddleware {
    secret_key: String,
}

// Implémentation de la structure
impl JwtMiddleware {
    pub fn new(secret_key: String) -> Self {
        JwtMiddleware { secret_key }
    }
}

pub async fn _jwt_middleware<S>(
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

                match crate::user_service::validate_jwt(token, secret_key) {
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


impl<S, B> Transform<S, ServiceRequest> for JwtMiddleware
where
    S: Service<ServiceRequest, Response=ServiceResponse<B>, Error=Error> + 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type InitError = ();
    type Transform = JwtMiddlewareService<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ok(JwtMiddlewareService {
            service,
            secret_key: self.secret_key.clone(),
        })
    }
}

pub struct JwtMiddlewareService<S> {
    service: S,
    secret_key: String,
}

impl<S, B> Service<ServiceRequest> for JwtMiddlewareService<S>
where
    S: Service<ServiceRequest, Response=ServiceResponse<B>, Error=Error> + 'static,
    B: 'static,
{
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = Pin<Box<dyn Future<Output=Result<Self::Response, Self::Error>>>>;

    fn poll_ready(&self, cx: &mut Context<'_>) -> Poll<Result<(), Self::Error>> {
        self.service.poll_ready(cx)
    }

    fn call(&self, req: ServiceRequest) -> Self::Future {
        let auth_header = req.headers().get("Authorization").cloned();
        let secret_key = self.secret_key.clone();

        // Analyser l'en-tête Authorization avant de passer `req` au service.
        if let Some(auth_header) = auth_header {
            if let Ok(auth_str) = auth_header.to_str() {
                if auth_str.starts_with("Bearer ") {
                    let token = auth_str[7..].trim();

                    // Valider le JWT avant de procéder
                    match validate_jwt(token, secret_key) {
                        Ok(claims) => {
                            // Insérer les claims dans les extensions de la requête
                            req.extensions_mut().insert(claims);

                            // Appeler le service avec la requête modifiée
                            let fut = self.service.call(req);
                            return Box::pin(async move {
                                let res = fut.await?;
                                Ok(res)
                            });
                        }
                        Err(_) => {
                            return Box::pin(async {
                                Err(actix_web::error::ErrorUnauthorized("Invalid token"))
                            });
                        }
                    }
                }
            }
        }

        // Si le token est manquant ou invalide, retourner une erreur Unauthorized
        Box::pin(async {
            Err(actix_web::error::ErrorUnauthorized("Invalid or missing token"))
        })
    }
}
