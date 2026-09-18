# Running the Ensign preview on your Mac

## Start it
Open Terminal and paste this one line:

```
cd ~/Documents/GitHub/ensign/archway-rebuild/phase-3/pages && python3 -m http.server 8080
```

Then open **http://localhost:8080** in your browser.

Leave the Terminal window open. Closing it stops the server.

## Or double click
`start-preview.command` does the same thing and opens the browser for you.
The first time only, run this once in Terminal so macOS will let it run:

```
chmod +x ~/Documents/GitHub/ensign/archway-rebuild/phase-3/pages/start-preview.command
```

## Live editing
The page reloads itself when a file changes. You do not need to refresh.

- Tell Claude what to change.
- Claude edits the files in this folder.
- Your open tab reloads within about 2 seconds.

It only does this on localhost. On the real website it does nothing.

## Pages
- http://localhost:8080 goes to Home
- /ensign-services.html, /ensign-about.html, /ensign-refer.html, /ensign-contact.html, /ensign-privacy.html, /ensign-404.html
- /ensign-admin.html, demo password `ensign-demo`

## Notes
- `dev-version.txt` is the reload trigger. Do not delete it.
- `index.html` just redirects to Home.
- The reload script and these two files are stripped in Phase 4.
