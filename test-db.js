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

console.log('Connecting with:', {
  user: envVars.username || envVars.DB_USER,
  host: envVars.host || envVars.DB_HOST || 'localhost',
  port: envVars.port || envVars.DB_PORT || '5432',
  database: envVars.database || envVars.DB_NAME,
  password: '***'
});

const pool = new Pool({
  user: envVars.username || envVars.DB_USER,
  password: envVars.password || envVars.DB_PASSWORD,
  host: envVars.host || envVars.DB_HOST || 'localhost',
  port: parseInt(envVars.port || envVars.DB_PORT || '5432'),
  database: envVars.database || envVars.DB_NAME,
});

pool.query('SELECT * FROM "ResearchPaperTable" LIMIT 5')
  .then(result => {
    console.log('✅ Success! Got', result.rows.length, 'papers');
    console.log('First paper:', result.rows[0]?.title);
    pool.end();
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error:', err.message);
    pool.end();
    process.exit(1);
  });

