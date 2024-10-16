CREATE TABLE users
(
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE lists
(
    id      SERIAL PRIMARY KEY,
    user_id INT,
    name    VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE items
(
    id      SERIAL PRIMARY KEY,
    list_id INT,
    name    VARCHAR(255) NOT NULL,
    FOREIGN KEY (list_id) REFERENCES lists (id)
);