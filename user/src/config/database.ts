import { createUserTable } from "@/infra/db/migrations/001_create_users";

export async function initializeDatabase() {
  try {
    await createUserTable();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
}
