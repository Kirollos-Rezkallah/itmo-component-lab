import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

/** Count regular files, nested directories, and bytes without following links. */
export async function analyze(directory) {
  const totals = { files: 0, directories: 0, size: 0 };
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      const child = await analyze(path);
      totals.files += child.files;
      totals.directories += child.directories + 1;
      totals.size += child.size;
    } else if (entry.isFile()) {
      totals.files++;
      totals.size += (await stat(path)).size;
    }
  }
  return totals;
}
