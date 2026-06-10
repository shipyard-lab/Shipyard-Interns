/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
   return knex.schema.createTable("project_events", (table) => {
    table.increments("id").primary();
    table
      .integer("project_id")
      .unsigned()
      .references("id")
      .inTable("projects");
    table.string("event_type");
    table.text("description");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable("project_events");
};
