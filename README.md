# CRUIZR - Campus Wheels & Self-Drive Road Trips

> **Student-built prototype.** CRUIZR is a college project. Pricing, vehicle availability, insurance, support services, contact details and every other operational detail shown on the site are **for demonstration only**. Nothing here is a real rental, insurance product, legal agreement or emergency service.

**Live demo:** https://hibakw.github.io/cruizr-app/

CRUIZR imagines a self-drive car-sharing service for college students: browse a campus fleet, split the fare with friends, and list a car to earn from it.

## Features

- Campus / city hub selector that re-prices and re-filters the fleet
- Fleet browser with category, transmission, fuel and budget filters
- Split-fare calculator with a WhatsApp share message
- Host earnings estimator and "List Your Car" form
- Demo phone-OTP login (prototype only, test code shown on screen)
- FAQ, road-trip guides, Terms & Privacy and Help Center pages
- Keyboard-accessible modals (Escape to close, focus trap), skip link, visible focus styles
- Inline form validation with screen-reader-friendly errors

## Tech stack

| Layer | Choice |
| --- | --- |
| Markup / logic | Plain HTML + vanilla JavaScript (no build step) |
| Styling | Tailwind CSS (CDN) + `css/style.css` |
| Icons | Lucide (pinned version via unpkg) |
| Hosting | GitHub Pages |

## Project structure

```
index.html      Home: fleet, calculators, host section, FAQ
terms.html      Terms & Privacy (demo content)
help.html       Help Center + support ticket form
css/style.css   Custom styles, focus + reduced-motion rules
js/data.js      Mock fleet, hubs, reviews and trips
js/app.js       Main application logic
js/a11y.js      Modal keyboard handling, icon aria-hidden
js/forms.js     Form validation and error states
assets/         Favicon, share image (og-image.png), QR code
tests/          PowerShell smoke tests (links, math, host form)
```

## Run locally

No install needed. From the project folder:

```bash
python -m http.server 8000
# then open http://localhost:8000
```

(Opening `index.html` directly also works, but a local server matches how GitHub Pages serves the site.)

## Deploy (GitHub Pages)

1. Repo **Settings -> Pages**
2. **Source:** Deploy from a branch, branch `main`, folder `/ (root)`
3. Wait about a minute, then open https://hibakw.github.io/cruizr-app/

## Team

Sanhvi, Naavya, Surabhee, Hiba, Harshita

## Disclaimer

CRUIZR is a student-built prototype. Any names, numbers, addresses, insurance figures or regulatory statements are placeholders for demonstration and must not be relied on.
