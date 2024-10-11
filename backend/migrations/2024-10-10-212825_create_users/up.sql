CREATE TABLE users (
                       user_id SERIAL PRIMARY KEY,
                       username VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL,
                       password_hash VARCHAR(255) NOT NULL
);

CREATE TABLE lists (
                       list_id INT PRIMARY KEY,
                       user_id INT,
                       name VARCHAR(255) NOT NULL,
                       FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE items (
                       item_id INT PRIMARY KEY,
                       list_id INT,
                       name VARCHAR(255) NOT NULL,
                       FOREIGN KEY (list_id) REFERENCES lists(list_id)
);