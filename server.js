const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// ── Config ───────────────────────────────────────────────────────────────────
const CALENDLY = 'https://calendly.com/nick-ncsystems/30min';

// ── Niche data ───────────────────────────────────────────────────────────────
// Fields per niche:
//   metrics[3]     – {value, label} shown in the ROI bar
//   reframeBody    – "Stop paying people..." paragraph (niche-specific)
//   services[4]    – {tag, title, body} 2×2 service grid (replaces old offers)
//   All other fields carry over from v1 (pains, howWorks, proofs, etc.)
const NICHES = {
  'tourism-hospitality': {
    name: 'Tourism & Hospitality',
    headline: "You're not missing bookings.",
    headlineBreak: "You're missing the ones that happen when you're not there.",
    heroSub: "Most tourism businesses don't have a marketing problem. They have a workflow problem — and workflow problems are expensive.",
    heroReframe: "We replace the manual, repetitive work your operation runs on with AI systems that run 24/7 and cost a fraction of the headcount doing it now.",
    heroNote: 'Built for tour operators, activity companies, charters, surf schools, and boutique hospitality teams.',
    heroCta: "I'll show you exactly where this is costing you",
    metrics: [
      { value: '10–30 hrs', label: 'saved per week on\ninbox, phones & follow-up' },
      { value: '20–40%', label: 'reduction in operational\ncosts after deployment' },
      { value: '24/7', label: 'guest response without\nadding headcount' },
    ],
    reframeHeadline: 'Stop paying people to do what AI should.',
    reframeBody: "Right now, someone — you or a staff member — is answering the same booking questions, sending the same confirmation emails, and manually handling follow-up that repeats every single day. That's not a staffing problem. It's an architecture problem. We fix the architecture.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'Someone messages you at night', body: 'You reply in the morning. They already booked. The gap between inquiry and response isn\'t hours — it\'s revenue.' },
      { title: 'Your inbox is full of the same questions', body: 'Pickup times, what to bring, where to park, what\'s included. Answered manually, one by one, every single day. That\'s payroll doing a machine\'s job.' },
      { title: 'The booking doesn\'t stop at the booking', body: 'Confirmations, reminders, pre-trip details, follow-up after the experience. All handled manually unless someone remembers. Most of the time, someone doesn\'t.' },
      { title: 'Busy season breaks everything', body: 'More inquiries, more questions, more follow-ups — and the same number of hours to handle them. You add staff or start dropping things. Neither is the right answer.' },
    ],
    painCallout: { strong: "You don't have a traffic problem.", p: 'You have a workflow problem. And every day you run it manually, it costs more than fixing it would.' },
    offersIntro: 'Not "AI" for the sake of it. Full replacement of the operational functions eating your time and payroll.',
    services: [
      { tag: 'Booking & Response', title: 'Every inquiry answered instantly', body: 'Any channel, any hour. Guests get real information and a path to booking — not a voicemail and a wait.' },
      { tag: 'Guest Communication', title: 'The full guest journey, automated', body: 'Confirmations, pre-trip details, day-of reminders, post-experience follow-up. None of it depends on someone remembering to send it.' },
      { tag: 'Operations', title: 'Crew, scheduling & seasonal load', body: 'Capacity management, crew notifications, weather-related rescheduling, waitlist management — the operational layer that runs in the background.' },
      { tag: 'Revenue', title: 'Systems that grow without growing headcount', body: 'Upsells, add-ons, rebooking prompts, review capture — every touchpoint that compounds revenue automatically.' },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: 'The goal is replacing the manual work line by line — until your operation runs without anyone touching the repetitive parts.' },
    authoritySignal: "This is almost always the first place we find the leak. And it's almost never a traffic problem.",
    howWorks: [
      { title: 'Discovery & audit', body: 'We map your operation to find exactly where time and money are being lost. Where are inquiries going cold? What\'s manual that shouldn\'t be? What\'s the real cost of the status quo?' },
      { title: 'Build & prove it', body: 'We build a working system tailored to your workflow. You see it run before any major commitment — not slides, not mockups. A live system handling real scenarios from your actual operation.' },
      { title: 'Deploy & scale', body: 'Live in 2–6 weeks. We stay engaged — optimizing performance, expanding what\'s automated, and making sure the system compounds in value over time.' },
    ],
    howWorksCallout: { strong: 'Everything that used to be manual runs in the background.' },
    proofs: [
      { strong: 'What operators usually underestimate', p: 'How many bookings are being lost between the first message and the first response — and how much payroll is going to repetitive tasks a system should handle.' },
      { strong: 'What happens when the workflow gets fixed', p: 'More inquiries convert, fewer people disappear, guest communication runs without anyone managing it, and the operation scales without adding staff.' },
      { strong: 'The real result', p: 'Same traffic. More bookings. Lower operational cost. A business that runs without you manually holding it together.' },
    ],
    microProof: "One tour operator was missing most of their after-hours inquiries and spending 15+ hours a week answering the same questions manually. After building an automated response and communication system, more inquiries converted and that time came back.",
    ctaHeadline: "I'll show you where you're losing money",
    ctaSub: "30 minutes. No pitch. I'll map your operation, find exactly where workflow is costing you, and show you what fixing it looks like — with real numbers.",
    ctaList: ['— where inquiries are falling off', '— what\'s being done manually that shouldn\'t be', '— what the fix costs vs. what the problem costs', '— what a live system would look like in your workflow'],
  },

  'health-fitness': {
    name: 'Health & Fitness',
    headline: "You're in a session.",
    headlineBreak: "Three people just DM'd about your pricing. One of them won't wait.",
    heroSub: "Most fitness businesses don't have a lead problem. They have a workflow problem — and it's costing them clients every single day.",
    heroReframe: "We replace the manual, repetitive work your business runs on so you can focus on coaching, not admin.",
    heroNote: 'Built for personal trainers, fitness studios, yoga instructors, online coaches, and gym owners.',
    heroCta: "I'll show you exactly where this is costing you",
    metrics: [
      { value: '15–25 hrs', label: 'saved per week on DMs,\nscheduling & admin' },
      { value: '30–50%', label: 'fewer no-shows and\ncold leads' },
      { value: '24/7', label: 'inquiry response without\nputting down the weights' },
    ],
    reframeHeadline: 'Stop paying people to do what AI should.',
    reframeBody: "You're answering the same DMs between sessions, manually coordinating scheduling, sending reminder texts, and following up on leads that went quiet — the same work repeating itself every week. That's time you should be spending coaching, sleeping, or scaling. We build the system that handles it.",
    painLabel: "What's actually happening",
    pains: [
      { title: "Someone DMs while you're coaching", body: "You're fully present with a client. Three people ask about your packages. By the time you're free, two of them signed up with whoever responded in 20 minutes." },
      { title: 'Scheduling eats hours you could be billing', body: 'Back-and-forth to find a time, confirm, remind, follow up after a no-show. None of this is coaching. None of it makes you money.' },
      { title: 'The same questions, over and over', body: 'Pricing, class times, what to bring, what to expect. Answered from memory across Instagram, email, and text every single day — by you.' },
      { title: 'New leads go cold between inquiry and first session', body: 'Someone expresses interest. A day passes with no follow-up. They signed up with someone who had a system.' },
    ],
    painCallout: { strong: "You don't have a lead problem.", p: 'You have a workflow problem. The leads are there — they\'re just slipping through gaps that should be automated.' },
    offersIntro: 'Not complicated systems. Full replacement of the admin work that repeats itself every week.',
    services: [
      { tag: 'Lead & Inquiry', title: 'Every prospect answered instantly', body: 'DMs, emails, website forms — any channel, any hour. They get pricing, availability, and a path to booking before the interest fades.' },
      { tag: 'Scheduling', title: 'Bookings without the back-and-forth', body: 'Clients self-schedule, confirm, and reschedule without calling or waiting. Your calendar fills without you managing it.' },
      { tag: 'Client Management', title: 'The full client experience, automated', body: 'Onboarding, prep instructions, reminders, check-ins — none of it requires you to remember to send it.' },
      { tag: 'Revenue', title: 'Systems that compound', body: 'Rebooking prompts, referral requests, package upsells — sent to the right client at the right moment, automatically.' },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: "The goal is simple: no lead disappears because you were busy coaching, and no admin task requires you to do it manually." },
    authoritySignal: "This is almost always the first place we find the leak in fitness businesses. It's almost never a lead volume problem.",
    howWorks: [
      { title: 'Discovery & audit', body: 'We map your workflow to find exactly where time is being lost. Where are leads going cold? What admin repeats itself? What does fixing it actually cost vs. what does leaving it cost?' },
      { title: 'Build & prove it', body: 'We build a working system around your actual workflow. You see it handling real scenarios before any major commitment — not a pitch deck.' },
      { title: 'Deploy & scale', body: 'Live in 2–6 weeks. We stay engaged, refining the system as your business grows.' },
    ],
    howWorksCallout: { strong: 'Everything that used to fall through the cracks runs in the background.' },
    proofs: [
      { strong: 'What fitness pros usually underestimate', p: 'How many leads go quiet between the first DM and the first reply — and how much scheduling admin actually costs per week.' },
      { strong: 'What changes when the workflow gets fixed', p: 'More inquiries convert, fewer no-shows, less time spent on back-and-forth that a system should be handling.' },
      { strong: 'The real result', p: 'Same leads. More clients. Less time on everything that isn\'t coaching.' },
    ],
    microProof: "One personal trainer was losing leads to delayed DM responses during sessions and spending hours a week on scheduling back-and-forth. After automating both, more conversations turned into booked sessions and the admin time came back.",
    ctaHeadline: "I'll show you where you're losing clients",
    ctaSub: "30 minutes. No pitch. I'll map your workflow, find exactly where leads and time are slipping, and show you what fixing it looks like.",
    ctaList: ['— where inquiries are going cold', '— what admin should be automated', '— what the fix costs vs. what the problem costs', '— how it fits into your actual workflow'],
  },

  'real-estate': {
    name: 'Real Estate',
    headline: "You're not losing deals to better agents.",
    headlineBreak: "You're losing them to faster ones.",
    heroSub: "Most agents don't have a lead quality problem. They have a workflow problem — and it's giving deals to whoever has a system.",
    heroReframe: "We replace the manual follow-up, intake, and scheduling work so every lead gets a real response before they move on.",
    heroNote: 'Built for independent agents, small teams, and brokerages managing high inquiry volume.',
    heroCta: "I'll show you exactly where this is costing you",
    metrics: [
      { value: '10–20 hrs', label: 'saved per week on follow-up,\nscheduling & intake' },
      { value: '20–35%', label: 'more leads converted\nwith consistent follow-up' },
      { value: '24/7', label: 'response so you\'re first,\nnot just fastest' },
    ],
    reframeHeadline: 'Stop paying people to do what AI should.',
    reframeBody: "You're spending hours — or paying an assistant — to follow up on leads that went quiet, answer the same neighborhood questions, coordinate showing schedules, and collect intake that starts from scratch every time. Every part of that is automatable. Every hour it runs manually is another lead going to whoever has a system.",
    painLabel: "What's actually happening",
    pains: [
      { title: "Leads come in while you're showing", body: "You're at a showing or on a call. A form comes in. By the time you're free, they've already scheduled with two other agents." },
      { title: 'Follow-up is inconsistent', body: "When you're busy, leads wait. Some get five touchpoints. Others sit in your CRM untouched for a week. The ones that wait usually don't come back." },
      { title: "You're answering the same questions constantly", body: 'Neighborhoods, timelines, process, pricing ranges — manually, across email and phone, for every single inquiry. That\'s not billable work.' },
      { title: 'Some leads never get a real first response', body: "They came in at the wrong time. No one got back before the window closed. The listing goes to someone who was faster." },
    ],
    painCallout: { strong: "You don't have a lead quality problem.", p: "The lead was ready. You just weren't first. And first is a system problem, not a hustle problem." },
    offersIntro: "Not a CRM. Full replacement of the manual work that sits between an inquiry and a signed contract.",
    services: [
      { tag: 'Lead Response', title: 'Every inquiry captured instantly', body: 'Budget, timeline, property type collected before you see the lead. Any form, any hour — you\'re always the first to respond.' },
      { tag: 'Follow-Up', title: 'Consistent follow-up that never drops', body: 'Every lead gets the same cadence regardless of how busy the week gets. Nothing sits untouched in your CRM.' },
      { tag: 'Scheduling', title: 'Showings book themselves', body: 'Qualified leads pick a time and it lands on your calendar. No phone tag, no back-and-forth, no coordination overhead.' },
      { tag: 'Operations', title: 'Intake and admin, automated', body: 'Document collection, onboarding packets, common question responses — handled automatically so you arrive ready to work.' },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: "The goal is simple: no lead goes cold because no one got back in time, and no hour gets spent on work a system should be doing." },
    authoritySignal: "This is almost always the first place we find the leak. It's almost never a lead quality problem.",
    howWorks: [
      { title: 'Discovery & audit', body: 'We map your workflow to find exactly where leads go cold and where time gets wasted. What\'s the real cost of slow follow-up? What admin repeats every week?' },
      { title: 'Build & prove it', body: 'We build a working system around your actual pipeline. You see it handling real lead scenarios before any major commitment.' },
      { title: 'Deploy & scale', body: 'Live in 2–6 weeks. We stay engaged as your volume grows.' },
    ],
    howWorksCallout: { strong: 'Everything that used to depend on timing runs in the background.' },
    proofs: [
      { strong: 'What agents usually underestimate', p: 'How many leads go cold in the first hour — not the first day. And how much weekly admin could be running automatically.' },
      { strong: 'What changes when the workflow gets fixed', p: 'More inquiries convert, more showings get booked, and follow-up stops depending on whether you had a slow week or a busy one.' },
      { strong: 'The real result', p: 'Same leads. More closings. Less time on everything that isn\'t selling.' },
    ],
    microProof: "One agent was getting web leads overnight but responding the next morning — and spending hours a week on follow-up and intake. After automating both, more overnight leads converted and the admin time came back.",
    ctaHeadline: "I'll show you where you're losing deals",
    ctaSub: "30 minutes. No pitch. I'll map your pipeline, find where leads are going cold, and show you what a system looks like in your actual workflow.",
    ctaList: ['— where leads are going cold', '— what follow-up and intake should be automated', '— what the fix costs vs. what the problem costs', '— how it fits your current setup'],
  },

  'restaurants-food': {
    name: 'Restaurants & Food',
    headline: "Your team is mid-service.",
    headlineBreak: "The phone is ringing. Someone will hang up.",
    heroSub: "Most restaurants don't have a foot traffic problem. They have a workflow problem — and it's costing them covers every single day.",
    heroReframe: "We replace the manual reservation handling, phone calls, and repetitive guest questions so your team can stay on the floor.",
    heroNote: 'Built for independent restaurants, fine dining, fast casual, catering operations, and food & beverage teams.',
    heroCta: "I'll show you exactly where this is costing you",
    metrics: [
      { value: '10–20 hrs', label: 'saved per week on calls,\nquestions & follow-up' },
      { value: '$300–600/mo', label: 'in labor redirected\nfrom repetitive tasks' },
      { value: '24/7', label: 'reservation capture when\nguests actually decide' },
    ],
    reframeHeadline: 'Stop paying people to do what AI should.',
    reframeBody: "Every day, someone on your team answers the same phone calls, replies to the same reservation requests, handles the same dietary restriction questions, and texts the same reminders. That's labor doing a system's job. We build the system so your team can focus on the floor.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'The phone rings during a rush', body: "Your team is plating. The phone won't stop. Either service suffers or the call does — and both cost you." },
      { title: 'After-hours bookings go to voicemail', body: "Guests decide where to eat at 9 or 10pm. Your voicemail doesn't close tables. Whoever responds does." },
      { title: 'The same menu questions flood your inbox', body: 'Dietary restrictions, allergy questions, what\'s included — answered manually, one by one, every single day by someone you\'re paying hourly.' },
      { title: 'No-shows cost you real revenue', body: 'Empty slots at peak time that could have been filled. The reminder wasn\'t sent because someone forgot, or was busy, or wasn\'t working that day.' },
    ],
    painCallout: { strong: "You don't have a marketing problem.", p: "The table was available. No one answered to book it — and that's a systems problem." },
    offersIntro: 'Not software for the sake of it. Full replacement of the manual work between a guest and a confirmed table.',
    services: [
      { tag: 'Reservations', title: 'Bookings handled without staff', body: 'Any channel, any hour. Guests confirm a table without your team picking up the phone or manually checking availability.' },
      { tag: 'Guest Inquiries', title: 'Menu, allergy & policy questions answered instantly', body: 'The same questions your team fields 20 times a day — handled automatically, every time, consistently accurate.' },
      { tag: 'Retention', title: 'No-shows drop. Regulars return.', body: 'Automated reminders before every reservation. Post-visit follow-up and rebooking prompts that run without anyone managing them.' },
      { tag: 'Revenue', title: 'After-hours revenue, captured', body: 'The guest deciding where to eat at 10pm gets a response and a confirmed table. That revenue used to disappear with the voicemail.' },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: "The goal is simple: every table that should be filled is filled, and your team stays on the floor." },
    authoritySignal: "This is almost always the first place we find the leak. It's almost never a foot traffic problem.",
    howWorks: [
      { title: 'Discovery & audit', body: 'We map your operation to find where covers are being lost and where labor is being spent on work a system should handle.' },
      { title: 'Build & prove it', body: 'We build a working reservation and communication system around your actual workflow. You see it run before any commitment.' },
      { title: 'Deploy & scale', body: 'Live in 2–6 weeks. We stay engaged as volume grows.' },
    ],
    howWorksCallout: { strong: 'Everything that used to depend on someone answering the phone runs in the background.' },
    proofs: [
      { strong: 'What operators usually underestimate', p: 'How many covers are lost between the after-hours inquiry and the next morning\'s response — and how much labor goes to answering the same questions every day.' },
      { strong: 'What changes when the workflow gets fixed', p: "More tables filled, fewer no-shows, and your team stays focused on service instead of the phone." },
      { strong: 'The real result', p: 'Same traffic. More revenue. Labor redirected to work that actually needs people.' },
    ],
    microProof: "One restaurant had no system for after-hours reservation requests and was fielding the same menu questions manually every day. After automating both, more after-hours inquiries converted to covers and the team stayed on the floor.",
    ctaHeadline: "I'll show you where you're losing covers",
    ctaSub: "30 minutes. No pitch. I'll map your operation and show you where revenue is slipping and what a system looks like in your workflow.",
    ctaList: ['— where reservations are falling off', '— what labor should be replaced by automation', '— what the fix costs vs. what the problem costs', '— how it works in your actual operation'],
  },

  'home-services': {
    name: 'Home Services',
    headline: 'The call you missed at 9pm',
    headlineBreak: "is a job your competitor starts tomorrow.",
    heroSub: "Most home service businesses don't have a workload problem. They have a workflow problem — and it's giving jobs to whoever picks up first.",
    heroReframe: "We replace the manual intake, dispatch, and follow-up work so every job request gets captured and routed — even when you're on a roof.",
    heroNote: 'Built for plumbers, HVAC techs, electricians, roofers, landscapers, and home service operators.',
    heroCta: "I'll show you exactly where this is costing you",
    metrics: [
      { value: '10–25 hrs', label: 'saved per week on intake,\ndispatch & follow-up' },
      { value: '20–35%', label: 'more jobs won from\nexisting call volume' },
      { value: '24/7', label: 'after-hours job capture\nbefore competitors respond' },
    ],
    reframeHeadline: 'Stop paying people to do what AI should.',
    reframeBody: "You're either doing it yourself or paying someone to answer calls, log job details, send quote follow-ups, and coordinate crews — the same process every single day. That's operational overhead a system should be running. We build the system.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'After-hours emergencies go to voicemail', body: 'Burst pipe. AC out in July. Downed tree. The homeowner calls every number they find. The one who responds gets the job — and it\'s almost never the one who sent them to voicemail.' },
      { title: 'On-site quotes eat your week', body: "Drive out. Assess. Quote. Follow up. Half don't convert. You burned a morning for nothing, and the estimate just sits there until someone remembers to call back." },
      { title: 'Peak season breaks your intake', body: 'Storm rolls through. 40 calls in two days. Your phone rings off the hook and jobs start falling through the cracks — the ones that slip are the ones going to your competitor.' },
      { title: 'Some jobs never make it to your calendar', body: "The request came in while you were on a roof. Nobody followed up. The customer didn't wait — they found someone who did." },
    ],
    painCallout: { strong: "You don't have a workload problem.", p: "The work is out there. You're just not capturing all of it — and the gap is a systems problem." },
    offersIntro: "Not complicated software. Full replacement of the manual intake and dispatch work that leaks jobs every week.",
    services: [
      { tag: 'Job Capture', title: 'Every request captured, any hour', body: 'After-hours calls, texts, web forms — job details collected automatically before you\'re available to respond. Nothing slips overnight.' },
      { tag: 'Intake & Quoting', title: 'Customers describe the job before you arrive', body: 'Photos, location, issue description collected automatically. You show up to close, not to assess from scratch.' },
      { tag: 'Dispatch & Routing', title: 'Jobs assigned without manual coordination', body: 'Requests triaged by urgency, routed to the right crew, confirmation sent to the customer — without anyone touching it.' },
      { tag: 'Follow-Up', title: 'Estimates get followed up automatically', body: 'Quotes that don\'t get a response get a nudge. Jobs don\'t fall off because someone forgot to call back.' },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: "The goal is simple: no job slips because you were on a job — and no estimate disappears because no one followed up." },
    authoritySignal: "This is almost always the first place we find the leak. It's almost never a shortage of work.",
    howWorks: [
      { title: 'Discovery & audit', body: 'We map your intake process to find where jobs are being lost and where manual work is eating your week. What\'s the real cost of the calls you\'re not capturing?' },
      { title: 'Build & prove it', body: 'We build a working capture, routing, and follow-up system around your actual operation. You see it handling real job requests before any commitment.' },
      { title: 'Deploy & scale', body: 'Live in 2–6 weeks. Peak season doesn\'t break a system — it\'s built for volume.' },
    ],
    howWorksCallout: { strong: "Everything that used to depend on you being available runs in the background." },
    proofs: [
      { strong: 'What operators usually underestimate', p: 'How many jobs are lost between the after-hours call and the next morning\'s callback — and how much time goes to quotes that never convert.' },
      { strong: 'What changes when capture improves', p: "More jobs won from the same call volume, less time on-site for quotes that don't close, and peak season stops breaking the system." },
      { strong: 'The real result', p: 'Same call volume. More jobs won. Less work falling through the cracks.' },
    ],
    microProof: "One home service operator was missing after-hours calls and spending hours a week on quote follow-up that went nowhere. After capturing requests automatically and adding follow-up sequences, more of those converted to booked jobs.",
    ctaHeadline: "I'll show you where you're losing jobs",
    ctaSub: "30 minutes. No pitch. I'll map your intake process and show you exactly where jobs are slipping and what a system looks like in your operation.",
    ctaList: ['— where after-hours requests are going unanswered', '— what intake and dispatch should be automated', '— what the fix costs vs. what the problem costs', '— how it fits into your current operation'],
  },

  'beauty-wellness': {
    name: 'Beauty & Wellness',
    headline: "You're booked solid.",
    headlineBreak: "Someone just DM'd. You can't do both.",
    heroSub: "Most beauty and wellness businesses don't have a visibility problem. They have a workflow problem — and it's costing them clients they already have.",
    heroReframe: "We replace the manual DM responses, booking back-and-forth, and reminder texts so your chair stays full without interrupting your work.",
    heroNote: 'Built for hair stylists, estheticians, nail techs, massage therapists, and independent wellness practitioners.',
    heroCta: "I'll show you exactly where this is costing you",
    metrics: [
      { value: '8–15 hrs', label: 'saved per week on DMs,\nscheduling & admin' },
      { value: '30–50%', label: 'fewer no-shows with\nautomated reminders' },
      { value: '24/7', label: 'booking capability while\nyou\'re in the chair' },
    ],
    reframeHeadline: 'Stop paying for clients you never actually book.',
    reframeBody: "You're answering DMs between clients, manually confirming appointments, texting reminders, and following up on no-shows — the same work repeating itself every single week. That's time in the chair you're not getting back. We automate the cycle so you can focus on the work that pays.",
    painLabel: "What's actually happening",
    pains: [
      { title: "Booking requests come in while you're in the chair", body: "You're mid-service. Your phone is buzzing. You either stop what you're doing or you lose the client — and often it's both." },
      { title: 'No-shows cost you real money', body: "Every empty slot is revenue you can't recover. Manual reminder texts aren't cutting it — because they depend on you remembering to send them." },
      { title: "Instagram is your biggest lead source — and the hardest to manage", body: "DMs asking about availability, pricing, what's included. You can't respond from the chair. So you don't. And they book somewhere that did." },
      { title: 'Back-and-forth to book takes longer than it should', body: 'Finding a time, confirming, sending prep instructions — done manually, for every single client, every single week.' },
    ],
    painCallout: { strong: "You don't have a marketing problem.", p: "They were already interested. They just booked someone who replied — and that's a systems problem, not a hustle problem." },
    offersIntro: "Not complicated systems. Full automation of the admin cycle that repeats itself every week.",
    services: [
      { tag: 'DM Response', title: 'Every message answered instantly', body: 'Availability, pricing, what to expect — handled automatically while you\'re mid-service. Clients get what they need and a path to booking.' },
      { tag: 'Scheduling', title: 'Appointments book without your involvement', body: 'Clients pick a slot, confirm, and receive prep instructions — without a single back-and-forth text from you.' },
      { tag: 'Retention', title: 'No-shows drop. Clients rebook.', body: '48-hour and 2-hour reminders before every appointment. Post-visit rebooking prompts that keep your calendar full forward.' },
      { tag: 'Revenue', title: 'Revenue that runs in the background', body: 'Upsells, seasonal offers, referral prompts — sent to the right client at the right moment, automatically.' },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: "The goal is simple: your chair stays full and your focus stays on the client in front of you — not the phone in your pocket." },
    authoritySignal: "This is almost always the first place we find the leak. It's almost never a visibility problem.",
    howWorks: [
      { title: 'Discovery & audit', body: 'We map your booking and communication workflow to find where clients are slipping and where your week is going to admin that should be automatic.' },
      { title: 'Build & prove it', body: 'We build a working DM response, booking, and retention system around your actual schedule. You see it handling real client scenarios before any commitment.' },
      { title: 'Deploy & scale', body: 'Live in 2–6 weeks. Your calendar fills. The admin stops.' },
    ],
    howWorksCallout: { strong: 'Everything that used to interrupt your day runs in the background.' },
    proofs: [
      { strong: 'What practitioners usually underestimate', p: "How many clients book elsewhere because no one responded to their DM in time — and how many hours a week go to admin that should be automatic." },
      { strong: 'What changes when the workflow gets fixed', p: "Fewer no-shows, more bookings from DMs that used to go cold, and less time spent on back-and-forth that a system should be handling." },
      { strong: 'The real result', p: 'Same clientele. Fuller calendar. Time back that was going to admin.' },
    ],
    microProof: "One stylist was getting regular DM inquiries that went unanswered during appointments and spending hours a week on scheduling back-and-forth. After automating both, more DMs turned into booked slots and the admin time disappeared.",
    ctaHeadline: "I'll show you where you're losing bookings",
    ctaSub: "30 minutes. No pitch. I'll map your booking workflow and show you where clients are slipping and what fixing it actually looks like.",
    ctaList: ['— where DMs are going unanswered', '— what admin should be automated', '— what the fix costs vs. what the problem costs', '— how it fits into your current workflow'],
  },

  'professional-services': {
    name: 'Professional Services',
    headline: "Every hour you spend on intake",
    headlineBreak: "is an hour you're not billing.",
    heroSub: "Most professional services firms don't have a pipeline problem. They have a workflow problem — and it's eating billable hours every week.",
    heroReframe: "We replace the manual qualification, intake, and scheduling work so every hour you work is an hour worth your rate.",
    heroNote: 'Built for attorneys, accountants, financial advisors, consultants, and professional services firms.',
    heroCta: "I'll show you exactly where this is costing you",
    metrics: [
      { value: '10–20 hrs', label: 'saved per week on intake,\ndiscovery & admin' },
      { value: 'Better-fit', label: 'clients only — unqualified\nleads filter themselves out' },
      { value: '24/7', label: 'intake so no prospect\ngoes cold overnight' },
    ],
    reframeHeadline: 'Stop paying people to do what AI should.',
    reframeBody: "Every week, hours go to discovery calls that don't convert, intake processes that start from scratch for every client, and scheduling coordination that repeats the same steps every time. Those hours are billable. A system should be handling them. We build the system.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'Unqualified leads take your best hours', body: "45-minute discovery calls with people who can't afford you or aren't the right fit. It happens weekly. At your rate, that's hundreds of dollars gone every time." },
      { title: 'Intake is still email threads and PDFs', body: 'Collecting the same information manually, through back-and-forth email, before you can do any real work — for every new client, every time.' },
      { title: 'After-hours prospects go cold fast', body: "Someone reaches out at 9pm ready to hire. You see it the next morning. They've already signed with someone who replied in an hour." },
      { title: 'Your calendar fills with low-value conversations', body: "Time that should be billed gets spent on calls that shouldn't be happening at all." },
    ],
    painCallout: { strong: "You don't have a pipeline problem.", p: "The prospect moved on while you were billing someone else — and that's a systems problem, not a capacity problem." },
    offersIntro: "Not a CRM. Full replacement of the manual work between an inquiry and a billable engagement.",
    services: [
      { tag: 'Qualification', title: 'Unqualified leads never reach you', body: 'Scope, budget, timeline, and urgency collected before you see the lead. You only get on calls with people worth your time.' },
      { tag: 'Intake', title: 'Client onboarding runs before the first meeting', body: 'New clients complete your full intake process automatically. You arrive with a complete brief, not a blank form.' },
      { tag: 'Scheduling', title: 'Consultations book themselves', body: 'Qualified prospects schedule directly into your calendar. No coordination, no back-and-forth, no admin involved.' },
      { tag: 'Follow-Up', title: "After-hours prospects don't go cold", body: 'Inquiries at 9pm get an immediate response and a clear path forward — before they sign with whoever replied first.' },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: "The goal is simple: every hour you work is an hour worth your rate — and no lead goes cold because no one responded in time." },
    authoritySignal: "This is almost always the first place we find the leak. It's almost never a pipeline problem.",
    howWorks: [
      { title: 'Discovery & audit', body: 'We map your intake and qualification process to find where billable time is going and where leads are slipping overnight.' },
      { title: 'Build & prove it', body: 'We build a working qualification, intake, and scheduling system around your actual workflow. You see it handling real client scenarios before any commitment.' },
      { title: 'Deploy & scale', body: 'Live in 2–6 weeks. The right clients reach you. The wrong ones don\'t.' },
    ],
    howWorksCallout: { strong: 'Everything that used to eat your billable time runs in the background.' },
    proofs: [
      { strong: 'What professionals usually underestimate', p: 'How many hours per week go to intake, scheduling, and discovery calls that don\'t convert — and what those hours are actually worth.' },
      { strong: 'What changes when qualification improves', p: "Better-fit clients, faster onboarding, and time back that was going to conversations that shouldn't have happened." },
      { strong: 'The real result', p: 'Same leads. More revenue. Less time on the wrong work.' },
    ],
    microProof: "One firm was spending several hours a week on discovery calls that didn't convert and intake that started from scratch every time. After automating qualification and onboarding, the calls that remained were substantially better fits and clients arrived ready to start.",
    ctaHeadline: "I'll show you where you're losing billable time",
    ctaSub: "30 minutes. No pitch. I'll map your intake process and show you exactly where hours are going and what a system looks like in your workflow.",
    ctaList: ["— where unqualified leads are eating your schedule", "— what intake and qualification should look like", "— what the fix costs vs. what the problem costs", "— how it fits your existing workflow"],
  },

  'ecommerce-retail': {
    name: 'E-commerce & Retail',
    headline: "Seventy percent of your shoppers leave without buying.",
    headlineBreak: "Most of them could have been saved.",
    heroSub: "Most e-commerce stores don't have a traffic problem. They have a workflow problem — and it's leaving revenue on the table from every visit.",
    heroReframe: "We replace the manual follow-up, support, and post-purchase work so your existing traffic converts at a higher rate.",
    heroNote: 'Built for Shopify stores, DTC brands, online retailers, and e-commerce operators.',
    heroCta: "I'll show you exactly where this is costing you",
    metrics: [
      { value: '15–30%', label: 'more revenue from\nexisting traffic' },
      { value: '40–60%', label: 'fewer support tickets\nwith automated answers' },
      { value: '24/7', label: 'customer service without\nadding headcount' },
    ],
    reframeHeadline: 'Stop paying people to do what AI should.',
    reframeBody: "Your support team answers the same order and product questions hundreds of times a week. Cart abandonment sequences run inconsistently. Post-purchase follow-up depends on someone managing it manually. That's revenue leaking from systems that should be automatic. We build the systems.",
    painLabel: "What's actually happening",
    pains: [
      { title: "Cart abandonment is your biggest leak", body: "70% of shoppers add to cart and leave. Most of them intended to buy. They just got distracted — and a well-timed follow-up would have brought them back." },
      { title: "Customer service doesn't scale with volume", body: "Order status, return questions, product specs — your team answers the same things hundreds of times a week. That's labor doing a machine's job." },
      { title: 'Browsers leave with no follow-up', body: "They spent 8 minutes on your site, didn't buy, and left. No capture. No second chance. That traffic cost you money and you got nothing back." },
      { title: 'Post-purchase is inconsistent', body: "Shipping updates, review requests, reorder prompts — handled when someone remembers to do it, or not at all." },
    ],
    painCallout: { strong: "You don't have a traffic problem.", p: "The shopper was ready to buy. The window closed before you followed up — and that's a systems problem." },
    offersIntro: "Not complicated software. Full replacement of the manual work between a visit and a repeat customer.",
    services: [
      { tag: 'Cart Recovery', title: 'Abandoned carts get followed up automatically', body: 'Timed sequences sent when shoppers are most likely to return — personalized to exactly what they left behind.' },
      { tag: 'Customer Service', title: 'Questions answered 24/7 without tickets', body: 'Order status, returns, product specs, policies — handled instantly without a human involved. Your team handles what actually needs judgment.' },
      { tag: 'Capture', title: 'Browsers get a second chance', body: 'Exit intent, browse abandonment, email capture — systems that give you another shot at traffic you already paid for.' },
      { tag: 'Post-Purchase', title: 'Every post-purchase moment automated', body: 'Confirmations, shipping updates, review requests, reorder prompts — none of it depends on anyone on your team managing it.' },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: "The goal is simple: the traffic you're already paying for converts at a higher rate and buys again." },
    authoritySignal: "This is almost always the first place we find the leak. It's almost never a traffic problem.",
    howWorks: [
      { title: 'Discovery & audit', body: 'We map your funnel to find where shoppers are dropping off and where your team is spending time on questions a system should answer.' },
      { title: 'Build & prove it', body: 'We build a working recovery, support, and post-purchase system around your actual store. You see it handling real scenarios before any commitment.' },
      { title: 'Deploy & scale', body: 'Live in 2–6 weeks. More of the traffic you\'re already paying for converts.' },
    ],
    howWorksCallout: { strong: 'Everything that used to require a team member runs in the background.' },
    proofs: [
      { strong: 'What store owners usually underestimate', p: 'How much revenue is sitting in abandoned carts — and how much support labor goes to questions a system could be answering.' },
      { strong: 'What changes when the workflow gets fixed', p: "Higher conversion rate, fewer support tickets, and more repeat purchases from customers who already trust you." },
      { strong: 'The real result', p: 'Same traffic. More revenue. Support team focused on what actually needs them.' },
    ],
    microProof: "One store had significant cart abandonment and a support team fielding the same questions all day. After adding automated recovery sequences and an instant-response layer, cart conversion improved and support volume dropped.",
    ctaHeadline: "I'll show you where you're losing revenue",
    ctaSub: "30 minutes. No pitch. I'll map your funnel, find where shoppers are dropping off, and show you what fixing it looks like.",
    ctaList: ["— where cart abandonment is costing you most", "— what support work should be automated", "— what the fix costs vs. what the problem costs", "— how it works in your actual store"],
  },

  'auto-dealerships': {
    name: 'Auto & Dealerships',
    headline: "Shoppers research at midnight.",
    headlineBreak: "Your website form sits there. They've booked a test drive somewhere else by morning.",
    heroSub: "Most dealerships don't have a traffic problem. They have a workflow problem — and it's giving sales to whoever responds first.",
    heroReframe: "We replace the manual lead response, service scheduling, and follow-up work so no lead waits long enough to call a competitor.",
    heroNote: 'Built for independent dealers, franchise dealerships, and automotive groups managing web leads.',
    heroCta: "I'll show you exactly where this is costing you",
    metrics: [
      { value: '20–40%', label: 'more web leads converted\nwith immediate response' },
      { value: '10–20 hrs', label: 'saved per week on phones,\nfollow-up & scheduling' },
      { value: '24/7', label: 'lead response before\nthe competitor calls' },
    ],
    reframeHeadline: 'Stop paying people to do what AI should.',
    reframeBody: "Leads come in overnight and sit until morning. Service scheduling happens over the phone. Follow-up depends on who's working and how busy they are. Every part of that is processable and automatable — and every day it runs manually, another batch of leads goes to whoever responded first.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'Night-shift web traffic goes nowhere', body: "9pm to midnight is your highest-traffic window. No one's responding. Shoppers submit a form and move on to whoever answers." },
      { title: 'The service line is always backed up', body: "Customers on hold. Staff tied up. Scheduling calls burning time that should be on the floor closing deals." },
      { title: "Lead follow-up depends on who's working", body: "Hot lead on a slow Tuesday gets called back in 20 minutes. Same lead on a busy Saturday is still sitting there Monday." },
      { title: 'Web form leads go cold overnight', body: "They submitted a form ready to come in. By morning, they've scheduled a test drive at a competitor who responded that same night." },
    ],
    painCallout: { strong: "You don't have a traffic problem.", p: "The form was filled out. No one called before the competitor did — and that's a systems problem." },
    offersIntro: "Not a CRM. Full replacement of the manual work between a web inquiry and a showroom visit.",
    services: [
      { tag: 'Lead Response', title: 'Every web lead answered immediately', body: 'Vehicle interest, budget, trade-in, timeline collected before your team sees it. Day or night, no exceptions.' },
      { tag: 'Service Scheduling', title: 'Appointments book without phone calls', body: 'Customers schedule, confirm, and reschedule online. Your advisors stay on the floor. Your phones free up.' },
      { tag: 'Follow-Up', title: 'Lead cadence that doesn\'t depend on who\'s working', body: 'Every lead gets consistent touchpoints — busy Saturday or slow Tuesday, the system runs the same way.' },
      { tag: 'Intelligence', title: 'Your team walks in briefed', body: 'Hot lead summaries with vehicle interest and budget waiting for your team before they arrive. No digging through the CRM.' },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: "The goal is simple: no lead waits long enough to call your competitor, and your team spends their time selling — not scheduling." },
    authoritySignal: "This is almost always the first place we find the leak. It's almost never a traffic or inventory problem.",
    howWorks: [
      { title: 'Discovery & audit', body: 'We map your lead flow to find where web leads are going cold and where staff time is going to work a system should be handling.' },
      { title: 'Build & prove it', body: 'We build a working response, scheduling, and follow-up system around your actual operation. You see it handling real lead scenarios before any commitment.' },
      { title: 'Deploy & scale', body: 'Live in 2–6 weeks. Overnight leads stop going cold. Your team focuses on selling.' },
    ],
    howWorksCallout: { strong: "Everything that used to depend on who was working runs in the background." },
    proofs: [
      { strong: 'What dealerships usually underestimate', p: 'How many web leads go cold overnight simply because no one responded before the competitor did — and how much staff time goes to scheduling and follow-up.' },
      { strong: 'What changes when the workflow gets fixed', p: "More test drives booked, more service appointments filled, and follow-up that runs the same way regardless of volume or staffing." },
      { strong: 'The real result', p: 'Same traffic. More sales. Your team on the floor instead of the phone.' },
    ],
    microProof: "One dealership was getting consistent web leads overnight with no system to respond until the next morning. After automating the first response and follow-up cadence, more overnight leads converted to showroom visits.",
    ctaHeadline: "I'll show you where you're losing sales",
    ctaSub: "30 minutes. No pitch. I'll map your lead flow and show you exactly where leads are going cold and what a system looks like in your operation.",
    ctaList: ["— where overnight leads are disappearing", "— what follow-up and scheduling should be automated", "— what the fix costs vs. what the problem costs", "— how it works with your current setup"],
  },

  'education-tutoring': {
    name: 'Education & Tutoring',
    headline: "A parent's interest lasts about 72 hours.",
    headlineBreak: "After that, they've enrolled somewhere else.",
    heroSub: "Most education businesses don't have a demand problem. They have a workflow problem — and families who don't hear back quickly don't wait to find out.",
    heroReframe: "We replace the manual inquiry response, follow-up, and enrollment work so every family gets a real answer before they move on.",
    heroNote: 'Built for tutoring centers, online educators, learning programs, test prep companies, and independent instructors.',
    heroCta: "I'll show you exactly where this is costing you",
    metrics: [
      { value: '12–20 hrs', label: 'saved per week on inquiry,\nenrollment & admin' },
      { value: '25–40%', label: 'more inquiries converted\nwith consistent follow-up' },
      { value: '24/7', label: 'response in the critical\n72-hour decision window' },
    ],
    reframeHeadline: 'Stop paying people to do what AI should.',
    reframeBody: "Inquiry emails get answered manually. Enrollment paperwork runs through email threads. Follow-up depends on someone remembering to send it. Every family asking the same questions takes the same amount of time. That's operational overhead your competitors are already automating — and the families who don't hear back quickly don't wait to find out.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'Inquiries sit unanswered for a day or two', body: "A family reaches out Tuesday. You respond Friday. They enrolled Thursday. That's the pace you're competing against — and it's a workflow problem, not a capacity problem." },
      { title: 'The same program questions repeat endlessly', body: "Curriculum, schedule, prerequisites, pricing, placement — every family asks the same things. You answer them manually, one at a time, for every single inquiry." },
      { title: 'Enrollment is still a manual process', body: "Application, assessment, onboarding packet — done through email threads, by hand, for every student. That's admin time that shouldn't exist." },
      { title: 'Good leads go cold between inquiry and commitment', body: "Someone expresses interest. Three days pass with no follow-up. They enrolled somewhere that stayed in touch." },
    ],
    painCallout: { strong: "You don't have a demand problem.", p: "The family was ready to enroll. They just enrolled somewhere that replied first — and that's a systems problem." },
    offersIntro: "Not complicated systems. Full replacement of the manual work between an inquiry and an enrolled student.",
    services: [
      { tag: 'Inquiry Response', title: 'Every family gets an instant answer', body: 'Program info, pricing, scheduling, fit assessment — handled automatically. No waiting for a business-hours reply.' },
      { tag: 'Follow-Up', title: 'Nurture that converts', body: 'Every inquiry gets consistent touchpoints until they enroll or opt out. Nothing falls through between the first message and the decision.' },
      { tag: 'Enrollment', title: 'Paperwork runs itself', body: 'Applications, assessments, onboarding materials — collected and processed automatically. Admin overhead stays flat as you grow.' },
      { tag: 'Retention', title: 'Students stay. Families refer.', body: 'Progress updates, rebooking prompts, referral requests — sent automatically at the right moment in every student relationship.' },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: "The goal is simple: no family falls through because follow-up was slow, and no admin hour gets spent on work a system should be doing." },
    authoritySignal: "This is almost always the first place we find the leak. It's almost never a demand problem.",
    howWorks: [
      { title: 'Discovery & audit', body: 'We map your inquiry and enrollment process to find where families go cold and where your team is spending time on manual admin.' },
      { title: 'Build & prove it', body: 'We build a working response, follow-up, and enrollment system around your actual workflow. You see it handling real inquiry scenarios before any commitment.' },
      { title: 'Deploy & scale', body: 'Live in 2–6 weeks. More inquiries convert. Admin stays flat.' },
    ],
    howWorksCallout: { strong: 'Everything that used to depend on someone following up runs in the background.' },
    proofs: [
      { strong: 'What programs usually underestimate', p: 'How many families quietly enroll elsewhere because no one stayed in touch in the first 72 hours — and how much admin time goes to work a system should handle.' },
      { strong: 'What changes when the workflow gets fixed', p: "More inquiries convert, enrollment becomes more predictable, and your team handles students instead of paperwork." },
      { strong: 'The real result', p: 'Same inquiries. More enrollments. Admin that runs itself.' },
    ],
    microProof: "One tutoring program was getting consistent inquiries but follow-up was inconsistent and enrollment paperwork started from scratch every time. After automating both, more inquiries converted and the admin workload didn't grow with enrollment.",
    ctaHeadline: "I'll show you where you're losing enrollments",
    ctaSub: "30 minutes. No pitch. I'll map your inquiry process and show you exactly where families are going cold and what fixing it looks like.",
    ctaList: ["— where inquiries are going quiet", "— what follow-up and enrollment should be automated", "— what the fix costs vs. what the problem costs", "— how it fits your current process"],
  },

  'events-entertainment': {
    name: 'Events & Entertainment',
    headline: "Every inquiry starts the same way.",
    headlineBreak: "Same questions. Same manual work. First vendor to quote wins.",
    heroSub: "Most events businesses don't have an inquiry problem. They have a workflow problem — and it's giving bookings to whoever moves fastest.",
    heroReframe: "We replace the manual intake, quote prep, and follow-up work so you're always the first to send a real number.",
    heroNote: 'Built for event planners, photographers, caterers, DJs, venues, and entertainment companies.',
    heroCta: "I'll show you exactly where this is costing you",
    metrics: [
      { value: '10–20 hrs', label: 'saved per week on intake,\nquoting & follow-up' },
      { value: 'More bookings', label: 'from the same inquiry\nvolume — first to quote wins' },
      { value: '24/7', label: 'intake capture so you\nquote before competitors reply' },
    ],
    reframeHeadline: 'Stop paying people to do what AI should.',
    reframeBody: "Every inquiry starts the same way. Same questions, same intake process, same quote, same follow-up when they go quiet. Every step is automatable — and every hour it runs manually is time your faster competitors use to close the client you were still writing back.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'Intake is manual, every single time', body: "Date, headcount, budget, venue, vibe, dietary restrictions — collected from scratch for every inquiry. Hours, gone. And while you're collecting, someone else is already quoting." },
      { title: 'Slow quotes lose clients to faster vendors', body: "You're building a proposal while they're hearing back from three other vendors. First to send a real number wins. It's almost never about price." },
      { title: 'Follow-up falls off after the first reply', body: "You send the quote. They go quiet. You mean to follow up. You don't. Someone who had a system did." },
      { title: "Post-booking coordination is its own full-time job", body: "Contract, deposit, vendor coordination, day-of logistics — managed through email threads, calendar reminders, and memory." },
    ],
    painCallout: { strong: "You don't have an inquiry problem.", p: "The client was ready to book. They booked the vendor who got back first — and that's a systems problem." },
    offersIntro: "Not complicated systems. Full replacement of the manual work between an inquiry and a signed contract.",
    services: [
      { tag: 'Intake', title: 'Event details collected before you reply', body: 'Date, headcount, budget, venue, vibe captured automatically. You quote on the first reply instead of sending a questionnaire.' },
      { tag: 'Quoting', title: 'Faster quotes, more wins', body: 'With intake handled, your first reply is a real number. First vendor to quote wins. We make sure that\'s you.' },
      { tag: 'Follow-Up', title: 'Quotes don\'t go unanswered', body: 'If they go quiet after the quote, follow-up fires automatically. You stop losing bookings to whoever remembered to check in.' },
      { tag: 'Coordination', title: 'Booking admin runs itself', body: 'Contracts, deposits, day-of logistics, client confirmations — handled automatically from the moment they say yes.' },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: "The goal is simple: you respond with a real quote before they hear back from someone else — and the booking closes itself." },
    authoritySignal: "This is almost always the first place we find the leak. It's almost never an inquiry volume problem.",
    howWorks: [
      { title: 'Discovery & audit', body: 'We map your inquiry and quote process to find where time is going and where bookings are slipping to faster competitors.' },
      { title: 'Build & prove it', body: 'We build a working intake, follow-up, and coordination system around your actual operation. You see it handling real inquiry scenarios before any commitment.' },
      { title: 'Deploy & scale', body: 'Live in 2–6 weeks. You quote first. You close more.' },
    ],
    howWorksCallout: { strong: 'Everything that used to slow down your quote process runs in the background.' },
    proofs: [
      { strong: 'What event vendors usually underestimate', p: 'How often bookings go to competitors who simply quoted first — not better, not cheaper, just faster.' },
      { strong: 'What changes when intake gets automated', p: "More inquiries convert to quotes, more quotes convert to bookings, and you stop losing business to vendors who move faster." },
      { strong: 'The real result', p: 'Same inquiries. More bookings. Less time on intake and back-and-forth.' },
    ],
    microProof: "One event vendor was spending days collecting details before they could even quote — while competitors were already responding. After automating intake, they were quoting on the first reply and converting more of those inquiries.",
    ctaHeadline: "I'll show you where you're losing bookings",
    ctaSub: "30 minutes. No pitch. I'll map your quote process and show you exactly where bookings are slipping and what a system looks like in your operation.",
    ctaList: ["— where intake is slowing down your quotes", "— what should be automated first", "— what the fix costs vs. what the problem costs", "— how it fits your current operation"],
  },

  'property-management': {
    name: 'Property Management',
    headline: "More units, same team.",
    headlineBreak: "It's possible — if the right things run automatically.",
    heroSub: "Most property management companies don't have a staffing problem. They have a workflow problem — and it's filling your team's day with work a system should be doing.",
    heroReframe: "We replace the repetitive maintenance routing, tenant communication, and showing coordination so your team can focus on what actually requires them.",
    heroNote: 'Built for property managers, landlords, and management companies handling 20+ units.',
    heroCta: "I'll show you exactly where this is costing you",
    metrics: [
      { value: '15–30 hrs', label: 'saved per week per\nteam member' },
      { value: 'More units,', label: 'same team — scale without\nproportional headcount' },
      { value: '24/7', label: 'tenant support without\nadding staff' },
    ],
    reframeHeadline: 'Stop paying people to do what AI should.',
    reframeBody: "Your team spends most of their day on communication that follows the same patterns. Maintenance routing. Tenant questions. Showing coordination. Renewal reminders. Every piece of it is automatable — so your team can spend their time on the work that actually requires judgment, presence, and relationships.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'Maintenance requests fall through the cracks', body: 'Tenants report issues by text, email, call, and portal — sometimes all four. Tracking, routing, and following up is a full-time job. Some always slip, and those become reviews.' },
      { title: 'Every new tenant asks the same questions', body: 'Lease terms, parking, payment portals, trash schedules — explained again for every move-in. Multiply that by your vacancy rate and it\'s significant time.' },
      { title: 'Showing coordination takes 10 emails', body: "Prospective tenant wants to see a unit. Three emails from you, two replies, one time that doesn't work, a reschedule. The unit sits vacant while you coordinate." },
      { title: "Your team spends most of their time on repetitive communication", body: "Most of what they do could be handled automatically. Instead it's a full inbox, a long to-do list, and a team that's maxed out at a number of units that should be higher." },
    ],
    painCallout: { strong: "You don't have a staffing problem.", p: "You have people doing work a system should be doing — and it's the reason you can't scale without hiring." },
    offersIntro: "Not software for the sake of it. Full replacement of the repetitive communication and routing work eating your team's day.",
    services: [
      { tag: 'Maintenance', title: 'Requests routed without manual handling', body: 'Tenants submit through one interface. Urgency triaged, vendor notified, tenant updated — without your team touching it.' },
      { tag: 'Tenant Support', title: 'Questions answered 24/7', body: 'Lease terms, payment portals, policies, move-in procedures — handled automatically. Your team isn\'t fielding the same calls all day.' },
      { tag: 'Leasing', title: 'Showings schedule themselves', body: 'Prospective tenants pick a time, get a confirmation, receive reminders — without a single back-and-forth from your team.' },
      { tag: 'Operations', title: 'Communication that runs in the background', body: 'Rent reminders, renewal prompts, policy updates, inspection notices — sent to the right tenants at the right time, automatically.' },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: "The goal is simple: your team handles the work that needs them, and everything else runs automatically — so you can scale units without scaling headcount." },
    authoritySignal: "This is almost always the first place we find the bottleneck. It's almost never a staffing problem — it's a systems problem.",
    howWorks: [
      { title: 'Discovery & audit', body: 'We map your team\'s daily workflow to find exactly what\'s repetitive, what\'s slipping, and what the system should be handling instead.' },
      { title: 'Build & prove it', body: 'We build a working maintenance routing, tenant support, and leasing system around your actual operation. You see it handling real scenarios before any commitment.' },
      { title: 'Deploy & scale', body: 'Live in 2–6 weeks. Your team gets time back. Your unit count can grow.' },
    ],
    howWorksCallout: { strong: "Everything that used to fill your team's inbox runs in the background." },
    proofs: [
      { strong: "What property managers usually underestimate", p: "How much of their team's day goes to communication that follows the same patterns every time — and how many units they could manage if that time came back." },
      { strong: 'What changes when the workflow gets fixed', p: "Faster maintenance resolution, fewer tenant complaints, showings that book themselves, and a team focused on the work that actually requires them." },
      { strong: 'The real result', p: 'More units managed. Same team. Less friction.' },
    ],
    microProof: "One property management company was handling maintenance requests through a mix of texts, calls, and emails — and fielding the same tenant questions repeatedly. After routing everything through one system, less slipped, tenants needed fewer follow-up contacts, and the team had capacity for more units.",
    ctaHeadline: "I'll show you where your team is losing time",
    ctaSub: "30 minutes. No pitch. I'll map your team's workflow and show you exactly what should be automated and what a system looks like in your operation.",
    ctaList: ["— where repetitive work is eating your team's day", "— what communication should be automated", "— what the fix costs vs. what the problem costs", "— how it fits your current operation"],
  },
};

