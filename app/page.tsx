"use client";

import { useEffect, useMemo, useState } from "react";

type Conference = {
  id: string;
  short: string;
  year: number;
  name: string;
  deadline?: string;
  notification?: string;
  estimated?: boolean;
  timezone: string;
  dateLabel: string;
  location: string;
  topics: string[];
  rank: "A*" | "A" | "B" | "C" | "Unranked";
  round?: string;
  note: string;
  url: string;
  dblp: string;
};

const conferences: Conference[] = [
  {
    id: "rtns-2026-round-3", short: "RTNS", year: 2026,
    name: "International Conference on Real-Time Networks and Systems",
    deadline: "2026-08-20T23:59:00-12:00", notification: "2026-09-28T23:59:00-12:00", timezone: "AoE",
    dateLabel: "November 4–6, 2026", location: "Toulouse, France", topics: ["Systems", "Real-Time"], rank: "B", round: "Round 3",
    note: "Third submission round for RTNS 2026.", url: "https://2026.rtns-conference.org/", dblp: "https://dblp.org/db/conf/rtns/",
  },
  {
    id: "noms-next", short: "NOMS", year: 2028, name: "IEEE Network Operations and Management Symposium",
    deadline: "2027-10-15T23:59:00-12:00", notification: "2028-01-15T23:59:00-12:00", estimated: true,
    timezone: "AoE", dateLabel: "TBA", location: "TBA", topics: ["Management", "Internet"], rank: "B",
    note: "Prediction based on the previous NOMS planning window.", url: "https://noms2026.ieee-noms.org/", dblp: "https://dblp.org/db/conf/noms/",
  },
  {
    id: "netsoft-next", short: "NetSoft", year: 2027, name: "IEEE Conference on Network Softwarization",
    deadline: "2027-01-12T23:59:00-12:00", notification: "2027-03-23T23:59:00-12:00", estimated: true,
    timezone: "AoE", dateLabel: "TBA", location: "TBA", topics: ["Systems", "Management"], rank: "B",
    note: "Prediction follows the NetSoft 2026 submission and notification dates.", url: "https://ieee-netsoft.org/", dblp: "https://dblp.org/db/conf/netsoft/",
  },
  {
    id: "icc-next", short: "ICC", year: 2027, name: "IEEE International Conference on Communications",
    deadline: "2026-09-29T23:59:00-12:00", notification: "2027-01-12T23:59:00-12:00", estimated: true,
    timezone: "AoE", dateLabel: "2027", location: "Washington, D.C., USA", topics: ["Wireless", "Internet"], rank: "B",
    note: "Prediction follows the IEEE ICC 2026 paper cycle.", url: "https://www.ieee-icc.org/", dblp: "https://dblp.org/db/conf/icc/",
  },
  {
    id: "globecom-next", short: "GLOBECOM", year: 2027, name: "IEEE Global Communications Conference",
    deadline: "2027-04-15T23:59:00-12:00", notification: "2027-07-25T23:59:00-12:00", estimated: true,
    timezone: "AoE", dateLabel: "December 6–10, 2027", location: "Abu Dhabi, UAE", topics: ["Wireless", "Internet"], rank: "B",
    note: "Prediction based on the usual GLOBECOM spring submission cycle.", url: "https://www.ieee-globecom.org/", dblp: "https://dblp.org/db/conf/globecom/",
  },
  {
    id: "drcn-next", short: "DRCN", year: 2027, name: "International Conference on Design of Reliable Communication Networks",
    deadline: "2026-12-15T23:59:00-12:00", notification: "2027-02-15T23:59:00-12:00", estimated: true,
    timezone: "AoE", dateLabel: "TBA", location: "TBA", topics: ["Reliability", "Internet"], rank: "C",
    note: "Prediction based on DRCN's recent winter submission window.", url: "https://www.drcn.org/", dblp: "https://dblp.org/db/conf/drcn/",
  },
  {
    id: "lcn-next", short: "LCN", year: 2027, name: "IEEE Conference on Local Computer Networks",
    deadline: "2027-05-04T23:59:00-12:00", notification: "2027-06-29T23:59:00-12:00", estimated: true,
    timezone: "AoE", dateLabel: "TBA", location: "TBA", topics: ["Internet", "Systems"], rank: "B",
    note: "Prediction follows the final LCN 2026 paper dates.", url: "https://www.ieeelcn.org/", dblp: "https://dblp.org/db/conf/lcn/",
  },
  {
    id: "networking-next", short: "IFIP NETWORKING", year: 2027, name: "IFIP Networking Conference",
    deadline: "2027-02-28T23:59:00-12:00", notification: "2027-04-08T23:59:00-12:00", estimated: true,
    timezone: "AoE", dateLabel: "TBA", location: "TBA", topics: ["Internet", "Systems"], rank: "B",
    note: "Prediction follows the final IFIP Networking 2026 main-track dates.", url: "https://networking.ifip.org/", dblp: "https://dblp.org/db/conf/networking/",
  },
  {
    id: "european-wireless-next", short: "European Wireless", year: 2027, name: "European Wireless Conference",
    deadline: "2027-04-15T23:59:00-12:00", notification: "2027-05-15T23:59:00-12:00", estimated: true,
    timezone: "AoE", dateLabel: "TBA", location: "TBA", topics: ["Wireless", "Mobile"], rank: "C",
    note: "Prediction follows the European Wireless 2026 paper dates.", url: "https://european-wireless.org/", dblp: "https://dblp.org/db/conf/ew/",
  },
  {
    id: "conext-2026",
    short: "CoNEXT",
    year: 2026,
    name: "ACM International Conference on Emerging Networking Experiments and Technologies",
    deadline: "2026-06-24T23:59:00-12:00",
    timezone: "AoE",
    dateLabel: "December 1–4, 2026",
    location: "Berlin, Germany",
    topics: ["Internet", "Systems"],
    rank: "A",
    note: "Full paper deadline. Dates shown here should always be checked against the official CFP.",
    url: "https://conferences2.sigcomm.org/co-next/2026/#!/home",
    dblp: "https://dblp.org/db/conf/conext/",
  },
  {
    id: "imc-2026",
    short: "IMC",
    year: 2026,
    name: "ACM Internet Measurement Conference",
    deadline: "2026-05-21T23:59:00-12:00",
    timezone: "AoE",
    dateLabel: "October 2026",
    location: "Madison, Wisconsin, USA",
    topics: ["Measurement", "Internet"],
    rank: "A",
    note: "Internet measurement, analysis, and operational experience.",
    url: "https://conferences.sigcomm.org/imc/2026/",
    dblp: "https://dblp.org/db/conf/imc/",
  },
  {
    id: "nsdi-2027-spring",
    short: "NSDI",
    year: 2027,
    name: "USENIX Symposium on Networked Systems Design and Implementation",
    deadline: "2026-09-17T23:59:00-12:00",
    timezone: "AoE",
    dateLabel: "Spring 2027",
    location: "TBA",
    topics: ["Systems", "Datacenter"],
    rank: "A*",
    round: "Spring deadline",
    note: "Expected cycle placeholder—confirm the final date on the official CFP before submitting.",
    url: "https://www.usenix.org/conferences/byname/85",
    dblp: "https://dblp.org/db/conf/nsdi/",
  },
  {
    id: "infocom-2027",
    short: "INFOCOM",
    year: 2027,
    name: "IEEE International Conference on Computer Communications",
    deadline: "2026-07-31T23:59:00-04:00",
    timezone: "EDT",
    dateLabel: "May 17–20, 2027",
    location: "Toronto, Canada",
    topics: ["Wireless", "Internet"],
    rank: "A*",
    note: "Paper submission follows abstract registration; consult the official site for the active cycle.",
    url: "https://infocom2027.ieee-infocom.org/",
    dblp: "https://dblp.org/db/conf/infocom/",
  },
  {
    id: "sigcomm-2027",
    short: "SIGCOMM",
    year: 2027,
    name: "ACM Special Interest Group on Data Communication Annual Conference",
    deadline: "2027-01-30T23:59:00-12:00",
    timezone: "AoE",
    dateLabel: "August 2027",
    location: "TBA",
    topics: ["Internet", "Systems"],
    rank: "A*",
    note: "Expected winter cycle placeholder—official dates will replace this as soon as the CFP is announced.",
    url: "https://conferences.sigcomm.org/sigcomm/",
    dblp: "https://dblp.org/db/conf/sigcomm/",
  },
  {
    id: "mobicom-2027",
    short: "MobiCom",
    year: 2027,
    name: "ACM International Conference on Mobile Computing and Networking",
    deadline: "2027-03-20T23:59:00-12:00",
    timezone: "AoE",
    dateLabel: "Autumn 2027",
    location: "TBA",
    topics: ["Wireless", "Mobile"],
    rank: "A*",
    note: "Planning placeholder. Verify the deadline and submission rounds on the official conference site.",
    url: "https://www.sigmobile.org/mobicom/",
    dblp: "https://dblp.org/db/conf/mobicom/",
  },
  {
    id: "hotnets-2026",
    short: "HotNets",
    year: 2026,
    name: "ACM Workshop on Hot Topics in Networks",
    deadline: "2026-06-26T23:59:00-12:00",
    timezone: "AoE",
    dateLabel: "November 2026",
    location: "TBA",
    topics: ["Emerging", "Internet"],
    rank: "B",
    note: "Short, forward-looking papers on new networking ideas.",
    url: "https://conferences.sigcomm.org/hotnets/",
    dblp: "https://dblp.org/db/conf/hotnets/",
  },
];

