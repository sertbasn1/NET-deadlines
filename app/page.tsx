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

const selectedConferences: Conference[] = [
  {
    id: "icdcs-2027", short: "ICDCS", year: 2027,
    name: "IEEE International Conference on Distributed Computing Systems",
    deadline: "2027-01-21T23:59:00-12:00", notification: "2027-04-27T23:59:00-12:00", estimated: true, timezone: "AoE",
    dateLabel: "July 5–8, 2027", location: "Melbourne, Australia", topics: ["Systems", "Datacenter"], rank: "A",
    note: "Conference dates are official; submission and notification are estimates based on ICDCS 2026 while the 2027 CFP remains TBA.", url: "https://icdcs2027.icdcs.org/", dblp: "https://dblp.org/db/conf/icdcs/",
  },
  {
    id: "asiaccs-2027-cycle-1", short: "ASIA CCS", year: 2027,
    name: "ACM Asia Conference on Computer and Communications Security",
    deadline: "2026-08-21T23:59:00-12:00", notification: "2026-11-13T23:59:00-12:00", timezone: "AoE",
    dateLabel: "July 12–16, 2027", location: "Macau", topics: ["Security", "Internet"], rank: "A", round: "Cycle 1",
    note: "Official ASIA CCS 2027 first submission cycle.", url: "https://asiaccs2027.cityu.edu.mo/call-for-papers/index.html", dblp: "https://dblp.org/db/conf/asiaccs/",
  },
  {
    id: "asiaccs-2027-cycle-2", short: "ASIA CCS", year: 2027,
    name: "ACM Asia Conference on Computer and Communications Security",
    deadline: "2026-12-11T23:59:00-12:00", notification: "2027-03-31T23:59:00-12:00", timezone: "AoE",
    dateLabel: "July 12–16, 2027", location: "Macau", topics: ["Security", "Internet"], rank: "A", round: "Cycle 2",
    note: "Official ASIA CCS 2027 second submission cycle.", url: "https://asiaccs2027.cityu.edu.mo/call-for-papers/index.html", dblp: "https://dblp.org/db/conf/asiaccs/",
  },
  {
    id: "sec-2026", short: "SEC", year: 2026,
    name: "ACM/IEEE Symposium on Edge Computing",
    deadline: "2026-05-08T23:59:00-12:00", notification: "2026-07-29T23:59:00-12:00", timezone: "AoE",
    dateLabel: "October 13–16, 2026", location: "Santa Clara, California, USA", topics: ["Systems", "Datacenter"], rank: "Unranked",
    note: "Official SEC 2026 main-paper deadline, extended from May 1 to May 8.", url: "https://acm-ieee-sec.org/2026/", dblp: "https://dblp.org/db/conf/ieeesec/",
  },
  {
    id: "sec-2027", short: "SEC", year: 2027,
    name: "ACM/IEEE Symposium on Edge Computing",
    deadline: "2027-05-07T23:59:00-12:00", notification: "2027-07-28T23:59:00-12:00", estimated: true, timezone: "AoE",
    dateLabel: "Autumn 2027", location: "TBA", topics: ["Systems", "Datacenter"], rank: "Unranked",
    note: "Estimated from the SEC 2026 cycle; the official SEC 2027 CFP has not been announced.", url: "https://acm-ieee-sec.org/", dblp: "https://dblp.org/db/conf/ieeesec/",
  },
  {
    id: "dsn-2026", short: "DSN", year: 2026,
    name: "IEEE/IFIP International Conference on Dependable Systems and Networks",
    deadline: "2025-12-04T23:59:00-12:00", notification: "2026-03-19T23:59:00-12:00", timezone: "AoE",
    dateLabel: "June 22–25, 2026", location: "Charlotte, North Carolina, USA", topics: ["Reliability", "Systems"], rank: "A",
    note: "Official DSN 2026 Research Track dates.", url: "https://dsn2026.github.io/", dblp: "https://dblp.org/db/conf/dsn/",
  },
  {
    id: "dsn-2027", short: "DSN", year: 2027,
    name: "IEEE International Conference on Dependable Systems and Networks",
    deadline: "2026-12-02T23:59:00-12:00", notification: "2027-03-18T23:59:00-12:00", timezone: "AoE",
    dateLabel: "June 22–25, 2027", location: "Berlin, Germany", topics: ["Reliability", "Systems"], rank: "A",
    note: "Official DSN 2027 Research Track dates; abstract registration is due November 25, 2026.", url: "https://dsn2027-berlin.github.io/", dblp: "https://dblp.org/db/conf/dsn/",
  },
  {
    id: "rtns-2026-round-1", short: "RTNS", year: 2026,
    name: "International Conference on Real-Time Networks and Systems",
    deadline: "2026-02-05T23:59:00-12:00", notification: "2026-03-18T23:59:00-12:00", timezone: "AoE",
    dateLabel: "November 4–6, 2026", location: "Toulouse, France", topics: ["Systems", "Real-Time"], rank: "B", round: "Round 1",
    note: "Official RTNS 2026 first submission round.", url: "https://2026.rtns-conference.org/", dblp: "https://dblp.org/db/conf/rtns/",
  },
  {
    id: "rtns-2026-round-2", short: "RTNS", year: 2026,
    name: "International Conference on Real-Time Networks and Systems",
    deadline: "2026-06-04T23:59:00-12:00", notification: "2026-07-17T23:59:00-12:00", timezone: "AoE",
    dateLabel: "November 4–6, 2026", location: "Toulouse, France", topics: ["Systems", "Real-Time"], rank: "B", round: "Round 2",
    note: "Official RTNS 2026 second submission round.", url: "https://2026.rtns-conference.org/", dblp: "https://dblp.org/db/conf/rtns/",
  },
  {
    id: "rtns-2026-round-3", short: "RTNS", year: 2026,
    name: "International Conference on Real-Time Networks and Systems",
    deadline: "2026-08-20T23:59:00-12:00", notification: "2026-09-28T23:59:00-12:00", timezone: "AoE",
    dateLabel: "November 4–6, 2026", location: "Toulouse, France", topics: ["Systems", "Real-Time"], rank: "B", round: "Round 3",
    note: "Third submission round for RTNS 2026.", url: "https://2026.rtns-conference.org/", dblp: "https://dblp.org/db/conf/rtns/",
  },
  {
    id: "rtns-2027-round-1", short: "RTNS", year: 2027,
    name: "International Conference on Real-Time Networks and Systems",
    deadline: "2027-02-04T23:59:00-12:00", notification: "2027-03-17T23:59:00-12:00", estimated: true, timezone: "AoE",
    dateLabel: "Autumn 2027", location: "TBA", topics: ["Systems", "Real-Time"], rank: "B", round: "Round 1",
    note: "Estimated from the RTNS 2026 first-round schedule; the 2027 CFP is TBA.", url: "https://rtns-conference.org/", dblp: "https://dblp.org/db/conf/rtns/",
  },
  {
    id: "rtns-2027-round-2", short: "RTNS", year: 2027,
    name: "International Conference on Real-Time Networks and Systems",
    deadline: "2027-06-03T23:59:00-12:00", notification: "2027-07-16T23:59:00-12:00", estimated: true, timezone: "AoE",
    dateLabel: "Autumn 2027", location: "TBA", topics: ["Systems", "Real-Time"], rank: "B", round: "Round 2",
    note: "Estimated from the RTNS 2026 second-round schedule; the 2027 CFP is TBA.", url: "https://rtns-conference.org/", dblp: "https://dblp.org/db/conf/rtns/",
  },
  {
    id: "rtns-2027-round-3", short: "RTNS", year: 2027,
    name: "International Conference on Real-Time Networks and Systems",
    deadline: "2027-08-19T23:59:00-12:00", notification: "2027-09-27T23:59:00-12:00", estimated: true, timezone: "AoE",
    dateLabel: "Autumn 2027", location: "TBA", topics: ["Systems", "Real-Time"], rank: "B", round: "Round 3",
    note: "Estimated from the RTNS 2026 third-round schedule; the 2027 CFP is TBA.", url: "https://rtns-conference.org/", dblp: "https://dblp.org/db/conf/rtns/",
  },
  {
    id: "rtas-2026", short: "RTAS", year: 2026,
    name: "IEEE Real-Time and Embedded Technology and Applications Symposium",
    deadline: "2025-11-13T23:59:00-12:00", notification: "2026-01-29T23:59:00-12:00", timezone: "AoE",
    dateLabel: "May 12–14, 2026", location: "Saint-Malo, France", topics: ["Real-Time", "Systems"], rank: "A",
    note: "Official RTAS 2026 main-track submission and notification dates.", url: "https://2026.rtas.org/", dblp: "https://dblp.org/db/conf/rtas/",
  },
  {
    id: "rtas-2027", short: "RTAS", year: 2027,
    name: "IEEE Real-Time and Embedded Technology and Applications Symposium",
    deadline: "2026-11-05T23:59:00-12:00", notification: "2027-01-28T23:59:00-12:00", timezone: "AoE",
    dateLabel: "May 17–20, 2027", location: "TBA", topics: ["Real-Time", "Systems"], rank: "A",
    note: "Official RTAS 2027 main-track dates; the notification date is marked tentative by the organizers.", url: "https://2027.rtas.org/", dblp: "https://dblp.org/db/conf/rtas/",
  },
  {
    id: "ieee-tnsm-journal", short: "IEEE TNSM Journal", year: 2026,
    name: "IEEE Transactions on Network and Service Management",
    timezone: "Rolling", dateLabel: "Regular submissions welcome anytime", location: "Online journal",
    topics: ["Management", "Reliability"], rank: "Unranked",
    note: "Journal entry: regular-paper submissions are accepted continuously; special issues may have separate deadlines.",
    url: "https://www.comsoc.org/publications/journals/ieee-transactions-network-and-service-management", dblp: "https://dblp.org/db/journals/tnsm/",
  },
  {
    id: "noms-2026", short: "NOMS", year: 2026,
    name: "IEEE/IFIP Network Operations and Management Symposium",
    deadline: "2025-10-27T23:59:00-12:00", notification: "2026-01-18T23:59:00-12:00", timezone: "AoE",
    dateLabel: "May 18–22, 2026", location: "Rome, Italy", topics: ["Management", "Internet"], rank: "B",
    note: "Archived NOMS 2026 main-track record; NOMS is biennial, so its next edition is outside the 2025–2027 window.", url: "https://noms2026.ieee-noms.org/", dblp: "https://dblp.org/db/conf/noms/",
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
    id: "conext-2027",
    short: "CoNEXT",
    year: 2027,
    name: "ACM International Conference on Emerging Networking Experiments and Technologies",
    deadline: "2027-06-23T23:59:00-12:00",
    notification: "2027-09-15T23:59:00-12:00",
    estimated: true,
    timezone: "AoE",
    dateLabel: "December 2027",
    location: "TBA",
    topics: ["Internet", "Systems"],
    rank: "A",
    note: "Estimated from the CoNEXT 2026 cycle; official 2027 dates are not yet available.",
    url: "https://conferences2.sigcomm.org/co-next/2027/",
    dblp: "https://dblp.org/db/conf/conext/",
  },
  {
    id: "imc-2026-cycle-1",
    short: "IMC",
    year: 2026,
    name: "ACM Internet Measurement Conference",
    deadline: "2025-11-20T23:59:00-12:00",
    notification: "2026-03-17T23:59:00-12:00",
    timezone: "AoE",
    dateLabel: "October 12–16, 2026",
    location: "Karlsruhe, Germany",
    topics: ["Measurement", "Internet"],
    rank: "A",
    round: "Cycle 1",
    note: "Official IMC 2026 first submission cycle.",
    url: "https://conferences.sigcomm.org/imc/2026/",
    dblp: "https://dblp.org/db/conf/imc/",
  },
  {
    id: "imc-2026", short: "IMC", year: 2026,
    name: "ACM Internet Measurement Conference",
    deadline: "2026-04-29T23:59:00-12:00", notification: "2026-08-04T23:59:00-12:00", timezone: "AoE",
    dateLabel: "October 12–16, 2026", location: "Karlsruhe, Germany", topics: ["Measurement", "Internet"], rank: "A", round: "Cycle 2",
    note: "Official IMC 2026 second submission cycle.", url: "https://conferences.sigcomm.org/imc/2026/", dblp: "https://dblp.org/db/conf/imc/",
  },
  {
    id: "imc-2027-cycle-1", short: "IMC", year: 2027,
    name: "ACM Internet Measurement Conference",
    deadline: "2026-11-20T23:59:00-12:00", notification: "2027-03-17T23:59:00-12:00", estimated: true, timezone: "AoE",
    dateLabel: "Autumn 2027", location: "TBA", topics: ["Measurement", "Internet"], rank: "A", round: "Cycle 1",
    note: "Estimated from IMC's two-cycle 2026 schedule; the official 2027 CFP is not yet posted.", url: "https://www.sigcomm.org/events/imc-conference/", dblp: "https://dblp.org/db/conf/imc/",
  },
  {
    id: "imc-2027-cycle-2", short: "IMC", year: 2027,
    name: "ACM Internet Measurement Conference",
    deadline: "2027-04-29T23:59:00-12:00", notification: "2027-08-04T23:59:00-12:00", estimated: true, timezone: "AoE",
    dateLabel: "Autumn 2027", location: "TBA", topics: ["Measurement", "Internet"], rank: "A", round: "Cycle 2",
    note: "Estimated from IMC's two-cycle 2026 schedule; the official 2027 CFP is not yet posted.", url: "https://www.sigcomm.org/events/imc-conference/", dblp: "https://dblp.org/db/conf/imc/",
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
    deadline: "2026-07-16T23:59:00-12:00",
    notification: "2026-09-24T23:59:00-12:00",
    timezone: "AoE",
    dateLabel: "November 16–17, 2026",
    location: "Salt Lake City, Utah, USA",
    topics: ["Emerging", "Internet"],
    rank: "B",
    note: "Short, forward-looking papers on new networking ideas.",
    url: "https://conferences.sigcomm.org/hotnets/",
    dblp: "https://dblp.org/db/conf/hotnets/",
  },
  {
    id: "hotnets-2027", short: "HotNets", year: 2027,
    name: "ACM Workshop on Hot Topics in Networks",
    deadline: "2027-07-15T23:59:00-12:00", notification: "2027-09-23T23:59:00-12:00", estimated: true, timezone: "AoE",
    dateLabel: "November 2027", location: "TBA", topics: ["Emerging", "Internet"], rank: "B",
    note: "Estimated from the HotNets 2026 cycle; official 2027 dates are not yet available.", url: "https://conferences.sigcomm.org/hotnets/2027/", dblp: "https://dblp.org/db/conf/hotnets/",
  },
];

