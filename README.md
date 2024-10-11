# Ranking App

A web application for creating and managing custom rankings of various items 

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Setup](#setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Contributing](#contributing)
- [License](#license)

## Features

- Create and manage lists of items.
- Create and manage rankings of items.
- Support for different types of rankings (tier list, binary list, pyramid ranking, etc.).
- Export rankings as PNG images.
- User authentication and authorization.
- Wizard for assisting in ranking creation.
- Comparison of rankings between users.

## Technologies

- **Backend**: Rust with Actix framework.
- **Database**: PostgreSQL.
- **Frontend**: HTML/CSS/JavaScript (you can use frameworks like React, Vue.js, or Angular).
- **Docker**: For containerization.

## Setup

### Prerequisites

- Rust and Cargo installed.
- PostgreSQL installed and running.
- Docker installed (optional for containerization).

### Installation

1. **Clone the repository**:
    ```sh
    git clone https://github.com/yourusername/ranking_app.git
    cd ranking_app
    ```

2. **Install dependencies**:
    ```sh
    cargo build
    ```

3. **Configure the database**:
    - Create a PostgreSQL database and user.
    - Update the `DATABASE_URL` environment variable in `.env` file.

4. **Run migrations** (if using a migration tool like `sqlx`):
    ```sh
    sqlx migrate run
    ```

5. **Run the application**:
    ```sh
    cargo run
    ```

6. **Access the application**:
    - Open your browser and go to `http://127.0.0.1:8080`.

### Docker (Optional)

1. **Build the Docker image**:
    ```sh
    docker build -t ranking_app .
    ```

2. **Run the Docker container**:
    ```sh
    docker run -p 8080:8080 ranking_app
    ```

## Usage

### API Endpoints

- **GET /users**: Get all users.
- **POST /users**: Create a new user.
- **GET /lists**: Get all lists.
- **POST /lists**: Create a new list.
- **GET /items**: Get all items.
- **POST /items**: Create a new item.
- **GET /rankings**: Get all rankings.
- **POST /rankings**: Create a new ranking.
- **GET /ranking_items**: Get all ranking items.
- **POST /ranking_items**: Create a new ranking item.

### Database Schema

```
[User]
*user_id
+username
+email
+password_hash

[List]
*list_id
+user_id
+name

[Item]
*item_id
+list_id
+name
+image_url

[Ranking]
*ranking_id
+user_id
+name
+ranking_type

[RankingItem]
*ranking_item_id
+ranking_id
+item_id
+rank

User *--1 List
List 1--* Item
User *--1 Ranking
Ranking 1--* RankingItem
RankingItem *--1 Item
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them with descriptive messages.
4. Push your branch to your fork.
5. Create a pull request to the main repository.

## Links

- https://actix.rs

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
