import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { analyze } from './analyze.mjs';

test('filesystem contract: empty, files, nested empty directories, byte sizes, links', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'itmo-fs-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  assert.deepEqual(await analyze(root), { files: 0, directories: 0, size: 0 });
  await writeFile(join(root, 'with spaces.txt'), 'abc');
  await writeFile(join(root, 'zero'), '');
  assert.deepEqual(await analyze(root), { files: 2, directories: 0, size: 3 });
  await mkdir(join(root, 'docs', 'old'), { recursive: true });
  await mkdir(join(root, 'empty'));
  await writeFile(join(root, 'docs', 'old', 'unicode.txt'), 'я');
  assert.deepEqual(await analyze(root), { files: 3, directories: 3, size: 5 });
  if (process.platform !== 'win32') {
    await symlink(root, join(root, 'loop'));
    await symlink(join(root, 'zero'), join(root, 'file-link'));
    assert.deepEqual(await analyze(root), { files: 3, directories: 3, size: 5 });
  }
});
