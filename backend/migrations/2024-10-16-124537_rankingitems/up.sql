CREATE TABLE ranking_items
(
    id         SERIAL PRIMARY KEY,
    id_ranking INT,
    item_id    INT,
    rank       INT NOT NULL,
    FOREIGN KEY (id_ranking) REFERENCES rankings (id),
    FOREIGN KEY (item_id) REFERENCES items (id)
);