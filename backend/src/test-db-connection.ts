import "dotenv/config";
import { AppDataSource } from "./config/database.config";

async function testDatabaseConnection() {
  try {
    console.log("Testing database connection...");
    console.log(`DATABASE_URL environment variable is ${process.env.DATABASE_URL ? 'set' : 'NOT SET'}`);
    
    await AppDataSource.initialize();
    console.log("✅ Database connection successful!");
    
    // Try a simple query
    const result = await AppDataSource.query("SELECT NOW()");
    console.log("Database time:", result[0].now);
    
    await AppDataSource.destroy();
    console.log("Connection closed.");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

testDatabaseConnection(); 