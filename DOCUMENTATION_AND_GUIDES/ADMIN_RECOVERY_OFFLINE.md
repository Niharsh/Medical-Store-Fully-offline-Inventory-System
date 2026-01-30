Admin Recovery (Offline) — Overview

Purpose
- Allow shop owners to recover their account when email/Internet is not available by using an Admin Recovery Code stored locally on the machine.

High-level flow
1. Login → Forgot Password → Choose Recovery Method
2. Choose **Admin Code (Offline)** → Proceed to Admin Code Verification
3. Enter the locally-configured Admin Recovery Code
4. If verified, set a new password on the device (email + new password)
5. The new password is stored locally (hashed) so the user can sign in immediately
6. Redirect to Login and sign in with the new password

Important notes
- This flow is purely client-side and does **not** alter server-side credentials automatically.
- Local keys used:
  - `admin_recovery_code` — (string) set in Settings → Shop Details. Stored in `localStorage`.
  - `offline_passwords` — (object) mapping of lowercased email → { hash, updated_at }. Stored in `localStorage`.
  - `offline_session` — (object) holds the last offline logged-in email and timestamp. Stored in `localStorage`.

Behavior details
- Email reset remains unchanged and is used when the device has an internet connection.
- Admin Code verification happens locally by comparing the entered code against the value configured in Settings.
- After admin verification, the app shows a "Set New Password" screen where the admin provides the account's email and a new password.
- The password is hashed with SHA-256 in the browser and stored in `offline_passwords` so the account can be authenticated locally immediately.
- Login attempts:
  - Offline: the app checks `offline_passwords` for a matching email/hash and logs the user in locally.
  - Online: the app attempts server login first; if the server rejects credentials but an `offline_passwords` entry matches, it falls back to the local override and allows login immediately.

Security considerations
- The offline password hash is stored locally (device-level). Treat the device as trusted for offline recovery.
- Encourage admins to remove or rotate Admin Recovery Code when the device is no longer secure.

Where to configure
- Go to Settings → Shop Details → Admin Recovery Code (optional). Save to set the local admin code.

QA checklist
- Verify the Admin Code is saved in Settings and exists in `localStorage`.
- Verify selecting Admin Code recovery allows verifying the code without internet.
- Verify setting a new password stores a hashed entry in `offline_passwords` and redirects to Login.
- Verify login with the new password succeeds immediately (both offline and online when server rejects credentials).

Automated acceptance test
- Requirements:
  - Node.js >= 18
  - `npm install` (in `frontend`) to install dev dependencies (Playwright)
  - Frontend dev server running: `cd frontend && npm run dev`

- Run test:
  - `cd frontend && npm run test:admin-recovery`

- What the test does:
  - Seeds `localStorage.admin_recovery_code` with a test code
  - Walks the UI: Forgot Password → Choose Admin Code → Verify → Set New Password
  - Sets a local password override and attempts login
  - Exits with non-zero status on failure

Notes
- Playwright will download browser binaries on first install. If you are behind a proxy or air-gapped environment, run the test machine with network access once or install Playwright's browsers manually as needed.
