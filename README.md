# TT Lifestyle: ttlifestyle.co.za

The website for **TT Lifestyle Pub & Restaurant (Tau Ya Tswako)** in Ga-Moretsele, Jane Furse, Limpopo.

It's a plain static site: HTML, CSS and a little JavaScript, with no build step. Any web host can serve it.

## Updating events (the main job)

TT runs on a rhythm of weekly and seasonal events, so the site is built around one file:

**`assets/js/events.js`**

- **`TT_EVENTS`**: dated events such as Spring Fest and Ama Pholas. Add one by copying the template at the bottom of the list.
  - Upcoming events show up automatically under **What's On**. The next one gets a countdown, ticket prices, a ticket button and an "Add to calendar" link.
  - Within 21 days of an event, an announcement bar appears at the top of every page.
  - The day after an event, it moves to **Past Highlights** by itself. Add `recap` and `gallery` photos to show it off.
  - When nothing is coming up, What's On shows a "next one is on its way" card with a WhatsApp notify button. It never looks empty.
- **`TT_WEEKLY`**: recurring days, e.g. *Street Stall Saturdays*. They show in the "next 7 days" strip. Days without an entry show "Kitchen & bar open".

Posters go in `assets/img/events/`. About 1000px wide WebP or JPG is ideal.

**Preview any date:** open `/?date=2026-12-10` to see the site as it will look that day.

## Seasons

The accent colour and the "Spring at TT" line change automatically with the South African seasons (Spring Sep–Nov, Summer Dec–Feb, Autumn Mar–May, Winter Jun–Aug). Edit the copy in `SEASONS` at the top of `assets/js/main.js`.

## Things to confirm or fill in

- **WhatsApp:** booking buttons open WhatsApp to 067 044 0678. If that number isn't on WhatsApp, change `whatsapp` in `assets/js/main.js`.
- **Social links:** add Facebook, Instagram and TikTok URLs to `socials` in `assets/js/main.js`. Empty ones stay hidden.
- **Opening times:** the site says "Open Monday – Sunday". Add actual hours when available, in `index.html` (Visit section and the JSON-LD in `<head>`).
- **Ticket links:** add `ticketUrl` (the exact Computicket page) to each new event.
- **Rating and guest count** (4.5★, 1,000+): these are hard-coded in `index.html`. Update them as they grow.

## Run locally

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploying to ttlifestyle.co.za

Any static host works. Two options:

- **Netlify / Cloudflare Pages (free):** connect this GitHub repo with no build command and `/` as the publish directory. Then add `ttlifestyle.co.za` as a custom domain and point the DNS records at the registrar as instructed.
- **GitHub Pages:** in repo Settings → Pages, deploy from the branch. `CNAME` already contains `ttlifestyle.co.za`.
- **cPanel / shared hosting** (common with .co.za registrars): upload the whole folder into `public_html`.

After going live, submit `https://ttlifestyle.co.za/sitemap.xml` in Google Search Console. Add the website URL to the Google Business Profile as well.

## Structure

```
index.html              single page: hero, What's On, spaces, food & drinks, highlights, gallery, reviews, visit
assets/js/events.js     ← events & weekly line-up (edit this)
assets/js/main.js       rendering, seasons, WhatsApp links, lightbox, event structured data
assets/css/styles.css   all styling
assets/img/             optimised WebP photos (events/, venue/, food/, brand/)
assets/fonts/           self-hosted Bebas Neue, Fraunces, Inter (SIL Open Font License)
```
