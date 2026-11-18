# Filesystem component

ITMO lab for ISU 340116. Reads `/data` recursively and prints exactly `340116-FILES-DIRECTORIES-SIZE`. Counts regular files, nested directories excluding `/data`, and total file bytes. Symbolic links are ignored.

```sh
node --test analyze.test.mjs
python3 verify_container.py
docker run --rm --network none --mount type=bind,source=/absolute/input,target=/data,readonly ghcr.io/kirollos-rezkallah/itmo-component-lab:340116
```

The GitHub Actions workflow tests on Linux, verifies the container contract, and publishes the checked image. The container needs no arguments, environment variables or network access.