type RankedVenueSeed = [string, string, string, "A*" | "A" | "B", string, string, string[]];

const rankedNetworkingVenueSeeds: RankedVenueSeed[] = [
  ["percom", "PerCom", "IEEE International Conference on Pervasive Computing and Communications", "A*", "https://www.percom.org/", "percom", ["Mobile", "Systems"]],
  ["mobisys", "MobiSys", "ACM International Conference on Mobile Systems, Applications, and Services", "A", "https://www.sigmobile.org/mobisys/", "mobisys", ["Mobile", "Systems"]],
  ["mswim", "MSWiM", "ACM International Conference on Modeling, Analysis and Simulation of Wireless and Mobile Systems", "A", "https://mswimconf.com/", "mswim", ["Wireless", "Mobile"]],
  ["cnsm", "CNSM", "International Conference on Network and Service Management", "B", "https://www.cnsm-conf.org/", "cnsm", ["Management", "Internet"]],
  ["dcoss", "DCOSS", "IEEE International Conference on Distributed Computing in Smart Systems and the Internet of Things", "B", "https://dcoss.org/", "dcoss", ["Wireless", "Systems"]],
  ["ewsn", "EWSN", "International Conference on Embedded Wireless Systems and Networks", "B", "https://ewsn.org/", "ewsn", ["Wireless", "Systems"]],
  ["icccn", "ICCCN", "International Conference on Computer Communications and Networks", "B", "https://www.icccn.org/", "icccn", ["Internet", "Systems"]],
  ["icnp", "ICNP", "IEEE International Conference on Network Protocols", "B", "https://icnp.network/", "icnp", ["Internet", "Systems"]],
  ["ccnc", "CCNC", "IEEE Consumer Communications and Networking Conference", "B", "https://ccnc2027.ieee-ccnc.org/", "ccnc", ["Wireless", "Internet"]],
  ["im", "IM", "IFIP/IEEE International Symposium on Integrated Network Management", "B", "https://im2027.ieee-im.org/", "im", ["Management", "Internet"]],
  ["iwcmc", "IWCMC", "International Wireless Communications and Mobile Computing Conference", "B", "https://iwcmc.org/", "iwcmc", ["Wireless", "Mobile"]],
  ["iwqos", "IWQoS", "IEEE/ACM International Symposium on Quality of Service", "B", "https://iwqos.org/", "iwqos", ["Internet", "Systems"]],
  ["mass", "MASS", "IEEE International Conference on Mobile Ad Hoc and Smart Systems", "B", "https://sites.google.com/view/ieee-mass/", "mass", ["Wireless", "Mobile"]],
  ["mobihoc", "MobiHoc", "ACM International Symposium on Theory, Algorithmic Foundations, and Protocol Design for Mobile Networks", "B", "https://www.sigmobile.org/mobihoc/", "mobihoc", ["Wireless", "Mobile"]],
  ["pam", "PAM", "Passive and Active Measurement Conference", "B", "https://www.pamconference.org/", "pam", ["Measurement", "Internet"]],
  ["pimrc", "PIMRC", "IEEE International Symposium on Personal, Indoor and Mobile Radio Communications", "B", "https://pimrc2027.ieee-pimrc.org/", "pimrc", ["Wireless", "Mobile"]],
  ["secon", "SECON", "IEEE International Conference on Sensing, Communication, and Networking", "B", "https://secon2026.ieee-secon.org/", "secon", ["Wireless", "Mobile"]],
  ["vtc", "VTC", "IEEE Vehicular Technology Conference", "B", "https://events.vtsociety.org/vtc2027-spring/", "vtc", ["Wireless", "Mobile"]],
  ["wcnc", "WCNC", "IEEE Wireless Communications and Networking Conference", "B", "https://wcnc2027.ieee-wcnc.org/", "wcnc", ["Wireless", "Internet"]],
  ["wimob", "WiMob", "IEEE International Conference on Wireless and Mobile Computing, Networking and Communications", "B", "https://wimob.org/", "wimob", ["Wireless", "Mobile"]],
  ["wiopt", "WiOpt", "International Symposium on Modeling and Optimization in Mobile, Ad Hoc, and Wireless Networks", "B", "https://wiopt.org/", "wiopt", ["Wireless", "Mobile"]],
];

