import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';

// Load .env file manually if it exists
function loadEnv() {
  try {
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const envFile = fs.readFileSync(envPath, 'utf-8');
      envFile.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim();
          if (!process.env[key.trim()]) {
            process.env[key.trim()] = value;
          }
        }
      });
    }
  } catch (error) {
    console.error('Error loading .env file:', error);
  }
}

// Load env on module import
loadEnv();

// Global pool variable - survives hot reloads
declare global {
  var dbPool: Pool | undefined;
}

export function getPool() {
  if (!global.dbPool) {
    console.log('Creating new pool...');
    global.dbPool = new Pool({
      user: process.env.DB_USER || process.env.username,
      password: process.env.DB_PASSWORD || process.env.password,
      host: process.env.DB_HOST || process.env.host || 'localhost',
      port: parseInt(process.env.DB_PORT || process.env.port || '5432'),
      database: process.env.DB_NAME || process.env.database,
      max: 20, // Maximum number of clients in the pool
      idleTimeoutMillis: 30000, // How long a client can be idle before being closed
      connectionTimeoutMillis: 2000, // How long to wait when connecting
    });
  }
  return global.dbPool;
}

