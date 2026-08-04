import { writeFileSync } from 'node:fs';

const API_ROOT = process.env.CLOUDFLARE_API_BASE_URL || 'https://api.cloudflare.com/client/v4';
const accountId = String(process.env.CLOUDFLARE_ACCOUNT_ID || '').trim();
const apiToken = String(process.env.CLOUDFLARE_API_TOKEN || '').trim();
const projectName = process.env.MISSION_CONTROL_PROJECT_NAME || 'mission-control';
const databaseName = process.env.MISSION_CONTROL_DB_NAME || 'mission-control-db';
const compatibilityDate = process.env.MISSION_CONTROL_COMPATIBILITY_DATE || '2026-08-04';

if (!accountId || !apiToken) {
  console.error('CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID are required.');
  process.exit(1);
}

class CloudflareApiError extends Error {
  constructor(message, status, errors = []) {
    super(message);
    this.name = 'CloudflareApiError';
    this.status = status;
    this.errors = errors;
  }
}

function errorText(errors) {
  if (!Array.isArray(errors) || !errors.length) return '';
  return errors.map((item) => `${item.code ?? 'API'}: ${item.message ?? 'Unknown error'}`).join('; ');
}

async function api(path, options = {}) {
  const response = await fetch(`${API_ROOT}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiToken}`,
      'Content-Type': 'application/json',
      ...(options.headers || {})
    }
  });

  let payload;
  try {
    payload = await response.json();
  } catch {
    throw new CloudflareApiError(`Cloudflare returned non-JSON response (${response.status}).`, response.status);
  }

  if (!response.ok || payload.success === false) {
    const details = errorText(payload.errors);
    throw new CloudflareApiError(
      `Cloudflare API request failed (${response.status})${details ? `: ${details}` : ''}`,
      response.status,
      payload.errors || []
    );
  }

  return payload.result;
}

function isNotFound(error) {
  if (!(error instanceof CloudflareApiError)) return false;
  if (error.status === 404) return true;
  return error.errors.some((item) => [8000007, 10090].includes(Number(item.code)));
}

async function ensureDatabase() {
  const databases = await api(`/accounts/${accountId}/d1/database?per_page=100`);
  let database = Array.isArray(databases)
    ? databases.find((item) => item.name === databaseName)
    : null;

  if (!database) {
    database = await api(`/accounts/${accountId}/d1/database`, {
      method: 'POST',
      body: JSON.stringify({ name: databaseName })
    });
  }

  const databaseId = database?.uuid || database?.id;
  if (!databaseId) throw new Error(`D1 database ID was not returned for ${databaseName}.`);
  return { id: databaseId, name: databaseName };
}

async function getProject() {
  try {
    return await api(`/accounts/${accountId}/pages/projects/${encodeURIComponent(projectName)}`);
  } catch (error) {
    if (isNotFound(error)) return null;
    throw error;
  }
}

async function ensureProject() {
  let project = await getProject();
  if (!project) {
    project = await api(`/accounts/${accountId}/pages/projects`, {
      method: 'POST',
      body: JSON.stringify({ name: projectName, production_branch: 'main' })
    });
  } else if (project.production_branch !== 'main') {
    project = await api(`/accounts/${accountId}/pages/projects/${encodeURIComponent(projectName)}`, {
      method: 'PATCH',
      body: JSON.stringify({ production_branch: 'main' })
    });
  }
  return project;
}

function writeWrangler(database) {
  const config = {
    $schema: './node_modules/wrangler/config-schema.json',
    name: projectName,
    pages_build_output_dir: './public',
    compatibility_date: compatibilityDate,
    send_metrics: false,
    d1_databases: [
      {
        binding: 'DB',
        database_name: database.name,
        database_id: database.id,
        migrations_dir: './migrations'
      }
    ]
  };
  writeFileSync('wrangler.jsonc', `${JSON.stringify(config, null, 2)}\n`, 'utf8');
}

function projectUrl(project) {
  const candidates = [
    project?.canonical_deployment?.url,
    project?.latest_deployment?.url,
    project?.subdomain ? `https://${project.subdomain}` : '',
    `https://${projectName}.pages.dev`
  ];
  return candidates.find((value) => typeof value === 'string' && value.startsWith('http')) || '';
}

async function main() {
  const command = process.argv[2] || 'ensure';

  if (command === 'ensure') {
    const database = await ensureDatabase();
    const project = await ensureProject();
    writeWrangler(database);
    process.stdout.write(`${JSON.stringify({
      accountId,
      projectName,
      databaseName: database.name,
      databaseId: database.id,
      projectUrl: projectUrl(project)
    }, null, 2)}\n`);
    return;
  }

  if (command === 'project-url') {
    const project = await getProject();
    if (!project) throw new Error(`Pages project ${projectName} was not found.`);
    process.stdout.write(`${projectUrl(project)}\n`);
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
