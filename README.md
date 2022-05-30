# Multiplayer Chess ♟

> “Of chess, it has been said that life is not long enough for it, but that is the fault of life, not chess.” – William Napier

**Play it [here](https://vimeo.com/715099767)**.

## About

Buddle01 is a web chess app with inbuilt huddle01 video conferencing feature which allows two players to play chess as well as communicate on the same platform.

## Running the app

**1. Run the server**

1.  From your terminal `cd` into the server directory and run `npm install`.
2.  Install and run PostgreSQL if you haven't already. Create chess database.
3.  Create a .env file in the root of server directory and declare PORT and DATABASE_URL. For PORT you can use 9000 and for DATABASE_URL postgres://{username}@localhost:5432/chess where username is the username you use to login into your machine.
4.  From your terminal run `npm start`.

**2. Run the client**

1.  From your terminal `cd` into the client directory and run `npm install`.
2.  From your terminal run `npm start`.