// ── Page template (v2) ──────────────────────────────────────────────────────
function buildNichePage(niche) {
  const painItems = niche.pains.map(p => `
        <div class="item">
          <div class="item-title">${p.title}</div>
          <div class="item-body">${p.body}</div>
        </div>`).join('');

  const serviceCards = niche.services.map(s => `
        <div class="service-card">
          <div class="service-card-tag">${s.tag}</div>
          <div class="service-card-title">${s.title}</div>
          <div class="service-card-body">${s.body}</div>
        </div>`).join('');

  const metricItems = niche.metrics.map(m => `
        <div class="metric">
          <span class="metric-value">${m.value}</span>
          <span class="metric-label">${m.label.replace(/\n/g, '<br>')}</span>
        </div>`).join('');

  const howWorksSteps = niche.howWorks.map((h, i) => `
        <div class="step">
          <div class="step-num">0${i + 1}</div>
          <div class="step-content">
            <div class="step-title">${h.title}</div>
            <div class="step-body">${h.body}</div>
          </div>
        </div>`).join('');

  const proofBoxes = niche.proofs.map(pr => `
        <div class="proof-box">
          <strong>${pr.strong}</strong>
          <p>${pr.p}</p>
        </div>`).join('');

  const ctaListItems = niche.ctaList.map(li => `<li>${li}</li>`).join('\n        ');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NCSystems — ${niche.name}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    :root {
      --bg: #020203; --fg: #EDEEF2;
      --muted: rgba(237,238,242,0.52); --muted-2: rgba(237,238,242,0.42);
      --rule: rgba(237,238,242,0.08); --rule-2: rgba(237,238,242,0.05);
      --pill: rgba(237,238,242,0.12); --accent-bg: #EDEEF2; --accent-fg: #020203;
    }
    body { background: var(--bg); color: var(--fg); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; min-height: 100vh; line-height: 1.6; }
    #starfield { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
    .page { position: relative; z-index: 1; }
    nav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2.5rem; border-bottom: 1px solid var(--rule); }
    .wordmark { font-family: ui-monospace, 'Courier New', monospace; font-size: 13px; letter-spacing: 0.15em; color: var(--fg); display: flex; align-items: center; gap: 6px; text-decoration: none; }
    .wordmark-bracket { opacity: 0.35; }
    .wordmark-dot { width: 7px; height: 7px; background: var(--fg); border-radius: 50%; }
    .nav-cta { font-size: 13px; color: var(--muted); text-decoration: none; letter-spacing: 0.04em; transition: color 0.2s; }
    .nav-cta:hover { color: var(--fg); }

    /* Hero */
    .hero { max-width: 820px; margin: 0 auto; padding: 6rem 2rem 4rem; text-align: center; }
    .niche-tag { display: inline-block; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(237,238,242,0.35); border: 1px solid var(--pill); border-radius: 20px; padding: 5px 14px; margin-bottom: 2rem; }
    .hero h1 { font-size: clamp(2.15rem, 5vw, 3.35rem); font-weight: 700; line-height: 1.06; letter-spacing: -0.03em; margin-bottom: 1.2rem; }
    .hero h1 .break { display: block; color: rgba(237,238,242,0.92); }
    .hero-sub { max-width: 680px; margin: 0 auto 0.9rem; font-size: 1.08rem; color: var(--muted); }
    .hero-reframe { max-width: 640px; margin: 0 auto 2.5rem; font-size: 0.97rem; color: rgba(237,238,242,0.38); font-style: italic; }
    .btn { display: inline-block; background: var(--accent-bg); color: var(--accent-fg); font-size: 14px; font-weight: 600; letter-spacing: 0.02em; padding: 14px 32px; border-radius: 10px; text-decoration: none; transition: opacity 0.2s, transform 0.15s; }
    .btn:hover { opacity: 0.88; transform: translateY(-1px); }
    .hero-note { margin-top: 1.5rem; font-size: 13px; color: rgba(237,238,242,0.28); letter-spacing: 0.01em; }

    /* Metrics bar */
    .metrics-bar { max-width: 820px; margin: 0 auto; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--rule); border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
    .metric { background: var(--bg); padding: 1.5rem; text-align: center; }
    .metric-value { font-size: 1.75rem; font-weight: 700; letter-spacing: -0.03em; color: var(--fg); display: block; margin-bottom: 0.3rem; }
    .metric-label { font-size: 12px; color: rgba(237,238,242,0.38); letter-spacing: 0.04em; line-height: 1.5; }

    /* Reframe block */
    .reframe-block { max-width: 820px; margin: 0 auto; padding: 4rem 2rem; border-bottom: 1px solid var(--rule); }
    .reframe-eyebrow { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(237,238,242,0.28); margin-bottom: 1.2rem; }
    .reframe-headline { font-size: clamp(1.5rem, 3vw, 2rem); font-weight: 700; letter-spacing: -0.025em; line-height: 1.15; margin-bottom: 1rem; }
    .reframe-body { font-size: 1rem; color: var(--muted); max-width: 660px; line-height: 1.75; }

    /* Sections */
    .section { max-width: 820px; margin: 0 auto; padding: 4rem 2rem; border-top: 1px solid var(--rule); }
    .section-label { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(237,238,242,0.28); margin-bottom: 2rem; }
    .section-intro { font-size: 1rem; color: var(--muted); margin-bottom: 2.2rem; max-width: 660px; }
    .items { display: flex; flex-direction: column; gap: 2rem; }
    .item { display: grid; grid-template-columns: 1fr; gap: 0.45rem; }
    @media (min-width: 620px) { .item { grid-template-columns: 250px 1fr; gap: 1.5rem; align-items: start; } }
    .item-title { font-size: 15px; font-weight: 600; color: var(--fg); }
    .item-body { font-size: 15px; color: var(--muted); line-height: 1.68; }

    /* Service grid */
    .services-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: var(--rule); border: 1px solid var(--rule); border-radius: 14px; overflow: hidden; margin-bottom: 2rem; }
    @media (max-width: 580px) { .services-grid { grid-template-columns: 1fr; } }
    .service-card { background: var(--bg); padding: 1.75rem 1.5rem; }
    .service-card-tag { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(237,238,242,0.28); margin-bottom: 0.7rem; }
    .service-card-title { font-size: 15px; font-weight: 600; color: var(--fg); margin-bottom: 0.5rem; }
    .service-card-body { font-size: 14px; color: rgba(237,238,242,0.46); line-height: 1.65; }

    .split-callout { margin-top: 2rem; padding-top: 1.75rem; border-top: 1px solid var(--rule-2); display: grid; grid-template-columns: 1fr; gap: 0.8rem; }
    .split-callout strong { display: block; font-size: 1.05rem; font-weight: 650; color: var(--fg); letter-spacing: -0.01em; }
    .split-callout p { color: var(--muted); font-size: 15px; max-width: 620px; }
    .authority-signal { font-size: 13px; color: rgba(237,238,242,0.28); font-style: italic; }

    /* Steps */
    .steps { display: flex; flex-direction: column; gap: 2rem; }
    .step { display: grid; grid-template-columns: 32px 1fr; gap: 1.25rem; align-items: start; }
    .step-num { font-size: 11px; font-family: ui-monospace, monospace; color: rgba(237,238,242,0.28); padding-top: 3px; letter-spacing: 0.05em; }
    .step-title { font-size: 15px; font-weight: 600; color: var(--fg); margin-bottom: 0.3rem; }
    .step-body { font-size: 15px; color: var(--muted); line-height: 1.68; }

    /* Trust */
    .trust-section { max-width: 820px; margin: 0 auto; padding: 4rem 2rem; border-top: 1px solid var(--rule); }
    .trust-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 2rem; }
    @media (max-width: 620px) { .trust-grid { grid-template-columns: 1fr; gap: 1rem; } }
    .trust-item { padding: 1.5rem; border: 1px solid var(--rule); border-radius: 12px; }
    .trust-num { font-size: 11px; letter-spacing: 0.1em; color: rgba(237,238,242,0.25); margin-bottom: 0.75rem; font-family: ui-monospace, monospace; }
    .trust-title { font-size: 14px; font-weight: 600; color: var(--fg); margin-bottom: 0.4rem; }
    .trust-body { font-size: 13px; color: rgba(237,238,242,0.42); line-height: 1.6; }

    /* Proof */
    .micro-proof { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-top: 1rem; }
    @media (min-width: 620px) { .micro-proof { grid-template-columns: 1fr 1fr; } }
    .proof-box { padding: 1.15rem 1.25rem; border: 1px solid var(--rule); border-radius: 14px; background: rgba(237,238,242,0.02); }
    .proof-box strong { display: block; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(237,238,242,0.55); margin-bottom: 0.5rem; }
    .proof-box p { font-size: 14px; color: var(--muted); line-height: 1.65; }
    .proof-box.proof-story { border-style: dashed; border-color: rgba(237,238,242,0.1); grid-column: 1 / -1; }
    .proof-box.proof-story p { font-size: 14px; color: rgba(237,238,242,0.38); font-style: italic; }

    /* CTA */
    .cta-section { max-width: 820px; margin: 0 auto; padding: 4rem 2rem 6rem; text-align: center; border-top: 1px solid var(--rule); }
    .cta-section h2 { font-size: 1.8rem; font-weight: 700; margin-bottom: 0.8rem; letter-spacing: -0.02em; }
    .cta-section p { color: var(--muted-2); margin: 0 auto 2rem; font-size: 15px; max-width: 580px; }
    .cta-list { list-style: none; display: inline-flex; flex-direction: column; gap: 0.35rem; margin: 0 0 2rem; color: rgba(237,238,242,0.55); font-size: 14px; text-align: left; }

    footer { display: flex; justify-content: space-between; padding: 1.5rem 2.5rem; border-top: 1px solid var(--rule); font-size: 12px; color: rgba(237,238,242,0.22); letter-spacing: 0.04em; gap: 1rem; flex-wrap: wrap; }
    .footer-right { display: flex; align-items: center; gap: 8px; }
    .footer-dot { width: 6px; height: 6px; background: rgba(237,238,242,0.22); border-radius: 50%; }

    @media (max-width: 640px) {
      nav, footer { padding: 1.2rem 1.25rem; }
      .hero, .section, .cta-section, .reframe-block, .trust-section { padding-left: 1.25rem; padding-right: 1.25rem; }
      .metrics-bar { grid-template-columns: 1fr; }
      .hero { padding-top: 4.5rem; }
    }
  </style>
