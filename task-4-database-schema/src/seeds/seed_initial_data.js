exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("project_events").del();
  await knex("projects").del();
  await knex("users").del();

  // Insert sample users
  await knex("users").insert([
    { id: 1, name: "John", email: "john@example.com", role: "admin" },
    { id: 2, name: "Sarah", email: "sarah@example.com", role: "developer" }
  ]);

  // Insert sample projects
  await knex("projects").insert([
    { id: 1, name: "Shipyard Project", description: "Sample Project", status: "active", owner_id: 1 }
  ]);

  // Insert sample project events
  await knex("project_events").insert([
    { id: 1, project_id: 1, event_type: "Created", description: "Project created" }
  ]);
};
