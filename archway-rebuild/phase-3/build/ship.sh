#!/bin/bash
# Build and stage under a UNIQUE filename each time. Re-using the same staged
# path makes device_commit_files send a stale copy (found 18 Sep 2026).
set -e
cd /tmp/claude-0/p3/comp
ARR=${ARR:-B} bash rebuild_all.sh >/dev/null
python3 build_admin.py >/dev/null
python3 add_dev.py ensign-admin.html >/dev/null
V=$(cat dev-version.txt)
mkdir -p /mnt/user-data/outputs/ship
rm -f /mnt/user-data/outputs/ship/*
for f in ensign-home ensign-services ensign-about ensign-refer ensign-contact ensign-404 ensign-privacy ensign-admin; do
  cp $f.html /mnt/user-data/outputs/ship/$f.$V.html
done
cp dev-version.txt /mnt/user-data/outputs/ship/dev-version.$V.txt
echo "STAGE_V=$V"
