import { readFileSync, existsSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const buildDir = 'build';
const serverDir = path.join(buildDir, 'server');
const legacyManifestPath = path.join(serverDir, 'manifest.js');
const indexPath = path.join(buildDir, 'index.js');
const chunksDir = path.join(serverDir, 'chunks');

function verifyLegacyLayout() {
	const manifest = readFileSync(legacyManifestPath, 'utf8');
	const chunks = [...manifest.matchAll(/import\(['"]\.\/chunks\/([^'"]+)['"]\)/g)].map(
		(match) => match[1]
	);

	const missing = chunks.filter((chunk) => !existsSync(path.join(chunksDir, chunk)));

	if (missing.length > 0) {
		console.error(`Missing ${missing.length} server chunk(s):`, missing.slice(0, 10));
		process.exit(1);
	}

	console.log(`Legacy adapter layout OK — ${chunks.length} server chunks present`);
}

function verifyBundledLayout() {
	if (!existsSync(indexPath)) {
		console.error('Missing build/index.js');
		process.exit(1);
	}

	if (!existsSync(chunksDir)) {
		console.error('Missing build/server/chunks/');
		process.exit(1);
	}

	const chunkFiles = readdirSync(chunksDir).filter((file) => file.endsWith('.js'));
	if (chunkFiles.length === 0) {
		console.error('build/server/chunks/ is empty');
		process.exit(1);
	}

	const manifestFile = chunkFiles.find((file) => file.startsWith('manifest.js-'));
	if (!manifestFile) {
		console.error('Missing bundled manifest chunk (manifest.js-*.js)');
		process.exit(1);
	}

	const manifestSource = readFileSync(path.join(chunksDir, manifestFile), 'utf8');
	const referenced = [
		...manifestSource.matchAll(/import\s*\(?\s*['"]\.\/([^'"]+)['"]/g)
	].map((match) => match[1]);

	const missing = referenced.filter((chunk) => !existsSync(path.join(chunksDir, chunk)));

	if (missing.length > 0) {
		console.error(`Missing ${missing.length} server chunk(s) referenced by ${manifestFile}:`, missing);
		process.exit(1);
	}

	console.log(
		`Bundled adapter layout OK — index.js + ${chunkFiles.length} server chunks (${referenced.length} manifest refs verified)`
	);
}

writeFileSync(
	path.join(buildDir, 'package.json'),
	`${JSON.stringify({ type: 'module' }, null, 2)}\n`
);
console.log('Wrote build/package.json (type: module) for Node ESM runtime');

if (existsSync(legacyManifestPath)) {
	verifyLegacyLayout();
} else {
	verifyBundledLayout();
}
