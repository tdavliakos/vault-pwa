# Vault PWA

Secure mobile viewer for your `.vault` password file.

## Features
- 🔐 AES-256 decryption (same as desktop vault.py)
- ☁️ Reads encrypted `.vault` directly from Google Drive
- 📱 Works as native app (Add to Home Screen)
- 🔒 Auto-lock after 5 minutes
- ✈️ Offline support (cached encrypted file)
- 👆 Biometric unlock (fingerprint/Face ID)

## Setup
1. Open `https://tdavliakos.github.io/vault-pwa/` in Chrome on Android
2. Tap ⋮ → "Add to Home Screen"
3. Sign in with Google → enter Master Password

## Security
- Google Drive sees only the encrypted blob — never your passwords
- Decryption happens only in device memory
- Nothing is stored unencrypted on the device
- Auto-locks on inactivity or when app goes to background