const topics = ["Internet", "Systems", "Wireless", "Measurement", "Mobile", "Datacenter", "Management", "Reliability", "Real-Time", "Emerging"];
const defaultFeaturedIds = ["infocom-2027", "nsdi-2027-spring", "sigcomm-2027"];

function timeLeft(deadline: string | undefined, now: number | null) {
  if (!deadline) return { ended: false, announced: false, text: "Dates TBA", days: 240 };
  if (now === null) return { ended: false, text: "Calculating…", days: 0 };
  const distance = new Date(deadline).getTime() - now;
  if (distance <= 0) return { ended: true, text: "Deadline passed", days: 0 };
  const days = Math.floor(distance / 86400000);
  const hours = Math.floor((distance % 86400000) / 3600000);
  const minutes = Math.floor((distance % 3600000) / 60000);
  return { ended: false, text: `${days}d ${hours}h ${minutes}m`, days };
}

function sourceDateLabel(deadline: string | undefined) {
  if (!deadline) return "TBA";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const match = deadline.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/);
  if (!match) return deadline;
  const [, year, month, day, hour, minute] = match;
  return `${months[Number(month) - 1]} ${Number(day)}, ${year}, ${hour}:${minute}`;
}

function calendarHref(conf: Conference) {
  if (!conf.deadline) return "";
  const stamp = new Date(conf.deadline).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const details = `Submission deadline for ${conf.name}. Verify details at ${conf.url}`;
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//NetDeadlines//EN", "BEGIN:VEVENT",
    `UID:${conf.id}@netdeadlines`, `DTSTAMP:${stamp}`, `DTSTART:${stamp}`, `DTEND:${stamp}`,
    `SUMMARY:${conf.short} ${conf.year} submission deadline`, `DESCRIPTION:${details}`,
    `URL:${conf.url}`, "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}

export default function Home() {
  const [now, setNow] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [activeTopics, setActiveTopics] = useState<string[]>([]);
  const [ranks, setRanks] = useState<string[]>([]);
  const [showPast, setShowPast] = useState(false);
  const [featuredIds, setFeaturedIds] = useState<string[]>(defaultFeaturedIds);
  const [preferencesReady, setPreferencesReady] = useState(false);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("netdeadlines-featured");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as string[];
        setFeaturedIds(parsed.filter((id) => conferences.some((conf) => conf.id === id)).slice(0, 3));
      } catch { /* Keep the stable defaults when stored data is invalid. */ }
    }
    setPreferencesReady(true);
  }, []);

  useEffect(() => {
    if (preferencesReady) window.localStorage.setItem("netdeadlines-featured", JSON.stringify(featuredIds));
  }, [featuredIds, preferencesReady]);

  const filtered = useMemo(() => conferences
    .filter((conf) => showPast || !timeLeft(conf.deadline, now).ended)
    .filter((conf) => !activeTopics.length || activeTopics.some((topic) => conf.topics.includes(topic)))
    .filter((conf) => !ranks.length || ranks.includes(conf.rank))
    .filter((conf) => `${conf.short} ${conf.name} ${conf.location}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => a.deadline && b.deadline ? +new Date(a.deadline) - +new Date(b.deadline) : a.deadline ? -1 : b.deadline ? 1 : a.short.localeCompare(b.short)),
  [showPast, activeTopics, ranks, query, now]);

  const toggle = (item: string, list: string[], update: (next: string[]) => void) =>
    update(list.includes(item) ? list.filter((value) => value !== item) : [...list, item]);

  const clearFilters = () => {
    setActiveTopics([]);
    setRanks([]);
    setQuery("");
  };

  const featured = featuredIds.map((id) => conferences.find((conf) => conf.id === id)).filter((conf): conf is Conference => Boolean(conf));
  const toggleFeatured = (id: string) => setFeaturedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current.slice(-2), id]);

  return (
    <main className="desk-shell" id="top">
      <header className="desk-header">
        <a className="desk-brand" href="#top" aria-label="NetDeadlines home"><span className="desk-mark"><i /><i /></span>NetDeadlines</a>
        <nav aria-label="Main navigation"><a className="selected" href="#deadlines">Deadlines</a><a href="https://portal.core.edu.au/conf-ranks/" target="_blank" rel="noreferrer">CORE Ranking ↗</a></nav>
        <div className="header-actions"><span>Sync · 31 Jul 2026</span><a href="https://github.com/" target="_blank" rel="noreferrer">+ Contribute</a></div>
      </header>

      <div className="desk-layout">
        <aside className="filter-rail" aria-label="Deadline filters">
          <span className="rail-heading">Filter index</span>
          <label className="rail-field"><b>Find conference</b><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Name, acronym, topic…" /></label>
          <div className="rail-field"><b>Research area</b><div className="rail-chips">{topics.map((topic) => <button className={activeTopics.includes(topic) ? "active" : ""} onClick={() => toggle(topic, activeTopics, setActiveTopics)} key={topic}>{topic}</button>)}</div></div>
          <div className="rail-field"><b>CORE rank</b><div className="rank-checks">{["A*", "A", "B", "C"].map((rank) => <button className={ranks.includes(rank) ? "active" : ""} onClick={() => toggle(rank, ranks, setRanks)} key={rank}><span className="check-box">✓</span>CORE {rank}<small>{String(conferences.filter((conf) => conf.rank === rank).length).padStart(2, "0")}</small></button>)}</div></div>
          <label className="show-past"><input type="checkbox" checked={showPast} onChange={(event) => setShowPast(event.target.checked)} /><span>Show past deadlines</span></label>
          <button className="reset-button" onClick={clearFilters}>Reset filters</button>
          <div className="rail-note"><b>Deadline signal</b><p>Countdowns use each venue’s listed submission timezone. Always verify the official CFP.</p></div>
        </aside>

        <section className="desk-content" id="deadlines">
          <div className="desk-title"><div><span>Personal deadline watchlist · choose up to 3 below</span><h1>My submission watchlist</h1></div><p>{featured.length}/3 selected · saved on this device</p></div>

          {featured.length > 0 ? <div className={`featured-grid count-${featured.length}`}>{featured.map((conf, index) => { const countdown = timeLeft(conf.deadline, now); return <article className={index === 0 ? "featured primary" : "featured"} key={conf.id}><div className="featured-label"><span>Watch slot {index + 1}{conf.estimated ? " · Estimated" : ""}</span><button onClick={() => toggleFeatured(conf.id)} aria-label={`Remove ${conf.short} from watchlist`}>Remove ×</button></div><a href={conf.url} target="_blank" rel="noreferrer">{conf.short} {conf.year} ↗</a><strong>{countdown.text}</strong><span className="conference-date">Conference · {conf.dateLabel} · {conf.location}</span><div className="card-milestones"><p>{conf.estimated ? "Estimated submission" : "Submission deadline"} <b>{sourceDateLabel(conf.deadline)} · {conf.timezone}</b></p><p>{conf.estimated ? "Estimated notification" : "Acceptance notification"} <b>{conf.notification ? sourceDateLabel(conf.notification) : "TBA"}</b></p></div></article>; })}</div> : <div className="watchlist-empty"><strong>Your watchlist is empty.</strong><span>Use “Pin” in the submission timeline to choose conferences.</span></div>}

          <div className="timeline-heading"><h2>Submission timeline</h2><div><span><i className="blue-dot" />Paper</span><span><i className="gray-dot" />Past</span></div></div>
          <div className="timeline-list">
            {filtered.map((conf) => {
              const countdown = timeLeft(conf.deadline, now);
              const position = Math.max(2, Math.min(96, (countdown.days / 240) * 100));
              return <article className={`timeline-row ${countdown.ended ? "past" : ""}`} key={conf.id}>
                <div className="timeline-name"><a href={conf.url} target="_blank" rel="noreferrer">{conf.short} {conf.year} ↗</a><span>{conf.location} · {conf.topics.join(" / ")}</span></div>
                <div className="timeline-rank">CORE {conf.rank}</div>
                <div className="deadline-track" aria-label={`${countdown.days} days remaining`}><span className="track-fill" style={{ width: `${position}%` }} /><i style={{ left: `${position}%` }} /></div>
                <div className="timeline-count"><strong>{countdown.text}{conf.estimated ? " · EST." : ""}</strong><span>{conf.estimated ? "Estimated submit" : "Submit"} · {sourceDateLabel(conf.deadline)} · {conf.timezone}</span><span>{conf.estimated ? "Estimated notification" : "Notification"} · {conf.notification ? sourceDateLabel(conf.notification) : "TBA"}</span></div>
                <div className="timeline-actions"><button className={featuredIds.includes(conf.id) ? "pin-button active" : "pin-button"} onClick={() => toggleFeatured(conf.id)} aria-pressed={featuredIds.includes(conf.id)}>{featuredIds.includes(conf.id) ? "Pinned ✓" : "Pin +"}</button><a href={conf.dblp} target="_blank" rel="noreferrer">DBLP</a>{conf.deadline && !conf.estimated && <a href={calendarHref(conf)} download={`${conf.id}.ics`}>iCal ↓</a>}</div>
              </article>;
            })}
            {!filtered.length && <div className="empty-state"><strong>No deadlines found.</strong><span>Reset the filters to restore the full queue.</span></div>}
          </div>

          <div className="axis-row"><span>Now</span><span>+60d</span><span>+120d</span><span>+180d</span><span>+240d</span></div>
          <footer><span>Source registry · {filtered.length} shown · {conferences.length} tracked conferences</span><span>Updated 31 July 2026</span></footer>
        </section>
      </div>
    </main>
  );
}