const rankedVenuePredictions: Record<string, Pick<Conference, "deadline" | "notification"> & Partial<Conference>> = {
  percom: { deadline: "2026-09-18T23:59:00-12:00", notification: "2026-12-14T23:59:00-12:00" },
  mobisys: { deadline: "2026-12-04T23:59:00-12:00", notification: "2027-03-10T23:59:00-12:00" },
  mswim: { deadline: "2027-06-12T23:59:00-12:00", notification: "2027-08-01T23:59:00-12:00" },
  cnsm: { deadline: "2027-05-31T23:59:00-12:00", notification: "2027-07-15T23:59:00-12:00" },
  dcoss: { deadline: "2027-01-20T23:59:00-12:00", notification: "2027-03-20T23:59:00-12:00" },
  ewsn: { deadline: "2026-10-01T23:59:00-12:00", notification: "2026-12-15T23:59:00-12:00" },
  icccn: { deadline: "2027-02-10T23:59:00-12:00", notification: "2027-04-15T23:59:00-12:00" },
  icnp: { deadline: "2027-05-20T23:59:00-12:00", notification: "2027-07-25T23:59:00-12:00" },
  ccnc: { deadline: "2026-09-18T23:59:00-12:00", notification: "2026-10-30T23:59:00-12:00" },
  im: { deadline: "2026-09-04T23:59:00-12:00", notification: "2026-12-15T23:59:00-12:00" },
  iwcmc: { deadline: "2027-01-15T23:59:00-12:00", notification: "2027-03-15T23:59:00-12:00" },
  iwqos: { deadline: "2027-02-15T23:59:00-12:00", notification: "2027-04-15T23:59:00-12:00" },
  mass: { deadline: "2027-04-20T23:59:00-12:00", notification: "2027-06-15T23:59:00-12:00" },
  mobihoc: { deadline: "2027-03-15T23:59:00-12:00", notification: "2027-05-20T23:59:00-12:00" },
  pam: { deadline: "2026-10-20T23:59:00-12:00", notification: "2026-12-10T23:59:00-12:00" },
  pimrc: { deadline: "2027-03-15T23:59:00-12:00", notification: "2027-06-15T23:59:00-12:00" },
  secon: { deadline: "2027-03-31T23:59:00-12:00", notification: "2027-05-31T23:59:00-12:00" },
  vtc: { deadline: "2026-09-30T23:59:00-12:00", notification: "2026-12-20T23:59:00-12:00", estimated: false, dateLabel: "June 20–23, 2027", location: "Hamburg, Germany", note: "Official VTC2027-Spring regular-paper and notification dates." },
  wcnc: { deadline: "2026-09-25T23:59:00-12:00", notification: "2026-12-15T23:59:00-12:00" },
  wimob: { deadline: "2027-05-15T23:59:00-12:00", notification: "2027-07-15T23:59:00-12:00" },
  wiopt: { deadline: "2027-02-15T23:59:00-12:00", notification: "2027-04-15T23:59:00-12:00" },
};