</head>
<body>
  <canvas id="starfield"></canvas>
  <div class="page">
    <nav>
      <a href="/" class="wordmark">
        <span class="wordmark-bracket">[</span>NCSYSTEMS<span class="wordmark-dot"></span><span class="wordmark-bracket">]</span>
      </a>
      <a href="${CALENDLY}" class="nav-cta" target="_blank" rel="noopener noreferrer">Book a call →</a>
    </nav>

    <section class="hero">
      <div class="niche-tag">${niche.name}</div>
      <h1>${niche.headline}<span class="break">${niche.headlineBreak}</span></h1>
      <p class="hero-sub">${niche.heroSub}</p>
      <p class="hero-reframe">${niche.heroReframe}</p>
      <a href="${CALENDLY}" class="btn" target="_blank" rel="noopener noreferrer">${niche.heroCta}</a>
      <div class="hero-note">${niche.heroNote}</div>
    </section>

    <div class="metrics-bar">${metricItems}
    </div>

    <div class="reframe-block">
      <div class="reframe-eyebrow">The actual problem</div>
      <h2 class="reframe-headline">${niche.reframeHeadline}</h2>
      <p class="reframe-body">${niche.reframeBody}</p>
    </div>

    <section class="section">
      <div class="section-label">${niche.painLabel}</div>
      <div class="items">${painItems}
      </div>
      <div class="split-callout">
        <strong>${niche.painCallout.strong}</strong>
        ${niche.painCallout.p ? `<p>${niche.painCallout.p}</p>` : ''}
      </div>
    </section>

    <section class="section">
      <div class="section-label">What we build</div>
      <p class="section-intro">${niche.offersIntro}</p>
      <div class="services-grid">${serviceCards}
      </div>
      <div class="split-callout">
        <strong>${niche.offerCallout.strong}</strong>
        ${niche.offerCallout.p ? `<p>${niche.offerCallout.p}</p>` : ''}
        <p class="authority-signal">${niche.authoritySignal}</p>
      </div>
    </section>

    <section class="section">
      <div class="section-label">How it actually works</div>
      <div class="steps">${howWorksSteps}
      </div>
      <div class="split-callout">
        <strong>${niche.howWorksCallout.strong}</strong>
      </div>
    </section>

    <div class="trust-section">
      <div class="section-label">Our commitment</div>
      <div class="trust-grid">
        <div class="trust-item">
          <div class="trust-num">01</div>
          <div class="trust-title">Proof before payment</div>
          <div class="trust-body">You evaluate a working system built for your operation. If you don't see clear ROI, we don't move forward. No invoice, no awkward conversation.</div>
        </div>
        <div class="trust-item">
          <div class="trust-num">02</div>
          <div class="trust-title">You own everything. Always.</div>
          <div class="trust-body">All code, credentials, and infrastructure in your name from day one. If we ever stop working together, you keep the entire system. Zero lock-in.</div>
        </div>
        <div class="trust-item">
          <div class="trust-num">03</div>
          <div class="trust-title">Live in weeks, not quarters</div>
          <div class="trust-body">Most systems go from discovery to deployed in 2–6 weeks. No 6-month timelines. No enterprise bloat. You're running it before the season changes.</div>
        </div>
      </div>
    </div>

    <section class="section">
      <div class="section-label">What changes</div>
      <div class="micro-proof">${proofBoxes}
        <div class="proof-box proof-story">
          <p>${niche.microProof}</p>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <h2>${niche.ctaHeadline}</h2>
      <p>${niche.ctaSub}</p>
      <ul class="cta-list">
        ${ctaListItems}
      </ul>
      <a href="${CALENDLY}" class="btn" target="_blank" rel="noopener noreferrer">Book your call</a>
    </section>

    <footer>
      <span>ncsystems.io</span>
      <div class="footer-right"><div class="footer-dot"></div><span>accepting new engagements</span></div>
    </footer>
  </div>

  <script>
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    let W, H, stars = [];
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    function initStars() {
      stars = [];
      for (let i = 0; i < 180; i++) stars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.3 + 0.2,
        speed: Math.random() * 0.004 + 0.001,
        phase: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.06,
      });
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        const a = 0.25 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.speed * 60 + s.phase));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(237,238,242,' + a + ')'; ctx.fill();
        s.x += s.drift;
        if (s.x < -2) s.x = W + 2;
        if (s.x > W + 2) s.x = -2;
      }
    }
    function loop(t) { draw(t / 1000); requestAnimationFrame(loop); }
    resize(); initStars(); requestAnimationFrame(loop);
    window.addEventListener('resize', () => { resize(); initStars(); });
  </script>
