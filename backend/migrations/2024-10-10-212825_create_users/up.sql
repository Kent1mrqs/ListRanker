-- Table Users
CREATE TABLE users (
                       user_id INT PRIMARY KEY,
                       username VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL,
                       password_hash VARCHAR(255) NOT NULL
);

-- Table Lists
CREATE TABLE lists (
                       list_id INT PRIMARY KEY,
                       user_id INT,
                       name VARCHAR(255) NOT NULL,
                       FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Table Items
CREATE TABLE items (
                       item_id INT PRIMARY KEY,
                       list_id INT,
                       name VARCHAR(255) NOT NULL,
                       image_url VARCHAR(255),
                       FOREIGN KEY (list_id) REFERENCES lists(list_id)
);

-- Table Rankings
CREATE TABLE rankings (
                          ranking_id INT PRIMARY KEY,
                          user_id INT,
                          name VARCHAR(255) NOT NULL,
                          ranking_type VARCHAR(255) NOT NULL,
                          FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Table RankingItems
CREATE TABLE ranking_items (
                               ranking_item_id INT PRIMARY KEY,
                               ranking_id INT,
                               item_id INT,
                               rank INT NOT NULL,
                               FOREIGN KEY (ranking_id) REFERENCES rankings(ranking_id),
                               FOREIGN KEY (item_id) REFERENCES items(item_id)
);