const rankedNetworkingVenues: Conference[] = rankedNetworkingVenueSeeds.map(([id, short, name, rank, url, dblp, venueTopics]) => ({
  id: `${id}-next`, short, year: 2027, name, rank, url,
  dblp: `https://dblp.org/db/conf/${dblp}/`, topics: venueTopics,
  timezone: "AoE", dateLabel: "2027 · dates TBA", location: "TBA", estimated: true,
  note: "Estimated from recent submission cycles; replace with the official 2027 CFP dates when announced.",
  ...rankedVenuePredictions[id],
}));

const conferences = [...selectedConferences, ...rankedNetworkingVenues];
const distinctConferenceCount = new Set(
  conferences.filter((conf) => conf.id !== "ieee-tnsm-journal").map((conf) => conf.name),
).size;

const topics = ["Internet", "Systems", "Wireless", "Security", "Measurement", "Mobile", "Datacenter", "Management", "Reliability", "Real-Time", "Emerging"];
type View = "deadlines" | "watchlist" | "decisions";

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

const labelPalette = [
  { backgroundColor: "#e6efff", borderColor: "#9bbcff", color: "#0648c7" },
  { backgroundColor: "#e3f5ee", borderColor: "#91d5bd", color: "#076247" },
  { backgroundColor: "#fff1d8", borderColor: "#edc27d", color: "#8a4c00" },
  { backgroundColor: "#f2e9ff", borderColor: "#c7a8eb", color: "#6636a5" },
  { backgroundColor: "#ffe8eb", borderColor: "#edabb5", color: "#9c2f40" },
  { backgroundColor: "#e7f4f7", borderColor: "#a2d4dd", color: "#176574" },
];

