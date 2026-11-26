/**
 * Website live kora (Vercel e) — ek command e:   npm run deploy
 *
 *  1. Database e notun column thakle jog kore (prisma db push)
 *  2. Vercel e login na thakle login link dekhay
 *  3. Vercel project banay / link kore (naam: rongerbari-henna)
 *  4. .env theke dorkari setting gula Vercel e boshay (password, database, Cloudinary)
 *  5. Live deploy kore, website er link dekhay
 */
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { join } from 'node:path';

const ROOT = process.cwd();
const isWin = process.platform === 'win32';
const PROJECT = 'rongerbari-henna';
const VERCEL = ['--yes', 'vercel@latest'];

const c = {
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
};
const step = (s) => console.log(`\n${c.green('●')} ${c.bold(s)}`);
const fail = (s) => {
  console.error(`\n${c.red('✖')} ${s}\n  Upore je lekha ta ashche seta copy kore Claude ke pathao.\n`);
  process.exit(1);
};
const vercel = (args, opts = {}) =>
  spawnSync('npx', [...VERCEL, ...args], { cwd: ROOT, shell: isWin, stdio: opts.input !== undefined ? ['pipe', 'inherit', 'inherit'] : 'inherit', input: opts.input });
const vercelQuiet = (args) => spawnSync('npx', [...VERCEL, ...args], { cwd: ROOT, shell: isWin, stdio: 'pipe', encoding: 'utf8' });

// ---------- .env ----------
const ENV = join(ROOT, '.env');
if (!existsSync(ENV)) fail('.env file nai. Age `npm run dev` diye setup koro.');
const env = {};
for (const line of readFileSync(ENV, 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}
if (!env.DATABASE_URL) fail('.env e DATABASE_URL nai.');

// ---------- 1. Database ----------
step('Database check (notun column thakle jog hobe)...');
const push = spawnSync('npx', ['prisma', 'db', 'push', '--skip-generate'], { cwd: ROOT, shell: isWin, stdio: 'inherit' });
if (push.status !== 0) fail('Database e connect kora jay ni.');

// ---------- 2. Login ----------
step('Vercel account check...');
const who = vercelQuiet(['whoami']);
if (who.status !== 0) {
  console.log(c.yellow('  Vercel e login korte hobe. Niche je link ashbe seta browser e khule login/confirm koro.'));
  if (vercel(['login']).status !== 0) fail('Vercel login hoy ni.');
} else {
  console.log(`  Login ache: ${c.bold(who.stdout.trim().split('\n').pop())}`);
}

// ---------- 3. Project ----------
step(`Vercel project "${PROJECT}" toiri/link hocche...`);
if (vercel(['link', '--yes', '--project', PROJECT]).status !== 0) fail('Vercel project link hoy ni.');

// ---------- 4. Env ----------
step('Setting gula (database, password, Cloudinary) Vercel e boshano hocche...');
const KEYS = [
  'DATABASE_URL',
  'DIRECT_URL',
  'JWT_SECRET',
  'ADMIN_EMAIL',
  'ADMIN_PASSWORD',
  'CLOUDINARY_URL',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'CLOUDINARY_FOLDER',
];
// Live domain thakle (localhost na hole) seta o
if (env.NEXT_PUBLIC_SITE_URL && !/localhost|127\.0\.0\.1/.test(env.NEXT_PUBLIC_SITE_URL)) KEYS.push('NEXT_PUBLIC_SITE_URL');

for (const key of KEYS) {
  const value = env[key];
  if (!value) continue;
  vercelQuiet(['env', 'rm', key, 'production', '--yes']); // purono thakle muche
  const r = vercel(['env', 'add', key, 'production'], { input: value });
  if (r.status !== 0) fail(`${key} Vercel e boshano jay ni.`);
  console.log(`  ✔ ${key}`);
}

// ---------- 5. Deploy ----------
step('Website live hocche (2-4 minute lagte pare)...');
const dep = spawnSync('npx', [...VERCEL, 'deploy', '--prod', '--yes'], { cwd: ROOT, shell: isWin, stdio: ['inherit', 'pipe', 'inherit'], encoding: 'utf8' });
process.stdout.write(dep.stdout || '');
if (dep.status !== 0) fail('Deploy hoy ni.');
const url = (dep.stdout || '').match(/https:\/\/[^\s]+\.vercel\.app/g)?.pop();

console.log(`
${c.green('✔ Website live!')}
  Website er asol link Vercel dashboard e (Domains) — sadharonoto: ${c.bold(`https://${PROJECT}.vercel.app`)}
  ${url ? `Ei deploy: ${url}` : ''}
  Admin: <link>/admin

  Pore kichu bodlale abar shudhu:  npm run deploy
`);
