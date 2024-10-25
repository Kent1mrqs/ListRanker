CREATE TABLE users
(
    id            SERIAL PRIMARY KEY,
    username      VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE lists
(
    id      SERIAL PRIMARY KEY,
    user_id INT          NOT NULL,
    name    VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE items
(
    id      SERIAL PRIMARY KEY,
    list_id INT          NOT NULL,
    image   BYTEA,
    name    VARCHAR(255) NOT NULL,
    FOREIGN KEY (list_id) REFERENCES lists (id)
);

CREATE TABLE rankings
(
    id              SERIAL PRIMARY KEY,
    user_id         INT          NOT NULL,
    name            VARCHAR(255) NOT NULL,
    list_id         INT          NOT NULL,
    pool            INT          NOT NULL,
    ranking_type    VARCHAR(255) NOT NULL,
    creation_method VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id),
    FOREIGN KEY (list_id) REFERENCES lists (id)
);

CREATE TABLE ranking_items
(
    id         SERIAL PRIMARY KEY,
    ranking_id INT NOT NULL,
    item_id    INT NOT NULL,
    rank       INT NOT NULL,
    score      INT NOT NULL,
    FOREIGN KEY (ranking_id) REFERENCES rankings (id),
    FOREIGN KEY (item_id) REFERENCES items (id)
);