</body>
</html>`;
}

// ── /other page (email capture for unmatched niches) ────────────────────────
function buildOtherPage() {
  const starScript = `
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    let W, H, stars = [];
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    function initStars() {
      stars = [];
      for (let i = 0; i < 180; i++) stars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.3 + 0.2,
        speed: Math.random() * 0.004 + 0.001,
        phase: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.06,
      });
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        const a = 0.25 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.speed * 60 + s.phase));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(237,238,242,' + a + ')'; ctx.fill();
        s.x += s.drift;
        if (s.x < -2) s.x = W + 2;
        if (s.x > W + 2) s.x = -2;
      }
    }
    function loop(t) { draw(t / 1000); requestAnimationFrame(loop); }
    resize(); initStars(); requestAnimationFrame(loop);
    window.addEventListener('resize', () => { resize(); initStars(); });
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NCSystems — Let's Talk</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #020203; --fg: #EDEEF2;
      --muted: rgba(237,238,242,0.50); --rule: rgba(237,238,242,0.08);
      --pill: rgba(237,238,242,0.12); --accent-bg: #EDEEF2; --accent-fg: #020203;
    }
    body { background: var(--bg); color: var(--fg); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; min-height: 100vh; line-height: 1.6; }
    #starfield { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
    .page { position: relative; z-index: 1; display: flex; flex-direction: column; min-height: 100vh; }
    nav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2.5rem; border-bottom: 1px solid var(--rule); }
    .wordmark { font-family: ui-monospace, 'Courier New', monospace; font-size: 13px; letter-spacing: 0.15em; color: var(--fg); display: flex; align-items: center; gap: 6px; text-decoration: none; }
    .wordmark-bracket { opacity: 0.35; }
    .wordmark-dot { width: 7px; height: 7px; background: var(--fg); border-radius: 50%; }
    .nav-cta { font-size: 13px; color: var(--muted); text-decoration: none; letter-spacing: 0.04em; transition: color 0.2s; }
    .nav-cta:hover { color: var(--fg); }
    .main { flex: 1; display: flex; align-items: center; justify-content: center; padding: 4rem 2rem; }
    .card { max-width: 560px; width: 100%; text-align: center; }
    .niche-tag { display: inline-block; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(237,238,242,0.35); border: 1px solid var(--pill); border-radius: 20px; padding: 5px 14px; margin-bottom: 2rem; }
    h1 { font-size: clamp(1.9rem, 4.5vw, 2.7rem); font-weight: 700; line-height: 1.1; letter-spacing: -0.025em; margin-bottom: 1rem; }
    .sub { font-size: 1.05rem; color: var(--muted); margin-bottom: 2.5rem; max-width: 440px; margin-left: auto; margin-right: auto; }
    .form-wrap { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; }
    .form-row { display: flex; gap: 0.6rem; }
    input[type="text"], input[type="email"] {
      flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12);
      border-radius: 10px; padding: 14px 18px; font-size: 15px; color: var(--fg);
      outline: none; font-family: inherit; transition: border-color 0.2s;
    }
    input[type="text"]::placeholder, input[type="email"]::placeholder { color: rgba(237,238,242,0.28); }
    input[type="text"]:focus, input[type="email"]:focus { border-color: rgba(255,255,255,0.28); }
    .btn-submit {
      background: var(--accent-bg); color: var(--accent-fg); font-size: 14px; font-weight: 600;
      padding: 14px 28px; border-radius: 10px; border: none; cursor: pointer;
      transition: opacity 0.2s; white-space: nowrap;
    }
    .btn-submit:hover { opacity: 0.88; }
    .btn-submit:disabled { opacity: 0.45; cursor: not-allowed; }
    .divider { display: flex; align-items: center; gap: 1rem; margin: 0.5rem 0 1.5rem; color: rgba(237,238,242,0.2); font-size: 12px; letter-spacing: 0.08em; }
    .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: rgba(237,238,242,0.08); }
    .btn-secondary { display: inline-block; color: var(--muted); font-size: 14px; text-decoration: none; border: 1px solid rgba(237,238,242,0.15); border-radius: 10px; padding: 12px 24px; transition: border-color 0.2s, color 0.2s; }
    .btn-secondary:hover { color: var(--fg); border-color: rgba(237,238,242,0.3); }
    .success { display: none; }
    .success h2 { font-size: 1.6rem; font-weight: 700; margin-bottom: 0.75rem; }
    .success p { color: var(--muted); margin-bottom: 2rem; }
    body.submitted .form-state { display: none; }
    body.submitted .success { display: block; }
    footer { display: flex; justify-content: space-between; padding: 1.5rem 2.5rem; border-top: 1px solid var(--rule); font-size: 12px; color: rgba(237,238,242,0.25); letter-spacing: 0.04em; flex-wrap: wrap; gap: 1rem; }
    .footer-right { display: flex; align-items: center; gap: 8px; }
    .footer-dot { width: 6px; height: 6px; background: rgba(237,238,242,0.25); border-radius: 50%; }
    @media (max-width: 480px) { .form-row { flex-direction: column; } nav, footer { padding: 1.2rem 1.25rem; } }
  </style>
