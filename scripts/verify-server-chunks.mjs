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

	const hasManifestChunk = chunkFiles.some((file) => file.startsWith('manifest.js-'));
	if (!hasManifestChunk) {
		console.error('Missing bundled manifest chunk (manifest.js-*.js)');
		process.exit(1);
	}

	console.log(`Bundled adapter layout OK — index.js + ${chunkFiles.length} server chunks`);
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
