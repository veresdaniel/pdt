#!/usr/bin/env node
/**
 * Keeps pnpm allowBuilds in sync for @ergodot/ui-kit git dependency.
 * pnpm requires the exact resolved commit hash in allowBuilds for git-hosted packages.
 *
 * Usage:
 *   node scripts/sync-ui-kit-allow-builds.mjs --from-lockfile   (default, for pnpm install)
 *   node scripts/sync-ui-kit-allow-builds.mjs --from-remote     (before pnpm update @ergodot/ui-kit)
 */
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const lockPath = join(root, 'pnpm-lock.yaml');
const workspacePath = join(root, 'pnpm-workspace.yaml');
const repo = 'veresdaniel/ergodot-ui-kit';
const branch = 'main';

/** @param {string} hash */
function allowBuildKeys(hash) {
	return [
		`'@ergodot/ui-kit@git+https://github.com/${repo}.git#${hash}'`,
		`'@ergodot/ui-kit@git+ssh://git@github.com/${repo}.git#${hash}'`,
	];
}

/** @returns {string | null} */
function hashFromLockfile() {
	let lock;
	try {
		lock = readFileSync(lockPath, 'utf8');
	} catch {
		return null;
	}

	const match = lock.match(
		new RegExp(`@ergodot/ui-kit@git\\+(?:https|ssh)://[^\\s]+#([0-9a-f]{40})`, 'i'),
	);
	return match?.[1] ?? null;
}

/** @returns {string} */
function hashFromRemote() {
	const url = `https://github.com/${repo}.git`;
	const out = execFileSync('git', ['ls-remote', url, `refs/heads/${branch}`], {
		encoding: 'utf8',
	});
	const hash = out.trim().split(/\s+/)[0];
	if (!/^[0-9a-f]{40}$/i.test(hash)) {
		throw new Error(`Could not resolve latest ${branch} commit for ${repo}`);
	}
	return hash;
}

/** @param {string} hash */
function patchWorkspaceYaml(hash) {
	const keys = allowBuildKeys(hash);
	let yaml = readFileSync(workspacePath, 'utf8');

	for (const key of keys) {
		const line = `  ${key}: true`;
		const pattern = new RegExp(
			`^  ${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}: (?:true|false)\\s*$`,
			'm',
		);
		if (pattern.test(yaml)) continue;

		if (/^allowBuilds:\s*$/m.test(yaml)) {
			yaml = yaml.replace(/^allowBuilds:\s*$/m, `allowBuilds:\n${line}`);
		} else {
			throw new Error('pnpm-workspace.yaml: expected allowBuilds: block');
		}
	}

	yaml = yaml.replace(
		/^  '@ergodot\/ui-kit@git\+(?:https|ssh):\/\/[^']+':[^\n]*\n/gm,
		'',
	);
	for (const key of keys) {
		const line = `  ${key}: true\n`;
		if (!yaml.includes(line)) {
			yaml = yaml.replace(/^allowBuilds:\s*\n/m, `allowBuilds:\n${line}`);
		}
	}

	writeFileSync(workspacePath, yaml);
	console.log(`sync-ui-kit-allow-builds: allowBuilds -> ${hash.slice(0, 7)}`);
}

const fromRemote = process.argv.includes('--from-remote');
const hash = fromRemote ? hashFromRemote() : (hashFromLockfile() ?? hashFromRemote());

if (!hash) {
	console.warn('sync-ui-kit-allow-builds: no ui-kit hash found, skipping');
	process.exit(0);
}

patchWorkspaceYaml(hash);
