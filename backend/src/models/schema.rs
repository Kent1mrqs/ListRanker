// @generated automatically by Diesel CLI.

diesel::table! {
    duels (id) {
        id -> Int4,
        ranking_id -> Int4,
        loser -> Int4,
        winner -> Int4,
    }
}

diesel::table! {
    items (id) {
        id -> Int4,
        list_id -> Int4,
        #[max_length = 255]
        name -> Varchar,
        position_list -> Int4,
    }
}

diesel::table! {
    lists (id) {
        id -> Int4,
        user_id -> Int4,
        #[max_length = 255]
        name -> Varchar,
    }
}

diesel::table! {
    ranking_items (id) {
        id -> Int4,
        ranking_id -> Int4,
        item_id -> Int4,
        rank -> Int4,
        score -> Int4,
    }
}

diesel::table! {
    rankings (id) {
        id -> Int4,
        user_id -> Int4,
        #[max_length = 255]
        name -> Varchar,
        list_id -> Int4,
        #[max_length = 255]
        ranking_type -> Varchar,
        #[max_length = 255]
        creation_method -> Varchar,
    }
}

diesel::table! {
    users (id) {
        id -> Int4,
        #[max_length = 255]
        username -> Varchar,
        #[max_length = 255]
        password_hash -> Varchar,
    }
}

diesel::joinable!(duels -> rankings (ranking_id));
diesel::joinable!(items -> lists (list_id));
diesel::joinable!(lists -> users (user_id));
diesel::joinable!(ranking_items -> items (item_id));
diesel::joinable!(ranking_items -> rankings (ranking_id));
diesel::joinable!(rankings -> lists (list_id));
diesel::joinable!(rankings -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    duels,
    items,
    lists,
    ranking_items,
    rankings,
    users,
);
