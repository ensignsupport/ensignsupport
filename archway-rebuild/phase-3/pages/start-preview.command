#!/bin/bash
# Double click this to open the Ensign preview in your browser.
# If double clicking does nothing, run this once in Terminal:
#   chmod +x "$HOME/Documents/GitHub/ensign/archway-rebuild/phase-3/pages/start-preview.command"
cd "$(dirname "$0")" || exit 1
echo "Ensign preview running at http://localhost:8080"
echo "Leave this window open. Close it to stop."
( sleep 1; open "http://localhost:8080" ) &
python3 -m http.server 8080
