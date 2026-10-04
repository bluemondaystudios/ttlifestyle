/* TT Lifestyle — site behaviour. Event content lives in events.js. */
(function () {
  "use strict";

  var SITE = {
    phone: "+27670440678",
    whatsapp: "27670440678",
    timeZone: "Africa/Johannesburg",
    url: "https://ttlifestyle.co.za/",
    // Add profile URLs when ready; empty ones are hidden.
    socials: {
      Facebook: "",
      Instagram: "",
      TikTok: ""
    }
  };

  var EVENTS = (window.TT_EVENTS || []).slice();
  var WEEKLY = window.TT_WEEKLY || [];

  // Southern-hemisphere seasons drive the accent colour and copy.
  var SEASONS = {
    spring: { name: "Spring", months: [8, 9, 10], line: "Spring is here: longer days, garden sessions and festival season at TT." },
    summer: { name: "Summer", months: [11, 0, 1], line: "Summer at TT: festive weekends, cold drinks and sunsets on the grass." },
    autumn: { name: "Autumn", months: [2, 3, 4], line: "Autumn at TT: golden afternoons and long lunches in the lounge." },
    winter: { name: "Winter", months: [5, 6, 7], line: "Winter at TT: warm plates, the indoor lounge and Sunday sessions." }
  };

  var DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // Today's date in South Africa as YYYY-MM-DD, regardless of the visitor's clock zone.
  function todayISO() {
    try {
      return new Intl.DateTimeFormat("en-CA", { timeZone: SITE.timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
    } catch (e) {
      var d = new Date();
      return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
    }
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  // Parse YYYY-MM-DD as a calendar date (UTC noon avoids DST/zone edge cases).
  function parseISO(s) { var p = s.split("-"); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2], 12)); }
  function toISO(d) { return d.getUTCFullYear() + "-" + pad(d.getUTCMonth() + 1) + "-" + pad(d.getUTCDate()); }
  function addDays(d, n) { return new Date(d.getTime() + n * 864e5); }
  function daysBetween(a, b) { return Math.round((parseISO(b) - parseISO(a)) / 864e5); }

  function fmtDate(iso, opts) {
    var d = parseISO(iso);
    var s = DAYS[d.getUTCDay()].slice(0, 3) + " " + d.getUTCDate() + " " + MONTHS[d.getUTCMonth()];
    if (opts && opts.year) s += " " + d.getUTCFullYear();
    return s;
  }

  function waLink(message) {
    return "https://wa.me/" + SITE.whatsapp + (message ? "?text=" + encodeURIComponent(message) : "");
  }

  // Preview how the site looks on another day: add ?date=2026-09-20 to the URL.
  var forced = (location.search.match(/[?&]date=(\d{4}-\d{2}-\d{2})/) || [])[1];
  var today = forced || todayISO();
  var upcoming = EVENTS.filter(function (e) { return e.date >= today; })
    .sort(function (a, b) { return a.date < b.date ? -1 : 1; });
  var past = EVENTS.filter(function (e) { return e.date < today; })
    .sort(function (a, b) { return a.date < b.date ? 1 : -1; });

  /* ---------- Season ---------- */
  function currentSeason() {
    var m = parseISO(today).getUTCMonth();
    for (var k in SEASONS) if (SEASONS[k].months.indexOf(m) > -1) return k;
    return "spring";
  }
  var season = currentSeason();
  document.documentElement.setAttribute("data-season", season);
  $("#season-name").textContent = SEASONS[season].name;
  $("#season-line").textContent = SEASONS[season].line;

  /* ---------- WhatsApp links with prefilled messages ---------- */
  $all("[data-whatsapp]").forEach(function (a) {
    a.href = waLink(a.getAttribute("data-message") || "Hi TT Lifestyle, I'd like to book a table.");
    a.target = "_blank";
    a.rel = "noopener";
  });

  /* ---------- Announcement bar ---------- */
  (function () {
    var next = upcoming[0];
    if (!next) return;
    var n = daysBetween(today, next.date);
    if (n > 21) return;
    var when = n === 0 ? "Today" : n === 1 ? "Tomorrow" : fmtDate(next.date);
    var bar = $("#announce");
    bar.innerHTML = '<div class="wrap"><span class="announce-tag">' + esc(when) + "</span> " +
      esc(next.title) + (next.lineup && next.lineup.length ? " feat. " + esc(next.lineup.join(", ")) : "") +
      ' <a href="#event-' + esc(next.id) + '">Details →</a></div>';
    bar.hidden = false;
  })();

  /* ---------- Upcoming events ---------- */
  function ticketsHTML(e) {
    if (!e.tickets || !e.tickets.length) return "";
    return '<ul class="tickets">' + e.tickets.map(function (t) {
      return "<li><span>" + esc(t.label) + "</span><strong>R" + esc(t.price) + "</strong>" +
        (t.note ? "<em>" + esc(t.note) + "</em>" : "") + "</li>";
    }).join("") + "</ul>";
  }

  function calendarLink(e) {
    var start = e.date.replace(/-/g, "");
    var end = toISO(addDays(parseISO(e.date), 1)).replace(/-/g, "");
    var dates = start + "/" + end;
    if (e.startTime) {
      var st = start + "T" + e.startTime.replace(":", "") + "00";
      var et = e.endTime ? start + "T" + e.endTime.replace(":", "") + "00" : st;
      dates = st + "/" + et;
    }
    return "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      "&text=" + encodeURIComponent(e.title + " @ TT Lifestyle") +
      "&dates=" + dates + "&ctz=" + encodeURIComponent(SITE.timeZone) +
      "&location=" + encodeURIComponent("TT Lifestyle, 872 Ga-Moretsele, Jane Furse") +
      "&details=" + encodeURIComponent((e.tagline || "") + "\n" + SITE.url);
  }

  function countdown(e) {
    var n = daysBetween(today, e.date);
    if (n === 0) return "It's today!";
    if (n === 1) return "Tomorrow";
    return n + " days to go";
  }

  function featuredHTML(e) {
    var time = e.startTime ? " · " + esc(e.startTime) + (e.endTime ? " – " + esc(e.endTime) : "") : "";
    var buy = e.ticketUrl
      ? '<a class="btn btn-mustard" href="' + esc(e.ticketUrl) + '" target="_blank" rel="noopener">Get tickets' + (e.ticketVendor ? " on " + esc(e.ticketVendor) : "") + "</a>"
      : '<a class="btn btn-mustard" href="' + esc(waLink("Hi TT Lifestyle, I'd like to know more about " + e.title + " on " + fmtDate(e.date, { year: true }) + ".")) + '" target="_blank" rel="noopener">Ask about this event</a>';
    return '<article class="feature" id="event-' + esc(e.id) + '">' +
      '<button class="feature-poster" data-full="' + esc(e.poster) + '"><img src="' + esc(e.poster) + '" alt="' + esc(e.title) + ' poster" width="900" height="1200"></button>' +
      '<div class="feature-body">' +
        '<p class="countdown">' + countdown(e) + "</p>" +
        "<h3>" + esc(e.title) + "</h3>" +
        (e.tagline ? '<p class="tagline">' + esc(e.tagline) + "</p>" : "") +
        '<p class="meta"><span>' + fmtDate(e.date, { year: true }) + time + "</span>" +
          (e.age ? '<span class="age">' + esc(e.age) + "</span>" : "") + "</p>" +
        (e.lineup && e.lineup.length ? '<p class="lineup"><small>Featuring</small>' + e.lineup.map(esc).join("<br>") + "</p>" : "") +
        ticketsHTML(e) +
        '<div class="hero-cta">' + buy +
          '<a class="btn btn-outline-light" href="' + esc(calendarLink(e)) + '" target="_blank" rel="noopener">Add to calendar</a></div>' +
      "</div></article>";
  }

  function miniHTML(e) {
    return '<article class="mini" id="event-' + esc(e.id) + '">' +
      '<button class="mini-poster" data-full="' + esc(e.poster) + '"><img src="' + esc(e.poster) + '" alt="' + esc(e.title) + ' poster" loading="lazy" width="300" height="400"></button>' +
      '<div><p class="mini-date">' + fmtDate(e.date) + "</p><h4>" + esc(e.title) + "</h4>" +
      (e.lineup && e.lineup.length ? "<p>feat. " + e.lineup.map(esc).join(", ") + "</p>" : "") + "</div></article>";
  }

  (function () {
    var box = $("#upcoming");
    if (upcoming.length) {
      box.innerHTML = featuredHTML(upcoming[0]) +
        (upcoming.length > 1 ? '<h3 class="h3">Also coming up</h3><div class="mini-list">' + upcoming.slice(1).map(miniHTML).join("") + "</div>" : "");
      return;
    }
    var last = past[0];
    box.innerHTML = '<div class="empty">' +
      '<div class="empty-copy"><p class="countdown">Next date loading…</p>' +
      "<h3>The next big one is on its way.</h3>" +
      "<p>We drop a new event every season. Message us and we'll let you know as soon as the next poster lands. Until then, the lounge, garden and kitchen are open every day.</p>" +
      '<div class="hero-cta"><a class="btn btn-mustard" href="' + esc(waLink("Hi TT Lifestyle, please let me know about your next event.")) + '" target="_blank" rel="noopener">Notify me on WhatsApp</a>' +
      (last ? '<a class="btn btn-outline-light" href="#past">See ' + esc(last.title) + " recap</a>" : "") + "</div></div>" +
      (last ? '<button class="empty-poster" data-full="' + esc(last.poster) + '"><img src="' + esc(last.poster) + '" alt="' + esc(last.title) + ' poster" width="900" height="1200"><span>Last up: ' + esc(last.title) + "</span></button>" : "") +
      "</div>";
  })();

  /* ---------- Next 7 days strip ---------- */
  (function () {
    var list = $("#week");
    var start = parseISO(today);
    var html = "";
    for (var i = 0; i < 7; i++) {
      var d = addDays(start, i);
      var iso = toISO(d);
      var dow = d.getUTCDay();
      var ev = EVENTS.filter(function (e) { return e.date === iso; })[0];
      var wk = WEEKLY.filter(function (w) { return w.day === dow; })[0];
      var cls = "day" + (i === 0 ? " is-today" : "") + (ev ? " has-event" : wk ? " has-weekly" : "");
      var title = ev ? ev.title : wk ? wk.title : "Kitchen & bar open";
      var blurb = ev ? (ev.lineup && ev.lineup.length ? "feat. " + ev.lineup.join(", ") : ev.tagline || "") : wk ? wk.blurb + (wk.time ? " " + wk.time : "") : "Lounge, garden & full menu.";
      html += '<li class="' + cls + '">' +
        '<p class="day-name">' + (i === 0 ? "Today" : DAYS[dow].slice(0, 3)) + ' <span>' + d.getUTCDate() + " " + MONTHS[d.getUTCMonth()] + "</span></p>" +
        '<p class="day-title">' + esc(title) + "</p>" +
        '<p class="day-blurb">' + esc(blurb) + "</p>" +
        (ev ? '<a class="day-link" href="#event-' + esc(ev.id) + '">Event details</a>' : "") +
        "</li>";
    }
    list.innerHTML = html;
  })();

  /* ---------- Past highlights ---------- */
  (function () {
    var box = $("#past-events");
    if (!past.length) { $("#past").hidden = true; return; }
    box.innerHTML = past.map(function (e, i) {
      var extra = (e.gallery || []).slice(0, 4).map(function (src) {
        return '<button class="thumb" data-full="' + esc(src) + '"><img src="' + esc(src) + '" alt="' + esc(e.title) + ' photo" loading="lazy" width="200" height="260"></button>';
      }).join("");
      return '<article class="past-card' + (i === 0 ? " is-latest" : "") + '" id="event-' + esc(e.id) + '">' +
        '<button class="past-poster" data-full="' + esc(e.poster) + '"><img src="' + esc(e.poster) + '" alt="' + esc(e.title) + ' poster" loading="lazy" width="900" height="1200"></button>' +
        '<div class="past-body"><p class="mini-date">' + fmtDate(e.date, { year: true }) + "</p>" +
        "<h3>" + esc(e.title) + "</h3>" +
        (e.lineup && e.lineup.length ? '<p class="past-lineup">feat. ' + e.lineup.map(esc).join(", ") + "</p>" : "") +
        (e.recap ? "<p>" + esc(e.recap) + "</p>" : e.tagline ? "<p>" + esc(e.tagline) + "</p>" : "") +
        (extra ? '<div class="thumbs">' + extra + "</div>" : "") +
        "</div></article>";
    }).join("");
  })();

  /* ---------- Structured data for upcoming events (Google rich results) ---------- */
  (function () {
    if (!upcoming.length) return;
    var data = upcoming.map(function (e) {
      var ev = {
        "@context": "https://schema.org",
        "@type": "Event",
        name: e.title,
        startDate: e.date + (e.startTime ? "T" + e.startTime + ":00+02:00" : ""),
        eventStatus: "https://schema.org/EventScheduled",
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        image: [new URL(e.poster, SITE.url).href],
        description: e.tagline || e.title,
        location: { "@id": SITE.url + "#venue", "@type": "Place", name: "TT Lifestyle Pub & Restaurant",
          address: { "@type": "PostalAddress", streetAddress: "872 Ga-Moretsele", addressLocality: "Jane Furse", addressRegion: "Limpopo", addressCountry: "ZA" } },
        organizer: { "@type": "Organization", name: "TT Lifestyle", url: SITE.url }
      };
      if (e.endTime) ev.endDate = e.date + "T" + e.endTime + ":00+02:00";
      if (e.lineup && e.lineup.length) ev.performer = e.lineup.map(function (n) { return { "@type": "PerformingGroup", name: n }; });
      if (e.tickets && e.tickets.length) ev.offers = e.tickets.map(function (t) {
        return { "@type": "Offer", name: t.label, price: t.price, priceCurrency: "ZAR", url: e.ticketUrl || SITE.url, availability: "https://schema.org/InStock" };
      });
      return ev;
    });
    var s = document.createElement("script");
    s.type = "application/ld+json";
    s.textContent = JSON.stringify(data);
    document.head.appendChild(s);
  })();

  /* ---------- Opening line, socials, year ---------- */
  $("#open-today").textContent = "Open today, " + DAYS[parseISO(today).getUTCDay()];
  $("#year").textContent = today.slice(0, 4);
  (function () {
    var ul = $("#socials");
    var items = Object.keys(SITE.socials).filter(function (k) { return SITE.socials[k]; });
    if (!items.length) { ul.hidden = true; return; }
    ul.innerHTML = items.map(function (k) {
      return '<li><a href="' + esc(SITE.socials[k]) + '" target="_blank" rel="noopener">' + esc(k) + "</a></li>";
    }).join("");
  })();

  /* ---------- Mobile nav ---------- */
  var toggle = $(".nav-toggle");
  var nav = $("#site-nav");
  toggle.addEventListener("click", function () {
    var open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("is-open", !open);
  });
  nav.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { toggle.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); }
  });

  var header = $(".site-header");
  function onScroll() { header.classList.toggle("is-scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Lightbox ---------- */
  var box = $("#lightbox");
  var boxImg = $("#lightbox-img");
  document.addEventListener("click", function (e) {
    var trigger = e.target.closest && e.target.closest("[data-full]");
    if (!trigger) return;
    if (!box.showModal) { window.open(trigger.getAttribute("data-full"), "_blank"); return; }
    var img = trigger.querySelector("img");
    boxImg.src = trigger.getAttribute("data-full");
    boxImg.alt = img ? img.alt : "";
    box.showModal();
  });
  box.addEventListener("click", function (e) { if (e.target === box) box.close(); });
})();
