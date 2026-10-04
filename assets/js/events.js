/*
 * TT Lifestyle — events & weekly line-up
 * ======================================
 * This is the ONLY file you need to edit to keep "What's On" fresh.
 *
 * - Add a new event to TT_EVENTS. The site sorts everything by date:
 *   upcoming events show under "What's On", finished ones move to
 *   "Past Highlights" automatically the day after they happen.
 * - Drop the poster into assets/img/events/ (WebP or JPG, ~1000px wide).
 * - Dates are YYYY-MM-DD. Times are 24h "HH:MM" (optional).
 * - Leave a field out (or set it to null) if you don't know it yet.
 */

window.TT_EVENTS = [
  {
    id: "spring-fest-2026",
    title: "TT Lifestyle Spring Fest",
    tagline: "It's officially show day. This is your season.",
    date: "2026-09-26",
    startTime: null,
    poster: "assets/img/events/spring-fest-2026-lineup.webp",
    gallery: [
      "assets/img/events/spring-fest-2026-showday.webp",
      "assets/img/events/spring-fest-2026-thanks.webp",
      "assets/img/venue/sunsets-stage.webp",
      "assets/img/venue/corona-swing.webp"
    ],
    lineup: ["Tribby Wa Di Bhoza"],
    tickets: [
      { label: "Phase 1", price: 250, note: "Limited" },
      { label: "At the gate", price: 300, note: "Limited" }
    ],
    ticketVendor: "Computicket",
    age: "18+",
    season: "spring",
    recap: "A full stage, the Corona Sunsets garden and Jane Furse out in full force. Rea leboga to everyone who pulled through."
  },
  {
    id: "ama-pholas-2026-08",
    title: "Ama Pholas",
    tagline: "Cold ones, good sounds, Sunday done right.",
    date: "2026-08-02",
    startTime: null,
    poster: "assets/img/events/ama-pholas-2026-08.webp",
    lineup: ["Kenny DJ"],
    tickets: [],
    age: "18+",
    season: "winter"
  }

  /* Template — copy, paste above and fill in:
  ,{
    id: "event-slug-yyyy-mm",
    title: "Event Name",
    tagline: "One punchy line.",
    date: "2026-12-16",
    startTime: "12:00",
    endTime: "23:00",
    poster: "assets/img/events/your-poster.webp",
    lineup: ["Headliner", "Support DJ"],
    tickets: [{ label: "Early bird", price: 150, note: "Limited" }],
    ticketUrl: "https://www.computicket.com/...",
    ticketVendor: "Computicket",
    age: "18+",
    season: "summer"
  }
  */
];

/*
 * The weekly rhythm. day: 0 = Sunday, 1 = Monday ... 6 = Saturday.
 * Days without an entry simply show "Kitchen & bar open".
 */
window.TT_WEEKLY = [
  {
    day: 6,
    title: "Street Stall Saturdays",
    blurb: "Local vendors, fresh produce and artisan goods — browse the stalls, then stay for lunch.",
    time: null
  }
  /* e.g.
  ,{ day: 0, title: "Sunday Sessions", blurb: "Lunch, lounge and a DJ till late.", time: "12:00 – late" }
  */
];
