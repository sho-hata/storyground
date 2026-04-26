import path from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

const databaseUrl = process.env.DATABASE_URL!;

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  datasource: {
    url: databaseUrl,
  },
  migrate: {
    adapter: () => {
      const pool = new Pool({ connectionString: databaseUrl });
      return new PrismaPg(pool);
    },
  },
});
