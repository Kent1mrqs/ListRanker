// @generated automatically by Diesel CLI.

diesel::table! {
    items (item_id) {
        item_id -> Int4,
        list_id -> Nullable<Int4>,
        #[max_length = 255]
        name -> Varchar,
    }
}

diesel::table! {
    lists (list_id) {
        list_id -> Int4,
        user_id -> Nullable<Int4>,
        #[max_length = 255]
        name -> Varchar,
    }
}

diesel::table! {
    users (user_id) {
        user_id -> Int4,
        #[max_length = 255]
        username -> Varchar,
        #[max_length = 255]
        email -> Varchar,
        #[max_length = 255]
        password_hash -> Varchar,
    }
}

diesel::joinable!(items -> lists (list_id));
diesel::joinable!(lists -> users (user_id));

diesel::allow_tables_to_appear_in_same_query!(
    items,
    lists,
    users,
);
