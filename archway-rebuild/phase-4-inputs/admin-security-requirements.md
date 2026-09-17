# Admin page and lead storage: Phase 4 build requirements

From the Phase 3 admin page blind review, 17 Sep 2026. The admin page shows health information and documents, so these are must-haves, not nice-to-haves.

1. **Password and session:** check the password on the server, in constant time, against ADMIN_PASSWORD (Netlify environment variable, a long passphrase). Signed session cookie: HttpOnly, Secure, SameSite=Strict, rotated at login. 15 minute idle limit, 8 hour absolute limit. Sign out ends the session on the server. Optional: TOTP second factor.
2. **Rate limiting:** limit failed logins per IP and in total (for example 5 per 15 minutes, then lock out) and email Andrew when it triggers.
3. **Documents:** private storage only, never public URLs. Serve through an auth-checked route or signed links that expire within 60 seconds, with Content-Disposition: attachment. Check file type and size on the server. Never attach documents to emails.
4. **Caching and indexing:** Cache-Control: no-store on every admin page and API response. X-Robots-Tag: noindex, nofollow. Not in the sitemap or robots allow list. Referrer-Policy: no-referrer.
5. **Data handling:** auth enforced on every admin API route, not just the page. Escape all submitted text when displaying it. Encrypt storage at rest. Agree a retention and delete policy with Andrew (privacy policy says 7 years after services end). Keep an access log. Strict Content Security Policy. Never write lead contents to logs.
6. **Emails:** Resend emails to Andrew and to referrers contain no health details or documents, only a reference number and a link to the admin page.
