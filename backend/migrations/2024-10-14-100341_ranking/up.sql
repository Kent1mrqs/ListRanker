CREATE TABLE rankings
(
    id           SERIAL PRIMARY KEY,
    user_id      INT,
    name         VARCHAR(255) NOT NULL,
    ranking_type VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);