</head>
<body>
  <canvas id="starfield"></canvas>
  <div class="page">
    <nav>
      <a href="/" class="wordmark"><span class="wordmark-bracket">[</span>NCSYSTEMS<span class="wordmark-dot"></span><span class="wordmark-bracket">]</span></a>
      <a href="${CALENDLY}" class="nav-cta" target="_blank" rel="noopener noreferrer">Book a call →</a>
    </nav>

    <div class="main">
      <div class="card">
        <div class="form-state">
          <div class="niche-tag">NCSystems</div>
          <h1>We don't have a page for your industry yet.</h1>
          <p class="sub">We're expanding. Drop your email and we'll reach out when we build something for yours.</p>

          <div class="form-wrap">
            <div class="form-row">
              <input type="text" id="nameInput" placeholder="Your name" autocomplete="off" />
              <input type="email" id="emailInput" placeholder="Your email" autocomplete="off" />
            </div>
            <input type="text" id="bizInput" placeholder="What kind of business do you run?" autocomplete="off" />
          </div>

          <button class="btn-submit" id="submitBtn">Notify me when you expand</button>

          <div class="divider">or</div>
          <a href="${CALENDLY}" class="btn-secondary" target="_blank" rel="noopener noreferrer">Book a call anyway →</a>
        </div>

        <div class="success">
          <div class="niche-tag">Got it</div>
          <h2>You're on the list.</h2>
          <p>We'll reach out when we expand to your industry. In the meantime, feel free to book a call if you want to talk sooner.</p>
          <a href="${CALENDLY}" class="btn-secondary" target="_blank" rel="noopener noreferrer">Book a free strategy call →</a>
        </div>
      </div>
    </div>

    <footer>
      <span>ncsystems.io</span>
      <div class="footer-right"><div class="footer-dot"></div><span>accepting new engagements</span></div>
    </footer>
  </div>

  <script>
    ${starScript}

    const submitBtn = document.getElementById('submitBtn');
    submitBtn.addEventListener('click', async () => {
      const name = document.getElementById('nameInput').value.trim();
      const email = document.getElementById('emailInput').value.trim();
      const biz = document.getElementById('bizInput').value.trim();
      if (!email) { document.getElementById('emailInput').focus(); return; }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving...';

      try {
        await fetch('/capture-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, business: biz }),
        });
      } catch (e) { /* still show success */ }

      document.body.classList.add('submitted');
    });
  </script>
