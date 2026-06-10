/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable("projects", (table) => {
    table.increments("id").primary();
    table.string("name");
    table.text("description");
    table.string("status");
    table
      .integer("owner_id")
      .unsigned()
      .references("id")
      .inTable("users");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
   return knex.schema.dropTable("projects");
};
