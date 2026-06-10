module.exports = {
  development: {
    client: "sqlite3",
    connection: {
      filename: "./database.sqlite",
    },
    useNullAsDefault: true,
    migrations: {
      directory: "./src/migrations",
    },
    seeds: {
      directory: "./src/seeds",
    },
  },
};
