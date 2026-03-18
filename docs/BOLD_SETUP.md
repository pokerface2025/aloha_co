# Bold Payments Setup (ALOHA)

This project is prepared for Bold payments. You only need to paste **4 keys** into **one file**: `.env.local`.

## Why 4 keys?
Bold gives you two environments:

- **TEST**: for safe testing (no real charges)
- **LIVE**: for real payments

Each environment has 2 keys:

- **Identity Key (public)**
- **Secret Key (private)**

That is why you have **4 keys total**.

## Where do I paste them?
Open `.env.local` and paste the keys in the labeled slots:

- `BOLD_TEST_IDENTITY_KEY`
- `BOLD_TEST_SECRET_KEY`
- `BOLD_LIVE_IDENTITY_KEY`
- `BOLD_LIVE_SECRET_KEY`
- `BOLD_CHECKOUT_URL` (Bold redirect checkout URL for TEST)

**Do NOT paste secret keys anywhere else.**  
Only `.env.local` should contain your keys.

## Start with TEST (recommended)
Set:

```
BOLD_ENV=TEST
```

This makes the app use only your **TEST** keys.

## Switch to LIVE (when ready)
When you are ready to charge real cards, switch **one line**:

```
BOLD_ENV=LIVE
```

That’s it. The app will automatically use your LIVE keys.

## Safety notes
- Secret keys are **server-only** and are never exposed to the browser.
- If keys are missing, the server will log a clear warning telling you exactly what to paste.
