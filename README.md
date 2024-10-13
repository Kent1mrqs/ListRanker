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
- **Frontend**: React + Typescript + Next.js
- **Docker**: For containerization.

## Setup

### Prerequisites

- [Rust and Cargo installed](https://doc.rust-lang.org/cargo/getting-started/installation.html)
- [Docker compose installed ](https://docs.docker.com/compose/install/)

### Installation

#### Github

1. **Clone the repository**:
    ```sh
    git clone git@github.com:Kent1mrqs/ListRanker.git
    cd ListRanker
    ```

#### Dependencies

1. **Backend**:
    ```sh
   cd backend && cargo build
    ```

2. **Frontend**
    ```sh
   cd frontend && npm install
    ```
   
3. **Configure the database**:
    ```sh
   cd docker/dev && docker-compose up -d
    ```

4. **Run migrations** :
    ```sh
    diesel migration run
    ```

5. **Run the application**:
    ```sh
    cd backend && cargo run
    ```
    ```sh
    cd frontend && npm run dev
    ```

6. **Access the application**:
    - Open your browser and go to `http://127.0.0.1:8080`.

### Docker Release


## Usage

### API Endpoints

- **POST /users**: Create a new user. 
- **GET /lists**: Get all lists of a user.
- **POST /lists**: Create a new list to a user.
- **GET /items**: Get all items of a list.
- **POST /items**: Create a new item in a list.
- **GET /rankings**: Get all rankings for a user.
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