</body>
</html>`;
}

// ── /book page (Calendly embed) ───────────────────────────────────────────────
function buildBookPage() {
  const starScript = `
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    let W, H, stars = [];
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    function initStars() {
      stars = [];
      for (let i = 0; i < 180; i++) stars.push({
        x: Math.random() * W, y: Math.random() * H,
        r: Math.random() * 1.3 + 0.2,
        speed: Math.random() * 0.004 + 0.001,
        phase: Math.random() * Math.PI * 2,
        drift: (Math.random() - 0.5) * 0.06,
      });
    }
    function draw(t) {
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        const a = 0.25 + 0.65 * (0.5 + 0.5 * Math.sin(t * s.speed * 60 + s.phase));
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(237,238,242,' + a + ')'; ctx.fill();
        s.x += s.drift;
        if (s.x < -2) s.x = W + 2;
        if (s.x > W + 2) s.x = -2;
      }
    }
    function loop(t) { draw(t / 1000); requestAnimationFrame(loop); }
    resize(); initStars(); requestAnimationFrame(loop);
    window.addEventListener('resize', () => { resize(); initStars(); });
  `;

  const isPlaceholder = CALENDLY.includes('YOUR_LINK_HERE');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NCSystems — Book a Call</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --bg: #020203; --fg: #EDEEF2; --muted: rgba(237,238,242,0.50); --rule: rgba(237,238,242,0.08); }
    body { background: var(--bg); color: var(--fg); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; min-height: 100vh; line-height: 1.6; }
    #starfield { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
    .page { position: relative; z-index: 1; display: flex; flex-direction: column; min-height: 100vh; }
    nav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2.5rem; border-bottom: 1px solid var(--rule); }
    .wordmark { font-family: ui-monospace, 'Courier New', monospace; font-size: 13px; letter-spacing: 0.15em; color: var(--fg); display: flex; align-items: center; gap: 6px; text-decoration: none; }
    .wordmark-bracket { opacity: 0.35; }
    .wordmark-dot { width: 7px; height: 7px; background: var(--fg); border-radius: 50%; }
    .hero { text-align: center; padding: 4rem 2rem 2rem; }
    .niche-tag { display: inline-block; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(237,238,242,0.35); border: 1px solid rgba(237,238,242,0.12); border-radius: 20px; padding: 5px 14px; margin-bottom: 1.5rem; }
    h1 { font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 700; letter-spacing: -0.025em; margin-bottom: 0.75rem; }
    .sub { color: var(--muted); font-size: 1rem; max-width: 480px; margin: 0 auto; }
    .calendly-wrap { flex: 1; min-height: 650px; margin: 2rem auto; width: 100%; max-width: 1100px; padding: 0 1.5rem; }
    .calendly-inline-widget { background: #020203 !important; }
    .calendly-inline-widget iframe { background: #020203 !important; color-scheme: dark; }
    .placeholder-wrap { flex: 1; display: flex; align-items: center; justify-content: center; padding: 2rem; }
    .placeholder-card { max-width: 440px; text-align: center; }
    .placeholder-card p { color: var(--muted); margin-bottom: 1.5rem; line-height: 1.7; }
    .placeholder-card code { font-family: ui-monospace, monospace; font-size: 13px; background: rgba(237,238,242,0.06); padding: 3px 8px; border-radius: 4px; }
    footer { display: flex; justify-content: space-between; padding: 1.5rem 2.5rem; border-top: 1px solid var(--rule); font-size: 12px; color: rgba(237,238,242,0.25); letter-spacing: 0.04em; flex-wrap: wrap; gap: 1rem; margin-top: auto; }
    .footer-right { display: flex; align-items: center; gap: 8px; }
    .footer-dot { width: 6px; height: 6px; background: rgba(237,238,242,0.25); border-radius: 50%; }
    @media (max-width: 640px) { nav, footer { padding: 1.2rem 1.25rem; } }
  </style>
  ${!isPlaceholder ? '<link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet">' : ''}
</head>
<body>
  <canvas id="starfield"></canvas>
  <div class="page">
    <nav>
      <a href="/" class="wordmark"><span class="wordmark-bracket">[</span>NCSYSTEMS<span class="wordmark-dot"></span><span class="wordmark-bracket">]</span></a>
    </nav>

    <div class="hero">
      <div class="niche-tag">Free strategy call</div>
      <h1>Let's look at your business together.</h1>
      <p class="sub">30 minutes. No pitch. Just a clear breakdown of what's leaking, what should be automated, and what it could look like for you.</p>
    </div>

    ${isPlaceholder ? `
    <div class="placeholder-wrap">
      <div class="placeholder-card">
        <p>Calendly link not configured yet.<br>Replace <code>YOUR_LINK_HERE</code> in <code>server.js</code> with your real Calendly URL.</p>
      </div>
    </div>` : `
    <div class="calendly-wrap">
      <div class="calendly-inline-widget" data-url="${CALENDLY}?hide_event_type_details=1&hide_gdpr_banner=1&background_color=020203&text_color=EDEEF2&primary_color=EDEEF2" style="min-width:320px;height:650px;"></div>
    </div>`}

    <footer>
      <span>ncsystems.io</span>
      <div class="footer-right"><div class="footer-dot"></div><span>accepting new engagements</span></div>
    </footer>
  </div>

  <script>
    ${starScript}
  </script>
  ${!isPlaceholder ? '<script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>' : ''}
</body>
</html>`;
}

