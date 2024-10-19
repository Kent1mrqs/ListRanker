-- Your SQL goes here
CREATE TABLE duels
(
    id         SERIAL PRIMARY KEY,
    ranking_id INT NOT NULL,
    loser      INT NOT NULL,
    winner     INT NOT NULL,
    FOREIGN KEY (ranking_id) REFERENCES rankings (id)
);