import { readFileSync, existsSync, writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { buildSeedSql, findRows, normalizeUserKey, sqlLiteral } from './notion-import-lib.mjs';

function loadEnv(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split(/\r?\n/u)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const separator = trimmed.indexOf('=');
    if (separator < 1) continue;
    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

function runWrangler(args, options = {}) {
  const result = spawnSync('npx', ['--yes', 'wrangler@4.118.0', ...args], {
    cwd: process.cwd(),
    env: process.env,
    encoding: 'utf8',
    stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit'
  });
  if (result.status !== 0) {
    if (options.capture) process.stderr.write(result.stderr || result.stdout || 'Wrangler failed.\n');
    process.exit(result.status || 1);
  }
  return result.stdout || '';
}

function parseJsonOutput(output) {
  const firstArray = output.indexOf('[');
  const firstObject = output.indexOf('{');
  const start = [firstArray, firstObject].filter(index => index >= 0).sort((a, b) => a - b)[0];
  if (start === undefined) throw new Error('Wrangler did not return JSON output.');
  return JSON.parse(output.slice(start));
}

loadEnv(resolve('.env'));

const userKey = normalizeUserKey(process.argv[2]);
const dataPath = resolve(process.argv[3] || 'private-import/notion-active-tasks.json');
const dbName = process.env.MISSION_CONTROL_DB_NAME || 'mission-control-db';
const configPath = resolve('wrangler.jsonc');

if (!userKey) {
  console.error('Usage: npm run import:notion -- <user-id> [data-file]');
  process.exit(1);
}
if (!existsSync(dataPath)) {
  console.error(`Import file not found: ${dataPath}`);
  process.exit(1);
}
if (!existsSync(configPath)) {
  console.error('wrangler.jsonc not found. Run: npm run setup');
  process.exit(1);
}
if (!process.env.CLOUDFLARE_API_TOKEN || !process.env.CLOUDFLARE_ACCOUNT_ID) {
  console.error('CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID are required in .env.');
  process.exit(1);
}

const data = JSON.parse(readFileSync(dataPath, 'utf8'));
const tasks = Array.isArray(data.tasks) ? data.tasks : [];
if (!tasks.length) {
  console.error('No tasks found in the import file.');
  process.exit(1);
}

console.log('=== Apply D1 migrations ===');
runWrangler(['d1', 'migrations', 'apply', dbName, '--remote']);

console.log('\n=== Find account ===');
const query = `SELECT id, user_key FROM users WHERE user_key = ${sqlLiteral(userKey)} LIMIT 1;`;
const raw = runWrangler(['d1', 'execute', dbName, '--remote', '--command', query, '--json'], { capture: true });
const rows = findRows(parseJsonOutput(raw));
const user = rows.find(row => normalizeUserKey(row.user_key) === userKey);
if (!user) {
  console.error(`User ID "${userKey}" was not found. Create the account in the app first.`);
  process.exit(1);
}

const sqlPath = join(tmpdir(), `mission-control-notion-${Date.now()}.sql`);
writeFileSync(sqlPath, buildSeedSql(user.id, userKey, tasks), 'utf8');

try {
  console.log(`\n=== Import ${tasks.length} active tasks ===`);
  runWrangler(['d1', 'execute', dbName, '--remote', '--file', sqlPath]);
} finally {
  if (existsSync(sqlPath)) unlinkSync(sqlPath);
}

console.log('\nImport complete.');
console.log(`User ID: ${userKey}`);
console.log(`Active Notion tasks prepared: ${tasks.length}`);
console.log(`Completed history skipped: ${Number(data.completedSkipped || 0)}`);
console.log('The import is safe to run again; existing seeded task IDs are ignored.');
