"""Build locally and check the container's public contract with read-only mounts."""
from pathlib import Path
import subprocess
import tempfile

ROOT = Path(__file__).parent.resolve()
isu = (ROOT / 'student-id.txt').read_text().strip()
assert len(isu) == 6 and isu.isdigit() and isu != '000000', 'Set your real ISU first.'
subprocess.run(['docker', 'build', '--platform', 'linux/amd64',
                '-t', 'itmo-fs-local', '.'], cwd=ROOT, check=True)

def check(directory, expected):
    """Check exact stdout, exit status, and absence of stderr."""
    result = subprocess.run([
        'docker', 'run', '--rm', '--network', 'none',
        '--mount', f'type=bind,source={directory},target=/data,readonly',
        'itmo-fs-local'], capture_output=True, text=True)
    assert result.returncode == 0, result.stderr
    assert result.stdout == f'{isu}-{expected}\n', result.stdout
    assert result.stderr == '', result.stderr

with tempfile.TemporaryDirectory(prefix='itmo-fs-check-') as temporary:
    data = Path(temporary)
    data.chmod(0o755)
    check(data, '0-0-0')
    (data / 'empty').mkdir()
    check(data, '0-1-0')
    (data / 'a.txt').write_bytes(b'a' * 100)
    (data / 'b.txt').write_bytes(b'b' * 500)
    (data / 'docs' / 'old').mkdir(parents=True)
    (data / 'docs' / 'c.txt').write_bytes(b'c' * 200)
    (data / 'docs' / 'old' / 'd.txt').write_bytes(b'd' * 50)
    check(data, '4-3-850')
    (data / 'zero size.txt').write_bytes(b'')
    check(data, '5-3-850')
print('Container contract passed: empty, directories, nested files, spaces, zero bytes.')