// ── Email capture endpoint ────────────────────────────────────────────────────
// Writes to leads.json in the website directory.
// For production: replace this with Formspree, Resend, or a DB write.
app.post('/capture-email', (req, res) => {
  const { name, email, business } = req.body;
  if (!email) return res.status(400).json({ ok: false });

  const leadsPath = path.join(__dirname, 'leads.json');
  let leads = [];
  try { leads = JSON.parse(fs.readFileSync(leadsPath, 'utf8')); } catch (e) { /* file doesn't exist yet */ }

  leads.push({ name: name || '', email, business: business || '', capturedAt: new Date().toISOString() });
  fs.writeFileSync(leadsPath, JSON.stringify(leads, null, 2));
  res.json({ ok: true });
});

// ── Classification endpoint ──────────────────────────────────────────────────
app.post('/classify', async (req, res) => {
  const { input } = req.body;
  if (!input) return res.json({ niche: 'other' });

  const slugs = Object.keys(NICHES).join(', ');

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 20,
        messages: [{
          role: 'user',
          content: `Classify this business into exactly one category slug.
Valid slugs: ${slugs}, other
Return ONLY the slug. No punctuation, no explanation.
Business: "${input}"`,
        }],
      }),
    });

    const data = await response.json();
    const raw  = data.content[0].text.trim().toLowerCase().replace(/[^a-z-]/g, '');
    const niche = NICHES[raw] ? raw : 'other';
    res.json({ niche });
  } catch (err) {
    console.error('[classify error]', err.message);
    res.json({ niche: 'other' });
  }
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.get('/', (_, res) => res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NCSystems — AI systems built for your industry</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #020203; color: #EDEEF2; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; overflow: hidden; position: relative; }
    #starfield { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; }
    .container { position: relative; z-index: 1; width: 100%; max-width: 720px; padding: 2rem; display: flex; flex-direction: column; align-items: center; gap: 2rem; text-align: center; }
    .wordmark { font-family: 'Geist Mono', ui-monospace, 'Courier New', monospace; font-size: 13px; letter-spacing: 0.15em; color: #EDEEF2; opacity: 0; display: flex; align-items: center; gap: 6px; }
    .wordmark.visible { opacity: 1; transition: opacity 0.6s ease; }
    .wordmark-bracket { opacity: 0.35; }
    .wordmark-dot { width: 7px; height: 7px; background: #EDEEF2; border-radius: 50%; animation: dot-pulse 3s ease-in-out infinite; }
    @keyframes dot-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
    .headline { font-size: clamp(2.2rem, 5vw, 3.2rem); line-height: 1.2; letter-spacing: -0.02em; min-height: 160px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px; }
    .line-1 { font-weight: 700; color: #EDEEF2; }
    .line-2 { font-style: italic; font-weight: 400; color: #EDEEF2; font-family: Georgia, 'Times New Roman', serif; }
    .cursor { display: inline-block; width: 2px; height: 1em; background: #EDEEF2; margin-left: 2px; vertical-align: middle; animation: blink 0.8s step-end infinite; }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }
    .input-wrap { width: 100%; position: relative; opacity: 0; transform: translateY(10px); transition: opacity 0.5s ease, transform 0.5s ease; }
    .input-wrap.visible { opacity: 1; transform: translateY(0); }
    .input-box { width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; padding: 18px 56px 18px 22px; font-size: 18px; color: #EDEEF2; outline: none; font-family: inherit; transition: border-color 0.2s, box-shadow 0.2s; caret-color: #EDEEF2; }
    .input-box::placeholder { color: rgba(237,238,242,0.3); }
    .input-box:focus { border-color: rgba(255,255,255,0.3); box-shadow: 0 0 0 3px rgba(255,255,255,0.05); }
    .send-btn { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); border-radius: 9px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #EDEEF2; transition: background 0.2s; }
    .send-btn:hover { background: rgba(255,255,255,0.18); }
    .send-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .loading { display: none; align-items: center; gap: 5px; position: absolute; right: 14px; top: 50%; transform: translateY(-50%); }
    .loading span { width: 5px; height: 5px; background: #EDEEF2; border-radius: 50%; animation: ldot 1.2s ease-in-out infinite; }
    .loading span:nth-child(2) { animation-delay: 0.2s; }
    .loading span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes ldot { 0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; } 40% { transform: scale(1); opacity: 1; } }
    body.is-loading .send-btn { display: none; }
    body.is-loading .loading { display: flex; }
    body.is-loading .input-box { pointer-events: none; }
    footer { position: fixed; bottom: 1.5rem; left: 0; right: 0; display: flex; justify-content: space-between; padding: 0 2rem; font-size: 12px; color: rgba(237,238,242,0.3); letter-spacing: 0.04em; z-index: 1; opacity: 0; transition: opacity 0.6s ease; }
    footer.visible { opacity: 1; }
    .footer-right { display: flex; align-items: center; gap: 8px; }
    .footer-dot { width: 6px; height: 6px; background: rgba(237,238,242,0.4); border-radius: 50%; }
  </style>
</head>
<body>
  <canvas id="starfield"></canvas>
  <div class="container">
    <div class="wordmark" id="wordmark"><span class="wordmark-bracket">[</span>NCSYSTEMS<span class="wordmark-dot"></span><span class="wordmark-bracket">]</span></div>
    <div class="headline" id="headline"><div class="line-1" id="line1"></div><div class="line-2" id="line2"></div></div>
    <div class="input-wrap" id="inputWrap">
      <input class="input-box" id="bizInput" type="text" placeholder="I run a…" autocomplete="off" />
      <button class="send-btn" id="sendBtn" aria-label="Submit"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
      <div class="loading" id="loading"><span></span><span></span><span></span></div>
    </div>
  </div>
  <footer id="footer"><span>ncsystems.io</span><div class="footer-right"><div class="footer-dot"></div><span>accepting new engagements</span></div></footer>
  <script>
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    let W, H, stars = [];
    function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
    function initStars() { stars = []; for (let i = 0; i < 220; i++) stars.push({ x: Math.random()*W, y: Math.random()*H, r: Math.random()*1.4+0.3, speed: Math.random()*0.004+0.001, phase: Math.random()*Math.PI*2, drift: (Math.random()-0.5)*0.08 }); }
    function drawStars(t) { ctx.clearRect(0,0,W,H); for (const s of stars) { const a = 0.3+0.7*(0.5+0.5*Math.sin(t*s.speed*60+s.phase)); ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fillStyle='rgba(237,238,242,'+a+')'; ctx.fill(); if(s.r>1.2&&a>0.85){ctx.beginPath();ctx.moveTo(s.x-s.r*3,s.y);ctx.lineTo(s.x+s.r*3,s.y);ctx.moveTo(s.x,s.y-s.r*3);ctx.lineTo(s.x,s.y+s.r*3);ctx.strokeStyle='rgba(237,238,242,'+(a*0.3)+')';ctx.lineWidth=0.5;ctx.stroke();} s.x+=s.drift; if(s.x<-2)s.x=W+2; if(s.x>W+2)s.x=-2; } }
    function loop(t) { drawStars(t/1000); requestAnimationFrame(loop); }
    resize(); initStars(); requestAnimationFrame(loop);
    window.addEventListener('resize', () => { resize(); initStars(); });

    const LINE1 = 'Tell me what you do.';
    const LINE2 = "I'll show you what's possible.";
    const line1El = document.getElementById('line1'), line2El = document.getElementById('line2');
    const wordmark = document.getElementById('wordmark'), inputWrap = document.getElementById('inputWrap'), footer = document.getElementById('footer');
    function typeText(el, text, speed, cb) { let i=0; const cur=document.createElement('span'); cur.className='cursor'; el.appendChild(cur); const iv=setInterval(()=>{ cur.before(document.createTextNode(text[i])); i++; if(i>=text.length){clearInterval(iv); if(cb)setTimeout(cb,320); else cur.remove();} },speed); }
    setTimeout(()=>{ typeText(line1El,LINE1,52,()=>{ const c=line1El.querySelector('.cursor'); if(c)c.remove(); setTimeout(()=>{ typeText(line2El,LINE2,46,()=>{ const c2=line2El.querySelector('.cursor'); if(c2)c2.remove(); setTimeout(()=>inputWrap.classList.add('visible'),200); setTimeout(()=>wordmark.classList.add('visible'),500); setTimeout(()=>footer.classList.add('visible'),800); }); },180); }); },600);

    const bizInput = document.getElementById('bizInput'), sendBtn = document.getElementById('sendBtn');
    bizInput.addEventListener('keydown', e => { if(e.key==='Enter'){e.preventDefault();submit();} });
    sendBtn.addEventListener('click', submit);
    async function submit() {
      const val = bizInput.value.trim(); if(!val) return;
      document.body.classList.add('is-loading'); sendBtn.disabled = true;
      try { const res = await fetch('/classify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({input:val})}); const {niche} = await res.json(); window.location.href='/'+niche; }
      catch(err) { document.body.classList.remove('is-loading'); sendBtn.disabled=false; bizInput.placeholder='Something went wrong — try again'; }
    }
  </script>
</body>
</html>`));

Object.keys(NICHES).forEach(slug => {
  app.get('/' + slug, (_, res) => res.send(buildNichePage(NICHES[slug])));
});

app.get('/other', (_, res) => res.send(buildOtherPage()));
app.get('/book', (_, res) => res.send(buildBookPage()));

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`\n🚀  NCSystems running at http://localhost:${PORT}\n`));
