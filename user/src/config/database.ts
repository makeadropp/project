import { createUsersTable } from "../infrastructure/db/migrations/001_create_users";


export async function initializeDatabase() {
  try {
    await createUsersTable();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
}