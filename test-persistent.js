const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load .env file
const envPath = path.join(__dirname, '.env');
const envFile = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=');
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim();
  }
});

const pool = new Pool({
  user: envVars.username || envVars.DB_USER,
  password: envVars.password || envVars.DB_PASSWORD,
  host: envVars.host || envVars.DB_HOST || 'localhost',
  port: parseInt(envVars.port || envVars.DB_PORT || '5432'),
  database: envVars.database || envVars.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

console.log('Pool created, running 5 queries in sequence...');

async function runQueries() {
  for (let i = 0; i < 5; i++) {
    try {
      console.log(`\nQuery ${i + 1}...`);
      const result = await pool.query('SELECT COUNT(*) FROM "ResearchPaperTable"');
      console.log(`✅ Success! Count: ${result.rows[0].count}`);
      await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms between queries
    } catch (err) {
      console.error(`❌ Error on query ${i + 1}:`, err.message);
      break;
    }
  }
  
  console.log('\nClosing pool...');
  await pool.end();
  console.log('Done!');
}

runQueries();






