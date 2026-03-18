# Local Webhook Testing (ngrok)

Use this guide to test Bold webhooks locally.

## 1) Run ngrok
```
ngrok http 3000
```

Copy the public HTTPS URL (example):
```
https://xxxxx.ngrok-free.app
```

## 2) Set the public URL in `.env.local`
```
WEBHOOK_BASE_URL=https://xxxxx.ngrok-free.app
BOLD_CALLBACK_BASE_URL=https://xxxxx.ngrok-free.app
```

## 3) Paste webhook into Bold TEST dashboard
Use this exact URL:
```
https://xxxxx.ngrok-free.app/api/bold/webhook
```

## 4) Run a test purchase and verify
- Terminal shows webhook log received.
- `data/orders.json` updates to `paid`.
- Google Sheets row updates (CRM `payment_updated`).
- Confirmation email is sent (if SMTP env vars are set).