function labelStyle(label: string) {
  const hash = Array.from(label.toLocaleLowerCase()).reduce((value, character) => ((value * 31) + character.charCodeAt(0)) >>> 0, 0);
  return labelPalette[hash % labelPalette.length];
}

function conferenceDisplayName(conf: Conference) {
  const numberedRound = conf.round?.match(/^(?:cycle|round)\s*(\d+)$/i);
  if (numberedRound) return `${conf.short.replace(/\s+/g, "")}${conf.year}-Round${numberedRound[1]}`;
  return `${conf.short} ${conf.year}${conf.round ? ` — ${conf.round}` : ""}`;
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
  const [view, setView] = useState<View>("deadlines");
  const [now, setNow] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [activeTopics, setActiveTopics] = useState<string[]>([]);
  const [ranks, setRanks] = useState<string[]>([]);
  const [showPast, setShowPast] = useState(true);
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
  const [decisionIds, setDecisionIds] = useState<string[]>([]);
  const [customTags, setCustomTags] = useState<Record<string, string[]>>({});
  const [tagDrafts, setTagDrafts] = useState<Record<string, string>>({});
  const [preferencesReady, setPreferencesReady] = useState(false);

  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const saved = window.localStorage.getItem("netdeadlines-watchlist") ?? window.localStorage.getItem("netdeadlines-featured");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as string[];
        setWatchlistIds(parsed.filter((id) => conferences.some((conf) => conf.id === id)));
      } catch { /* Keep an empty watchlist when stored data is invalid. */ }
    }
    const savedDecisions = window.localStorage.getItem("netdeadlines-decisions");
    if (savedDecisions) try {
      const parsed = JSON.parse(savedDecisions) as string[];
      setDecisionIds(parsed.filter((id) => conferences.some((conf) => conf.id === id)));
    } catch { /* Keep an empty decision list when stored data is invalid. */ }
    const savedTags = window.localStorage.getItem("netdeadlines-tags");
    if (savedTags) try { setCustomTags(JSON.parse(savedTags) as Record<string, string[]>); } catch { /* Ignore invalid saved tags. */ }
    setPreferencesReady(true);
  }, []);

  useEffect(() => {
    if (preferencesReady) window.localStorage.setItem("netdeadlines-watchlist", JSON.stringify(watchlistIds));
  }, [watchlistIds, preferencesReady]);

  useEffect(() => {
    if (preferencesReady) window.localStorage.setItem("netdeadlines-decisions", JSON.stringify(decisionIds));
  }, [decisionIds, preferencesReady]);

  useEffect(() => {
    if (preferencesReady) window.localStorage.setItem("netdeadlines-tags", JSON.stringify(customTags));
  }, [customTags, preferencesReady]);

  const filtered = useMemo(() => conferences
    .filter((conf) => showPast || !timeLeft(view === "decisions" ? conf.notification : conf.deadline, now).ended)
    .filter((conf) => !activeTopics.length || activeTopics.some((topic) => conf.topics.includes(topic)))
    .filter((conf) => !ranks.length || ranks.includes(conf.rank))
    .filter((conf) => view === "deadlines" || (view === "watchlist" ? watchlistIds.includes(conf.id) : decisionIds.includes(conf.id)))
    .filter((conf) => `${conf.short} ${conf.name} ${conf.location} ${conf.topics.join(" ")} ${(customTags[conf.id] ?? []).join(" ")}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => { const aDate = view === "decisions" ? a.notification : a.deadline; const bDate = view === "decisions" ? b.notification : b.deadline; return aDate && bDate ? +new Date(aDate) - +new Date(bDate) : aDate ? -1 : bDate ? 1 : a.short.localeCompare(b.short); }),
  [showPast, activeTopics, ranks, query, now, view, watchlistIds, decisionIds, customTags]);

  const toggle = (item: string, list: string[], update: (next: string[]) => void) =>
    update(list.includes(item) ? list.filter((value) => value !== item) : [...list, item]);

  const clearFilters = () => {
    setActiveTopics([]);
    setRanks([]);
    setQuery("");
  };

  const toggleWatchlist = (id: string) => setWatchlistIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleDecision = (id: string) => setDecisionIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const addTag = (id: string) => {
    const tag = (tagDrafts[id] ?? "").trim().replace(/^#/, "");
    if (!tag) return;
    setCustomTags((current) => ({ ...current, [id]: Array.from(new Set([...(current[id] ?? []), tag])) }));
    setTagDrafts((current) => ({ ...current, [id]: "" }));
  };
  const removeTag = (id: string, tag: string) => setCustomTags((current) => ({ ...current, [id]: (current[id] ?? []).filter((item) => item !== tag) }));

  return (
    <main className="desk-shell" id="top">
      <header className="desk-header">
        <a className="desk-brand" href="#top" aria-label="NetDeadlines home"><span className="desk-mark"><i /><i /></span>NetDeadlines</a>
        <nav aria-label="Main navigation"><button className={view === "deadlines" ? "selected" : ""} onClick={() => setView("deadlines")}>All deadlines</button><button className={view === "watchlist" ? "selected" : ""} onClick={() => setView("watchlist")}>My watchlist <small>{watchlistIds.length}</small></button><button className={view === "decisions" ? "selected" : ""} onClick={() => setView("decisions")}>Awaiting decisions <small>{decisionIds.length}</small></button><a href="https://portal.core.edu.au/conf-ranks/" target="_blank" rel="noreferrer">CORE Ranking ↗</a></nav>
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
          <div className="rail-note"><b>{view === "watchlist" ? "Your labels" : view === "decisions" ? "Student assignments" : "Deadline signal"}</b><p>{view === "watchlist" ? "Add project names or tags to organize the conferences you follow. They stay on this device." : view === "decisions" ? "Add a student name or label to each submission. The same label always keeps the same color on this device." : "Countdowns use each venue’s listed submission timezone. Always verify the official CFP."}</p></div>
        </aside>

        <section className="desk-content" id="deadlines">
          <div className="desk-title"><div><span>{view === "deadlines" ? "Complete conference registry" : view === "watchlist" ? "Personal conference collection" : "Acceptance notification tracker"}</span><h1>{view === "deadlines" ? "All networking deadlines" : view === "watchlist" ? "My watchlist" : "Awaiting decisions"}</h1></div><p>{view === "deadlines" ? `${conferences.length} tracked deadlines · ${distinctConferenceCount} conferences` : view === "watchlist" ? `${watchlistIds.length} saved · this device` : `${decisionIds.length} pending · this device`}</p></div>

          <div className="timeline-heading"><h2>{view === "deadlines" ? "Submission timeline" : view === "watchlist" ? "Saved conferences" : "Notification timeline"}</h2><div><span><i className="blue-dot" />{view === "decisions" ? "Decision" : "Paper"}</span><span><i className="gray-dot" />Past</span></div></div>
          <div className="timeline-list">
            {filtered.map((conf) => {
              const countdown = timeLeft(view === "decisions" ? conf.notification : conf.deadline, now);
              const position = Math.max(2, Math.min(96, (countdown.days / 240) * 100));
              return <article className={`timeline-row ${countdown.ended ? "past" : ""}`} key={conf.id}>
                <div className="timeline-name"><a href={conf.url} target="_blank" rel="noreferrer">{conferenceDisplayName(conf)} ↗</a><span>{conf.location} · {conf.topics.join(" / ")}</span>{view !== "deadlines" && <div className="custom-tags">{(customTags[conf.id] ?? []).map((tag) => <button key={tag} style={labelStyle(tag)} onClick={() => removeTag(conf.id, tag)} title={`Remove ${tag}`}>#{tag} ×</button>)}<form onSubmit={(event) => { event.preventDefault(); addTag(conf.id); }}><input aria-label={view === "decisions" ? `Assign student or label to ${conferenceDisplayName(conf)}` : `Add label to ${conferenceDisplayName(conf)}`} placeholder={view === "decisions" ? "Student / label…" : "Add label…"} value={tagDrafts[conf.id] ?? ""} onChange={(event) => setTagDrafts((current) => ({ ...current, [conf.id]: event.target.value }))} /><button type="submit" aria-label={view === "decisions" ? `Assign to ${conferenceDisplayName(conf)}` : `Add label to ${conferenceDisplayName(conf)}`}>+</button></form></div>}</div>
                <div className="timeline-rank">CORE {conf.rank}</div>
                <div className="deadline-track" aria-label={`${countdown.days} days until ${view === "decisions" ? "notification" : "submission"}`}><span className="track-fill" style={{ width: `${position}%` }} /><i style={{ left: `${position}%` }} /></div>
                <div className="timeline-count"><strong>{countdown.text}{conf.estimated ? " · EST." : ""}</strong><span>{conf.estimated ? "Estimated submit" : "Submit"} · {sourceDateLabel(conf.deadline)} · {conf.timezone}</span><span>{conf.estimated ? "Estimated notification" : "Notification"} · {conf.notification ? sourceDateLabel(conf.notification) : "TBA"}</span></div>
                <div className="timeline-actions"><button className={watchlistIds.includes(conf.id) ? "pin-button active" : "pin-button"} onClick={() => toggleWatchlist(conf.id)} aria-pressed={watchlistIds.includes(conf.id)}>{watchlistIds.includes(conf.id) ? (view === "watchlist" ? "Remove ×" : "Saved ✓") : "+ Watch"}</button><button className={decisionIds.includes(conf.id) ? "decision-button active" : "decision-button"} onClick={() => toggleDecision(conf.id)} aria-pressed={decisionIds.includes(conf.id)}>{decisionIds.includes(conf.id) ? (view === "decisions" ? "Remove ×" : "Awaiting ✓") : "+ Await"}</button><a href={conf.dblp} target="_blank" rel="noreferrer">DBLP</a>{conf.deadline && !conf.estimated && <a href={calendarHref(conf)} download={`${conf.id}.ics`}>iCal ↓</a>}</div>
              </article>;
            })}
            {!filtered.length && <div className="empty-state"><strong>{view === "watchlist" && !watchlistIds.length ? "Your watchlist is empty." : view === "decisions" && !decisionIds.length ? "No decisions are being tracked." : "No deadlines found."}</strong><span>{view === "watchlist" && !watchlistIds.length ? "Open All deadlines and select + Watch to add conferences." : view === "decisions" && !decisionIds.length ? "Open All deadlines and select + Await after submitting a paper." : "Reset the filters to restore the full queue."}</span>{view !== "deadlines" && !(view === "watchlist" ? watchlistIds.length : decisionIds.length) && <button className="empty-action" onClick={() => setView("deadlines")}>Browse all deadlines</button>}</div>}
          </div>

          <div className="axis-row"><span>Now</span><span>+60d</span><span>+120d</span><span>+180d</span><span>+240d</span></div>
          <footer><span>{view === "deadlines" ? `Source registry · ${filtered.length} shown · ${conferences.length} tracked deadlines · ${distinctConferenceCount} conferences` : view === "watchlist" ? `Personal watchlist · ${filtered.length} shown · ${watchlistIds.length} saved` : `Decision tracker · ${filtered.length} shown · ${decisionIds.length} pending`}</span><span>Updated 17 September 2026</span></footer>
        </section>
      </div>
    </main>
  );
}
