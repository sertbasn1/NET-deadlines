"use client";

import { useEffect, useMemo, useState } from "react";

type Conference = {
  id: string;
  short: string;
  year: number;
  name: string;
  deadline: string;
  timezone: string;
  dateLabel: string;
  location: string;
  topics: string[];
  rank: "A*" | "A" | "B";
  round?: string;
  note: string;
  url: string;
  dblp: string;
};

const conferences: Conference[] = [
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

const topics = ["Internet", "Systems", "Wireless", "Measurement", "Mobile", "Datacenter", "Emerging"];

function timeLeft(deadline: string, now: number) {
  const distance = new Date(deadline).getTime() - now;
  if (distance <= 0) return { ended: true, text: "Deadline passed", days: 0 };
  const days = Math.floor(distance / 86400000);
  const hours = Math.floor((distance % 86400000) / 3600000);
  const minutes = Math.floor((distance % 3600000) / 60000);
  return { ended: false, text: `${days}d ${hours}h ${minutes}m`, days };
}

function calendarHref(conf: Conference) {
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
  const [now, setNow] = useState(Date.now());
  const [query, setQuery] = useState("");
  const [activeTopics, setActiveTopics] = useState<string[]>([]);
  const [ranks, setRanks] = useState<string[]>([]);
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const filtered = useMemo(() => conferences
    .filter((conf) => showPast || !timeLeft(conf.deadline, now).ended)
    .filter((conf) => !activeTopics.length || activeTopics.some((topic) => conf.topics.includes(topic)))
    .filter((conf) => !ranks.length || ranks.includes(conf.rank))
    .filter((conf) => `${conf.short} ${conf.name} ${conf.location}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => +new Date(a.deadline) - +new Date(b.deadline)),
  [showPast, activeTopics, ranks, query, now]);

  const toggle = (item: string, list: string[], update: (next: string[]) => void) =>
    update(list.includes(item) ? list.filter((value) => value !== item) : [...list, item]);

  return (
    <main>
      <header className="masthead">
        <nav className="nav wrap" aria-label="Main navigation">
          <a className="brand" href="#top" aria-label="NetDeadlines home"><span className="brand-mark">N</span>net<span>deadlines</span></a>
          <div className="nav-links">
            <a href="#deadlines">Deadlines</a>
            <a href="#about">About</a>
            <a className="contribute" href="https://github.com/" target="_blank" rel="noreferrer">Contribute <span>↗</span></a>
          </div>
        </nav>

        <section className="hero wrap" id="top">
          <div className="eyebrow"><span /> The networking research calendar</div>
          <div className="hero-grid">
            <div>
              <h1>Never miss<br />the <em>next hop.</em></h1>
              <p className="lede">Deadlines for the computer networking conferences that move our field forward—collected in one calm, useful place.</p>
            </div>
            <aside className="next-up">
              <span className="label">Next up</span>
              <strong>{filtered[0]?.short ?? "No match"} <i>{filtered[0]?.year}</i></strong>
              <span>{filtered[0] ? timeLeft(filtered[0].deadline, now).text : "Adjust your filters"}</span>
              <div className="signal"><b /><b /><b /><b /><b /></div>
            </aside>
          </div>
          <div className="hero-meta">
            <span>Updated July 31, 2026</span>
            <span>All deadlines display their source timezone</span>
            <span><b>{conferences.length}</b> tracked deadlines</span>
          </div>
        </section>
      </header>

      <section className="tracker wrap" id="deadlines">
        <div className="section-heading">
          <div><span className="kicker">01 / Deadline board</span><h2>What’s coming up</h2></div>
          <label className="search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search conferences" aria-label="Search conferences" /></label>
        </div>

        <div className="filter-panel">
          <div className="filter-group"><span>Research area</span><div>{topics.map((topic) => <button className={activeTopics.includes(topic) ? "active" : ""} onClick={() => toggle(topic, activeTopics, setActiveTopics)} key={topic}>{topic}</button>)}</div></div>
          <div className="filter-group compact"><span>CORE rank</span><div>{["A*", "A", "B"].map((rank) => <button className={ranks.includes(rank) ? "active" : ""} onClick={() => toggle(rank, ranks, setRanks)} key={rank}>{rank}</button>)}</div></div>
          <label className="past-toggle"><input type="checkbox" checked={showPast} onChange={(event) => setShowPast(event.target.checked)} /><span /> Show past</label>
        </div>

        <div className="result-row"><span>{filtered.length} deadline{filtered.length === 1 ? "" : "s"}</span>{(activeTopics.length > 0 || ranks.length > 0 || query) && <button onClick={() => { setActiveTopics([]); setRanks([]); setQuery(""); }}>Clear filters ×</button>}</div>

        <div className="deadline-list">
          {filtered.map((conf, index) => {
            const countdown = timeLeft(conf.deadline, now);
            return (
              <article className={`conference-card ${countdown.ended ? "past" : ""}`} key={conf.id}>
                <div className="card-number">{String(index + 1).padStart(2, "0")}</div>
                <div className="conference-main">
                  <div className="tag-row"><span className={`rank rank-${conf.rank.replace("*", "star")}`}>{conf.rank}</span>{conf.topics.map((topic) => <span key={topic}>{topic}</span>)}</div>
                  <h3><a href={conf.url} target="_blank" rel="noreferrer">{conf.short} <i>{conf.year}</i> <small>↗</small></a></h3>
                  <p>{conf.name}</p>
                  <div className="venue"><span>⌖</span> {conf.location}<b>·</b>{conf.dateLabel}</div>
                  <div className="card-links"><a href={conf.dblp} target="_blank" rel="noreferrer">DBLP ↗</a><a href={calendarHref(conf)} download={`${conf.id}.ics`}>Add to calendar ↓</a></div>
                </div>
                <div className="deadline-block">
                  <span className="label">{countdown.ended ? "Closed" : conf.round ?? "Paper deadline"}</span>
                  <strong>{countdown.text}</strong>
                  <time dateTime={conf.deadline}>{new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(conf.deadline))}</time>
                  <span className="zone">{conf.timezone}</span>
                  <p>{conf.note}</p>
                </div>
              </article>
            );
          })}
          {!filtered.length && <div className="empty"><strong>No deadlines found.</strong><span>Try clearing a filter or showing past deadlines.</span></div>}
        </div>
      </section>

      <section className="about" id="about">
        <div className="wrap about-grid">
          <span className="kicker">02 / About the project</span>
          <h2>Built for people who think in packets.</h2>
          <div><p>NetDeadlines is a community-maintained calendar for computer networking research. Dates change; always verify the official call for papers before submitting.</p><a href="https://github.com/" target="_blank" rel="noreferrer">Suggest a conference <span>↗</span></a></div>
        </div>
      </section>

      <footer className="wrap"><a className="brand" href="#top"><span className="brand-mark">N</span>net<span>deadlines</span></a><p>Made for the networking community · 2026</p><a href="#top">Back to top ↑</a></footer>
    </main>
  );
}
