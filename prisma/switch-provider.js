const fs = require("fs");
const path = require("path");

const schemaPath = path.join(__dirname, "prisma", "schema.prisma");
const provider = process.argv[2]; // 'sqlite' or 'postgresql'

if (!provider) {
  console.error("❌ Please provide a provider: sqlite or postgresql");
  process.exit(1);
}

const schema = fs.readFileSync(schemaPath, "utf-8");

const replaced = schema.replace(
  /provider\s*=\s*"(sqlite|postgresql|mysql)"/,
  `provider = "${provider}"`
);

fs.writeFileSync(schemaPath, replaced, "utf-8");

console.log(`✅ Replaced provider with "${provider}" in schema.prisma`);
