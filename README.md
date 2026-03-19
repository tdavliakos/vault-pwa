# Vault PWA

Mobile companion for the Vault desktop app.  
Reads your encrypted `.vault` file directly from Google Drive.

## Security

- Decryption happens entirely in device memory
- Nothing is stored unencrypted on the device  
- Google Drive sees only the encrypted blob — never your passwords
- Auto-locks on inactivity or when app goes to background

## Setup

1. Open the app URL in Chrome on Android
2. Tap ⋮ → "Add to Home Screen"
3. Sign in with Google → enter your Master Password

## Requirements

- The same `.vault` file used by the desktop app
- The file must be accessible in your Google Drive
