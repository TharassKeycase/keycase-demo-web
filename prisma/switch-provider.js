const fs = require("fs");
const path = require("path");

const provider = process.env.DB_PROVIDER;

if (!["sqlite", "postgresql"].includes(provider)) {
  console.error(`❌ Invalid or missing DB_PROVIDER: "${provider}"`);
  process.exit(1);
}

const schemaPath = path.join(__dirname, "schema.prisma");
let schema = fs.readFileSync(schemaPath, "utf-8");

schema = schema.replace(
  /provider\s*=\s*"(sqlite|postgresql|mysql)"/,
  `provider = "${provider}"`
);

fs.writeFileSync(schemaPath, schema, "utf-8");
console.log(`✅ Prisma provider set to "${provider}"`);
