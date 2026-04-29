const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// ── Config ───────────────────────────────────────────────────────────────────
const CALENDLY = 'https://calendly.com/nick-ncsystems/breakdown';

// ── Niche data ───────────────────────────────────────────────────────────────
// Fields per niche:
//   metrics[3]     – {value, label} shown in the ROI bar
//   reframeBody    – "Stop paying people..." paragraph (niche-specific)
//   services[4]    – {tag, title, body} 2×2 service grid (replaces old offers)
//   All other fields carry over from v1 (pains, howWorks, proofs, etc.)
const NICHES = {
  'tourism-hospitality': {
    name: 'Tourism & Hospitality',
    headline: "Someone DMs at 9pm.",
    headlineBreak: "By morning, they've booked the boat next door.",
    heroSub: "Most inquiries happen when you're not watching.",
    heroInev: "They don't book the best option. They book the first one that responds.",
    heroReframe: "I find where it's leaking. Sometimes it's response time. Sometimes it's follow-up. Sometimes it's something deeper in the operation. Then I fix it.",
    heroNote: 'Built for tour operators, charters, activity companies, surf schools, and boutique hospitality.',
    heroCta: "Show me where this is happening",
    heroPunch: "Most bookings are decided in under an hour.<br>Most businesses respond the next day.",
    heroReality: "After-hours inquiries sit.<br>Guests message between bookings, at night, or mid-trip.<br>They don't wait.<br>They book whoever answers first.",
    reframeHeadline: "You're paying someone to answer the same questions every day.<br>That shouldn't need a person.",
    reframeBody: "Same booking questions. Same confirmations. Same reminders. Same follow-up. Either you do it or someone you pay does. That's where time and money go.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'A DM lands at 9pm', body: 'You see it in the morning. They already booked the boat next door. That booking is gone.' },
      { title: 'The same questions, every day', body: 'Pickup times. What to bring. Where to park. What\'s included. Answered manually, one by one. You\'re paying someone to repeat the same answers all day.' },
      { title: 'The booking doesn\'t stop at the booking', body: 'Confirmations. Reminders. Pre-trip details. Post-trip follow-up. Most of it depends on someone remembering. Most of the time, no one does.' },
      { title: 'Busy season breaks everything', body: 'More inquiries. More questions. More follow-up. Same hours in the day. You hire someone or you start dropping things.' },
    ],
    painCallout: { strong: "You don't have a traffic problem.", p: 'You have a workflow problem. Every day it runs manually costs more than fixing it.' },
    offersIntro: "The highest-leverage problem gets fixed.<br>Sometimes that means removing manual work.<br>Sometimes it means fixing how the operation runs underneath it.",
    positioningLine: "Not every problem is automation.<br>But every problem has a cost.<br>That's what I look for first.",
    services: [
      { tag: "Messages don't sit", title: 'Every message answered instantly', body: 'Any channel. Any hour. They get pricing, availability, and a path to booking — not a voicemail.' },
      { tag: "Guests don't get lost after booking", title: 'The full journey, hands-off', body: 'Confirmations. Pre-trip details. Day-of reminders. Post-experience follow-up. None of it waits on someone remembering.' },
      { tag: "The day runs without you holding it together", title: "The day doesn't fall apart when it gets busy", body: 'Capacity tracking. Crew notifications. Weather rescheduling. Waitlist management. The layer running underneath the day.' },
      { tag: "Revenue compounds in the background", title: 'Compounding without headcount', body: 'Upsells. Add-ons. Rebooking. Review capture. Every touchpoint that grows revenue automatically.' },
    ],
    offerCallout: { strong: "The goal isn't AI.", p: 'The goal is removing the repetitive work — until the operation runs without anyone touching it.' },
    authoritySignal: "This is almost always where the leak is. It's almost never a traffic problem.",
    howWorks: [
      { title: "I look at what's happening", body: 'I map your operation. Where are inquiries going cold? What\'s manual that shouldn\'t be? What\'s the cost of leaving it as-is? Sometimes the problem is obvious. Sometimes it\'s not where you think it is.' },
      { title: 'I build around that', body: 'A system shaped to your actual workflow. You see it running before any commitment. Not slides. Not mockups. A live system handling real scenarios.' },
      { title: 'It runs', body: 'Live in 2–6 weeks. I stay engaged — refining, expanding, compounding what works.' },
    ],
    howWorksCallout: { strong: 'What used to be manual runs in the background.' },
    proofs: [
      { strong: 'What operators underestimate', p: 'How many bookings are lost in the first hour — and how many hours a week are going to questions a system should handle.' },
      { strong: 'What changes when it\'s fixed', p: 'More inquiries convert. Fewer disappear. Guest communication runs without anyone managing it. The operation scales without adding staff.' },
      { strong: 'The real result', p: 'Same traffic. More of it turns into bookings. Less of it needs a person.' },
    ],
    microProof: "One operator was losing most of their after-hours inquiries. 15+ hours a week answering the same questions manually. After building the system, more inquiries converted. The time came back.",
    ctaHeadline: "I'll show you where this is happening",
    ctaSub: "30 minutes.<br>I'll map where inquiries are going cold and what fixing it actually looks like.<br>No pitch.",
    ctaLossLine: "Every day this isn't fixed,<br>you're paying for it.",
    ctaList: ['— where inquiries are going cold', '— what\'s manual that shouldn\'t be', '— what fixing it costs vs. what leaving it costs', '— what a live system looks like in your operation'],
  },

  'health-fitness': {
    name: 'Health & Fitness',
    headline: "You're with a client.",
    headlineBreak: "By the time you're free, the lead already signed up somewhere else.",
    heroSub: "Most inquiries come in while you're with a client.",
    heroInev: "They don't pick the best coach. They pick the one who replied first.",
    heroReframe: "I find where it's leaking. Sometimes it's response time. Sometimes it's onboarding. Sometimes it's something deeper in the operation. Then I fix it.",
    heroNote: 'Built for personal trainers, online coaches, fitness studios, yoga instructors, and gym owners.',
    heroCta: "Show me where this is happening",
    heroPunch: "Most fitness inquiries decide within an hour.<br>Most coaches reply at the end of the day.",
    heroReality: "DMs land while you're coaching.<br>Replies wait until between sessions.<br>Leads don't wait.<br>They go to whoever responded first.",
    reframeHeadline: "You're paying for the same admin work every week.<br>That shouldn't need a person.",
    reframeBody: "Same pricing questions. Same scheduling back-and-forth. Same reminders. Same follow-up after a no-show. Either you do it between sessions or someone you pay does. That's where time and money go.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'A DM lands during a session', body: 'You see it 90 minutes later. The lead already booked with whoever was faster. That client is gone.' },
      { title: 'Scheduling back-and-forth takes longer than the session', body: "A client asks for a time. You go back and forth. By the time it's locked in, they've already booked somewhere else." },
      { title: 'The same questions, every week', body: 'Pricing. Class times. What to bring. What to expect. Answered from memory across Instagram, email, and text. By you, every day.' },
      { title: 'Leads go cold between inquiry and first session', body: "They message you. You reply later. They've already signed somewhere else." },
    ],
    painCallout: { strong: "You don't have a lead problem.", p: 'You have a workflow problem. Every week it runs manually costs more than fixing it.' },
    offersIntro: "The highest-leverage problem gets fixed.<br>Sometimes that means removing manual work.<br>Sometimes it means fixing how the operation runs underneath it.",
    positioningLine: "Not every problem is automation.<br>But every problem has a cost.<br>That's what I look for first.",
    services: [
      { tag: "DMs don't sit", title: 'Every inquiry answered instantly', body: 'Any channel. Any hour. They get pricing, availability, and a path to booking — not a 6-hour gap.' },
      { tag: 'Calendars fill themselves', title: 'No more back-and-forth', body: 'Clients self-schedule, confirm, and reschedule. Your calendar fills without you managing it.' },
      { tag: "No-shows drop. Clients come back.", title: 'The full client experience, hands-off', body: 'Onboarding. Prep instructions. Reminders. Check-ins. Post-session follow-up. None of it depends on you remembering.' },
      { tag: 'Revenue compounds in the background', title: 'Compounding without admin', body: 'Rebooking prompts. Referral asks. Package upsells. Sent to the right client at the right moment, automatically.' },
    ],
    offerCallout: { strong: "The goal isn't AI.", p: 'The goal is removing the repetitive work — until the operation runs without anyone touching it.' },
    authoritySignal: "This is almost always where the leak is. It's almost never a lead volume problem.",
    howWorks: [
      { title: "I look at what's happening", body: 'I map your workflow. Where are leads going cold? What admin is repeating itself? What\'s the cost of leaving it as-is? Sometimes the problem is obvious. Sometimes it\'s not where you think it is.' },
      { title: 'I build around that', body: 'A system shaped to your actual workflow. You see it running before any commitment. Not slides. Not mockups. A live system handling real scenarios.' },
      { title: 'It runs', body: 'Live in 2–6 weeks. I stay engaged — refining, expanding, compounding what works.' },
    ],
    howWorksCallout: { strong: 'What used to fall through the cracks runs in the background.' },
    proofs: [
      { strong: 'What coaches underestimate', p: 'How many leads go cold between the first DM and the first reply — and how much weekly admin should be running automatically.' },
      { strong: "What changes when it's fixed", p: 'More DMs turn into booked sessions. Fewer no-shows. Less time between sessions spent messaging people.' },
      { strong: 'The real result', p: "Same DMs. More of them turn into booked sessions. Less of your day goes to messaging people." },
    ],
    microProof: "One personal trainer was losing leads to delayed DM replies during sessions. Hours a week on scheduling back-and-forth. After building the system, more conversations turned into booked sessions and the admin time came back.",
    ctaHeadline: "I'll show you where this is happening",
    ctaSub: "30 minutes.<br>I'll map where leads are going cold and what fixing it actually looks like.<br>No pitch.",
    ctaLossLine: "Every day this isn't fixed,<br>you're paying for it.",
    ctaList: ['— where DMs are going cold', '— what scheduling and admin should be automated', '— what fixing it costs vs. what leaving it costs', '— what a live system looks like in your studio'],
  },

  'real-estate': {
    name: 'Real Estate',
    headline: "You're at a showing.",
    headlineBreak: "By the time you're back in the car, that lead's already booked with another agent.",
    heroSub: "Most leads don't come in when you're free to follow up.",
    heroInev: "They don't pick the best agent. They pick the one who called them back.",
    heroReframe: "I find where it's leaking. Sometimes it's response time. Sometimes it's intake. Sometimes it's something deeper in the operation. Then I fix it.",
    heroNote: 'Built for independent agents, brokerages, and small real estate teams.',
    heroCta: "Show me where this is happening",
    heroPunch: "Most buyers contact 3 agents.<br>The one who replies first usually wins the deal.",
    heroReality: "Web forms come in while you're showing.<br>Calls come in mid-closing.<br>Buyers don't wait.<br>They schedule with whoever got back.",
    reframeHeadline: "You're paying someone to chase the same leads every week.<br>That shouldn't need a person.",
    reframeBody: "Same intake questions. Same showing scheduling. Same drip emails. Same follow-up after a property visit. Either you do it between showings or someone you pay does. That's where time and money go.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'A web form comes in mid-showing', body: "You see it 3 hours later. They've already toured with another agent. That commission is gone." },
      { title: 'Some leads never get a real first response', body: "A lead comes in at the wrong time. No one responds. They move on." },
      { title: 'Follow-up is inconsistent', body: "Some leads get five follow-ups. Some get none. The ones that wait don't come back." },
      { title: 'Showings get scheduled by phone tag', body: "Text. Voicemail. Reschedule. Half a day gone just locking one showing." },
    ],
    painCallout: { strong: "You don't have a lead quality problem.", p: 'You have a workflow problem. Every day it runs manually costs more than fixing it.' },
    offersIntro: "The highest-leverage problem gets fixed.<br>Sometimes that means removing manual work.<br>Sometimes it means fixing how the operation runs underneath it.",
    positioningLine: "Not every problem is automation.<br>But every problem has a cost.<br>That's what I look for first.",
    services: [
      { tag: "Leads don't sit", title: 'Every form answered instantly', body: 'Web forms. Texts. Calls. Any channel, any hour. Buyers get qualifying questions and a path to scheduling — not a 3-hour silence.' },
      { tag: 'Showings book themselves', title: 'No more phone tag', body: "Qualified leads pick a time. It lands on your calendar. Confirmation, prep info, reminder — all hands-off." },
      { tag: "Follow-up that never drops", title: 'Every lead gets the same cadence', body: "Drip sequences. Re-engagement after a tour. Listing alerts. Nothing depends on whether you had a slow week or a busy one." },
      { tag: 'Repeat clients come back', title: 'Past clients re-engage automatically', body: 'Anniversary check-ins. Market updates. Referral asks. Sent at the right time, automatically.' },
    ],
    offerCallout: { strong: "The goal isn't AI.", p: 'The goal is removing the repetitive work — until the operation runs without anyone touching it.' },
    authoritySignal: "This is almost always where the leak is. It's almost never a lead quality problem.",
    howWorks: [
      { title: "I look at what's happening", body: "I map your pipeline. Where are leads going cold? What admin is repeating itself? What's the cost of leaving it as-is? Sometimes the problem is obvious. Sometimes it's not where you think it is." },
      { title: 'I build around that', body: 'A system shaped to your actual workflow. You see it running before any commitment. Not slides. Not mockups. A live system handling real scenarios.' },
      { title: 'It runs', body: 'Live in 2–6 weeks. I stay engaged — refining, expanding, compounding what works.' },
    ],
    howWorksCallout: { strong: 'What used to depend on timing runs in the background.' },
    proofs: [
      { strong: 'What agents underestimate', p: 'How many leads go cold in the first hour after a form submission — and how much weekly admin should be running automatically.' },
      { strong: "What changes when it's fixed", p: 'More forms become showings. Fewer leads disappear into the CRM. Follow-up stops depending on how busy the week was.' },
      { strong: 'The real result', p: "Same lead volume. More of them turn into showings. Fewer disappear after the first form." },
    ],
    microProof: "One agent was getting overnight web leads but responding the next morning. Hours a week on follow-up and intake. After building the system, more overnight leads turned into showings and the admin time came back.",
    ctaHeadline: "I'll show you where this is happening",
    ctaSub: "30 minutes.<br>I'll map where leads are going cold and what fixing it actually looks like.<br>No pitch.",
    ctaLossLine: "Every day this isn't fixed,<br>you're paying for it.",
    ctaList: ['— where leads are going cold', '— what follow-up and intake should be automated', '— what fixing it costs vs. what leaving it costs', '— what a live system looks like in your pipeline'],
  },

  'restaurants-food': {
    name: 'Restaurants & Food',
    headline: "The phone rings during service.",
    headlineBreak: "No one picks up. That table sits empty tonight.",
    heroSub: "Most reservation calls come in during the worst possible time to answer them.",
    heroInev: "They don't book the best restaurant. They book the one that picked up.",
    heroReframe: "I find where it's leaking. Sometimes it's reservations. Sometimes it's no-shows. Sometimes it's something deeper in the operation. Then I fix it.",
    heroNote: 'Built for independent restaurants, fine dining, fast casual, catering, and food & beverage teams.',
    heroCta: "Show me where this is happening",
    heroPunch: "Most reservation calls come in between 5pm and 9pm.<br>That's exactly when no one can pick up the phone.",
    heroReality: "The phone rings during service.<br>DMs come in after midnight.<br>Voicemails pile up.<br>Tables that should be filled, sit empty.",
    reframeHeadline: "You're paying someone to take phone calls all day.<br>That shouldn't be the job during service.",
    reframeBody: "Same reservation requests. Same allergy questions. Same private event inquiries. Same reminder texts. Either someone you pay handles it or it slips. That's where time and money go.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'The phone rings mid-service', body: "The phone rings. No one answers. That table goes somewhere else." },
      { title: 'After-hours reservations go to voicemail', body: "They call at 9 or 10. It goes to voicemail. They book somewhere else." },
      { title: 'The same questions, every day', body: "Allergies. Hours. Dress code. What's gluten-free. Answered manually, every day, by someone you pay hourly." },
      { title: 'No-shows cost you peak slots', body: "Empty seat at 7:30 on a Saturday. The reminder didn't go out because someone forgot, or was busy, or wasn't working that day." },
    ],
    painCallout: { strong: "You don't have a marketing problem.", p: 'You have a workflow problem. Every day it runs manually, you lose covers.' },
    offersIntro: "The highest-leverage problem gets fixed.<br>Sometimes that means removing manual work.<br>Sometimes it means fixing how the operation runs underneath it.",
    positioningLine: "Not every problem is automation.<br>But every problem has a cost.<br>That's what I look for first.",
    services: [
      { tag: "Reservations don't sit", title: 'Every booking captured, even mid-service', body: 'Any channel, any hour. Guests confirm a table without your team picking up the phone or manually checking availability.' },
      { tag: "Guest questions don't pile up", title: 'Menu, allergy & policy answers, instantly', body: 'The same questions your team fields 20 times a day — handled automatically, every time, consistently accurate.' },
      { tag: 'No-shows drop', title: 'Reminders never get forgotten', body: 'Confirmation. Reminder the day before. Re-confirmation morning of. None of it depends on someone remembering.' },
      { tag: 'Regulars come back', title: 'Loyalty runs in the background', body: 'Post-visit follow-up. Birthday outreach. Re-booking nudges. Sent automatically, to the right guest at the right moment.' },
    ],
    offerCallout: { strong: "The goal isn't AI.", p: 'The goal is removing the repetitive work — until the operation runs without anyone touching it.' },
    authoritySignal: "This is almost always where the leak is. It's almost never a marketing problem.",
    howWorks: [
      { title: "I look at what's happening", body: "I map your operation. Where are reservations slipping? What's manual that shouldn't be? What's the cost of leaving it as-is? Sometimes the problem is obvious. Sometimes it's not where you think it is." },
      { title: 'I build around that', body: 'A system shaped to your actual workflow. You see it running before any commitment. Not slides. Not mockups. A live system handling real scenarios.' },
      { title: 'It runs', body: 'Live in 2–6 weeks. I stay engaged — refining, expanding, compounding what works.' },
    ],
    howWorksCallout: { strong: 'What used to require someone on the phone runs in the background.' },
    proofs: [
      { strong: 'What restaurants underestimate', p: "How many reservations are lost to voicemail during service — and how many no-shows could have been saved by a reminder." },
      { strong: "What changes when it's fixed", p: 'Same demand. More of it turns into covers. Fewer empty tables at peak hours.' },
      { strong: 'The real result', p: 'Same payroll. More of it on the floor. Less of it on the phone.' },
    ],
    microProof: "One restaurant was missing most of their after-hours reservation calls and dealing with chronic no-shows on Friday nights. After building the system, more bookings came in after hours and the no-show rate dropped.",
    ctaHeadline: "I'll show you where this is happening",
    ctaSub: "30 minutes.<br>I'll map where reservations are slipping and what fixing it actually looks like.<br>No pitch.",
    ctaLossLine: "Every day this isn't fixed,<br>you're paying for it.",
    ctaList: ['— where reservations are going to voicemail', '— what manual work should be automated', '— what fixing it costs vs. what leaving it costs', '— what a live system looks like in your operation'],
  },

  'home-services': {
    name: 'Home Services',
    headline: 'AC goes out at 9pm.',
    headlineBreak: "That call hits voicemail. They dial the next number on the list.",
    heroSub: "Most calls come in when no one's in the office.",
    heroInev: "They don't call the best company. They call the one that picked up.",
    heroReframe: "I find where it's leaking. Sometimes it's intake. Sometimes it's dispatch. Sometimes it's something deeper in the operation. Then I fix it.",
    heroNote: 'Built for HVAC, plumbing, electrical, roofing, landscaping, and other emergency-driven home services.',
    heroCta: "Show me where this is happening",
    heroPunch: "Most emergency calls go to the first responder.<br>Most home services let calls go to voicemail.",
    heroReality: "Calls come in after hours.<br>They come during another job.<br>They don't wait.<br>They dial the next number on the list.",
    reframeHeadline: "You're paying someone to take messages all day.<br>That shouldn't be the job.",
    reframeBody: "Same intake questions. Same dispatch logic. Same scheduling. Same follow-up after the job. Either someone you pay does it or it falls through. That's where time and money go.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'A quote goes out, then nothing', body: 'A quote goes out. No follow-up. That job closes somewhere else.' },
      { title: "You're already on a job", body: "A call comes in. You're mid-job. It goes to voicemail. That job is gone." },
      { title: "Who goes where depends on who picks up the phone", body: "Who's closest. Who's available. Who has the part. All of it lives in someone's head." },
      { title: 'Follow-up never happens', body: 'Job gets done. No review request. No follow-up. No repeat work.' },
    ],
    painCallout: { strong: "You don't have a lead problem.", p: 'You have a workflow problem. Every day it runs manually costs more than fixing it.' },
    offersIntro: "The highest-leverage problem gets fixed.<br>Sometimes that means removing manual work.<br>Sometimes it means fixing how the operation runs underneath it.",
    positioningLine: "Not every problem is automation.<br>But every problem has a cost.<br>That's what I look for first.",
    services: [
      { tag: "Calls don't go to voicemail", title: 'Every call captured, even after hours', body: 'Any time. Any channel. The customer gets immediate intake — name, address, urgency, insurance — before you ever pick up the phone.' },
      { tag: 'Dispatch runs without you', title: 'Jobs routed without manual coordination', body: 'Triaged by urgency. Routed to the right tech. Customer gets confirmation. Without anyone touching it.' },
      { tag: 'Follow-up actually happens', title: 'Quotes, reviews, maintenance reminders', body: 'Quote sent automatically. Review request after every job. Maintenance reminders six months later. None of it depends on remembering.' },
      { tag: 'Revenue compounds in the background', title: 'Repeat work books itself', body: 'Past customers come back without you chasing them. Service plans renew. Cross-sells run automatically.' },
    ],
    offerCallout: { strong: "The goal isn't AI.", p: 'The goal is removing the repetitive work — until intake, dispatch, and follow-up run without anyone touching them.' },
    authoritySignal: "This is almost always where the leak is. It's almost never a leads problem.",
    howWorks: [
      { title: "I look at what's happening", body: 'I map your operation. Where are calls going cold? What\'s manual that shouldn\'t be? What\'s the cost of leaving it as-is? Sometimes the problem is obvious. Sometimes it\'s not where you think it is.' },
      { title: 'I build around that', body: 'A system shaped to your actual workflow. You see it running before any commitment. Not slides. Not mockups. A live system handling real scenarios.' },
      { title: 'It runs', body: 'Live in 2–6 weeks. I stay engaged — refining, expanding, compounding what works.' },
    ],
    howWorksCallout: { strong: 'What used to require someone on the phone runs in the background.' },
    proofs: [
      { strong: 'What home-services owners underestimate', p: 'How many jobs are lost in the first hour after a call — and how much intake and dispatch should be running automatically.' },
      { strong: "What changes when it's fixed", p: 'More calls become jobs. Fewer slip through after hours. Dispatch stops depending on whoever happens to be in the truck.' },
      { strong: 'The real result', p: 'Same call volume. More of those calls turn into jobs. Fewer disappear after hours.' },
    ],
    microProof: "One HVAC company was losing most of their after-hours calls. Hours a week on manual dispatch coordination. After building the system, more emergency calls became jobs and the dispatch time came back.",
    ctaHeadline: "I'll show you where this is happening",
    ctaSub: "30 minutes.<br>I'll map where calls are going cold and what fixing it actually looks like.<br>No pitch.",
    ctaLossLine: "Every day this isn't fixed,<br>you're paying for it.",
    ctaList: ['— where after-hours calls are going to voicemail', '— what intake and dispatch should be automated', '— what fixing it costs vs. what leaving it costs', '— what a live system looks like in your operation'],
  },

  'beauty-wellness': {
    name: 'Beauty & Wellness',
    headline: "You're mid-service.",
    headlineBreak: "Your phone's buzzing. By the time you're done, that client booked somewhere else.",
    heroSub: "Most booking inquiries come in when you're holding scissors, not a phone.",
    heroInev: "They don't pick the best stylist. They pick the one who replied first.",
    heroReframe: "I find where it's leaking. Sometimes it's response time. Sometimes it's no-shows. Sometimes it's something deeper in the operation. Then I fix it.",
    heroNote: 'Built for hair stylists, estheticians, nail techs, massage therapists, and independent wellness practitioners.',
    heroCta: "Show me where this is happening",
    heroPunch: "Most booking decisions happen within an hour.<br>Most stylists reply at the end of the day.",
    heroReality: "DMs land while you're with a client.<br>Replies wait until tonight.<br>They don't wait.<br>They book whoever answered.",
    reframeHeadline: "You're paying for the same admin work every week.<br>That shouldn't need a person.",
    reframeBody: "Same booking questions. Same scheduling back-and-forth. Same reminders. Same follow-up after a no-show. Either you do it between clients or someone you pay does. That's where time and money go.",
    painLabel: "What's actually happening",
    pains: [
      { title: "A DM lands while you're in the chair", body: "You see it 90 minutes later. They already booked across town. That client is gone." },
      { title: 'No-shows cost you peak slots', body: "Empty chair on a Saturday. The reminder didn't go out because someone forgot, or was busy, or wasn't working that day." },
      { title: 'The same questions, every day', body: "Pricing. Availability. What's included. What to bring. Answered manually, between clients, every day." },
      { title: 'Rebooking drops off after the appointment', body: "Client leaves happy. No follow-up. No rebook prompt. Three months later they tried someone new because no one nudged them." },
    ],
    painCallout: { strong: "You don't have a marketing problem.", p: 'You have a workflow problem. Every week it runs manually costs more than fixing it.' },
    offersIntro: "The highest-leverage problem gets fixed.<br>Sometimes that means removing manual work.<br>Sometimes it means fixing how the operation runs underneath it.",
    positioningLine: "Not every problem is automation.<br>But every problem has a cost.<br>That's what I look for first.",
    services: [
      { tag: "DMs don't sit", title: 'Every inquiry answered instantly', body: 'Any channel. Any hour. They get pricing, availability, and a path to booking — not a 6-hour gap.' },
      { tag: 'The chair fills itself', title: 'Bookings without back-and-forth', body: 'Clients pick a slot, confirm, and get prep instructions. Your calendar fills without you managing it.' },
      { tag: 'No-shows drop. Clients rebook.', title: 'The full client experience, hands-off', body: '48-hour and 2-hour reminders. Post-visit rebook prompts. None of it depends on you remembering.' },
      { tag: 'Revenue compounds in the background', title: 'Compounding without admin', body: 'Upsells. Seasonal offers. Referral prompts. Sent to the right client at the right moment, automatically.' },
    ],
    offerCallout: { strong: "The goal isn't AI.", p: 'The goal is removing the repetitive work — until the operation runs without anyone touching it.' },
    authoritySignal: "This is almost always where the leak is. It's almost never a visibility problem.",
    howWorks: [
      { title: "I look at what's happening", body: "I map your workflow. Where are clients going cold? What admin is repeating itself? What's the cost of leaving it as-is? Sometimes the problem is obvious. Sometimes it's not where you think it is." },
      { title: 'I build around that', body: 'A system shaped to your actual workflow. You see it running before any commitment. Not slides. Not mockups. A live system handling real scenarios.' },
      { title: 'It runs', body: 'Live in 2–6 weeks. I stay engaged — refining, expanding, compounding what works.' },
    ],
    howWorksCallout: { strong: 'What used to interrupt your day runs in the background.' },
    proofs: [
      { strong: 'What practitioners underestimate', p: 'How many clients book elsewhere because no one replied in time — and how many hours a week go to admin that should be automatic.' },
      { strong: "What changes when it's fixed", p: 'More DMs turn into booked appointments. Fewer no-shows. Less time between clients spent on the phone.' },
      { strong: 'The real result', p: "Same clientele. More of them rebooking. Less of your day going to anything that isn't the work." },
    ],
    microProof: "One stylist was losing DM inquiries during appointments and dealing with chronic no-shows on weekends. After building the system, more DMs turned into booked slots and the admin time came back.",
    ctaHeadline: "I'll show you where this is happening",
    ctaSub: "30 minutes.<br>I'll map where bookings are slipping and what fixing it actually looks like.<br>No pitch.",
    ctaLossLine: "Every day this isn't fixed,<br>you're paying for it.",
    ctaList: ['— where DMs are going unanswered', '— what scheduling and admin should be automated', '— what fixing it costs vs. what leaving it costs', '— what a live system looks like in your studio'],
  },

  'professional-services': {
    name: 'Professional Services',
    headline: "You're on a 45-minute discovery call.",
    headlineBreak: "Halfway in, you realize they can't afford you. That hour is gone.",
    heroSub: "Most discovery calls happen with leads who never had budget for you in the first place.",
    heroInev: "They don't hire the best firm. They hire the one that responded fast.",
    heroReframe: "I find where it's leaking. Sometimes it's qualification. Sometimes it's intake. Sometimes it's something deeper in the operation. Then I fix it.",
    heroNote: 'Built for attorneys, accountants, financial advisors, consultants, and professional services firms.',
    heroCta: "Show me where this is happening",
    heroPunch: "Every unqualified discovery call is a billable hour you can't recover.<br>Most firms run them all week.",
    heroReality: "Inquiries come in overnight.<br>Intake starts from scratch every time.<br>Discovery calls run with leads who can't afford you.<br>Hours that should be billed get burned on the wrong people.",
    reframeHeadline: "You're paying yourself to do unpaid intake all week.<br>That shouldn't be the job.",
    reframeBody: "Same qualifying questions. Same scheduling back-and-forth. Same intake collection. Same follow-up after the call. Either you do it between client work or someone you pay does. That's where time and money go.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'Unqualified leads take your best hours', body: "45-minute call. They can't afford you. At your rate, that's hundreds of dollars gone, every week." },
      { title: 'Intake is still email threads and PDFs', body: "Same questions, every new client. Asked through back-and-forth email before any real work happens." },
      { title: 'After-hours inquiries go cold', body: "Someone reaches out at 9pm ready to hire. You see it the next morning. They already signed with whoever replied first." },
      { title: 'Your calendar fills with calls that shouldn\'t happen', body: "Time that should be billed goes to conversations that were never going to convert." },
    ],
    painCallout: { strong: "You don't have a pipeline problem.", p: 'You have a workflow problem. Every week it runs manually costs more than fixing it.' },
    offersIntro: "The highest-leverage problem gets fixed.<br>Sometimes that means removing manual work.<br>Sometimes it means fixing how the operation runs underneath it.",
    positioningLine: "Not every problem is automation.<br>But every problem has a cost.<br>That's what I look for first.",
    services: [
      { tag: "Bad-fit leads don't reach your calendar", title: 'Qualification before the call', body: 'Scope. Budget. Timeline. Urgency. Captured before you ever see the lead. You only meet with people worth your time.' },
      { tag: 'Onboarding runs before the first meeting', title: 'Clients arrive ready to start', body: 'New clients complete intake automatically. You arrive with a complete brief, not a blank form and a wishlist of questions.' },
      { tag: 'Consultations book themselves', title: 'No more scheduling back-and-forth', body: 'Qualified prospects pick a time. It lands on your calendar. Confirmation, prep info, reminder — hands-off.' },
      { tag: "After-hours leads don't go cold", title: 'Compounding without admin', body: 'Inquiries at 9pm get an immediate response and a clear path forward — before they sign with someone who replied first.' },
    ],
    offerCallout: { strong: "The goal isn't AI.", p: 'The goal is removing the repetitive work — until every hour you work is worth your rate.' },
    authoritySignal: "This is almost always where the leak is. It's almost never a pipeline problem.",
    howWorks: [
      { title: "I look at what's happening", body: "I map your intake and qualification process. Where are billable hours going? What admin is repeating itself? What's the cost of leaving it as-is? Sometimes the problem is obvious. Sometimes it's not where you think it is." },
      { title: 'I build around that', body: 'A system shaped to your actual workflow. You see it running before any commitment. Not slides. Not mockups. A live system handling real client scenarios.' },
      { title: 'It runs', body: 'Live in 2–6 weeks. I stay engaged — refining, expanding, compounding what works.' },
    ],
    howWorksCallout: { strong: 'What used to eat your billable time runs in the background.' },
    proofs: [
      { strong: 'What professionals underestimate', p: 'How many hours per week go to intake, scheduling, and discovery calls that don\'t convert — and what those hours are actually worth.' },
      { strong: "What changes when it's fixed", p: "Better-fit clients reach you. Worse-fit ones never make it to your calendar. Onboarding runs in the background." },
      { strong: 'The real result', p: 'Same leads. More of them turning into billable engagements. Less of your week going to calls that shouldn\'t have happened.' },
    ],
    microProof: "One firm was running discovery calls all week that weren't converting. Intake started from scratch every new client. After building the qualification and onboarding system, the calls that remained were substantially better fits and clients arrived ready to start.",
    ctaHeadline: "I'll show you where this is happening",
    ctaSub: "30 minutes.<br>I'll map where billable time is going and what fixing it actually looks like.<br>No pitch.",
    ctaLossLine: "Every day this isn't fixed,<br>you're paying for it.",
    ctaList: ["— where unqualified leads are eating your schedule", "— what intake and qualification should be automated", "— what fixing it costs vs. what leaving it costs", "— what a live system looks like in your firm"],
  },

  'ecommerce-retail': {
    name: 'E-commerce & Retail',
    headline: "A shopper adds three items to cart.",
    headlineBreak: "Then closes the tab. They never come back.",
    heroSub: "Most of your traffic leaves without buying — and most of them intended to.",
    heroInev: "They don't buy from the best store. They buy from the one that followed up.",
    heroReframe: "I find where it's leaking. Sometimes it's cart recovery. Sometimes it's support. Sometimes it's something deeper in the operation. Then I fix it.",
    heroNote: 'Built for Shopify stores, DTC brands, online retailers, and e-commerce operators.',
    heroCta: "Show me where this is happening",
    heroPunch: "Most carts are abandoned within 10 minutes.<br>Most stores follow up the next day, if at all.",
    heroReality: "Shoppers add to cart and leave.<br>Browsers spend 8 minutes and bounce.<br>Support tickets pile up overnight.<br>Revenue you already paid for in ad spend slips through.",
    reframeHeadline: "You're paying a team to answer the same questions all day.<br>That shouldn't need a person.",
    reframeBody: "Same order status questions. Same return policies. Same product specs. Same shipping inquiries. Either someone you pay handles them or tickets pile up. That's where time and money go.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'A cart sits with three items in it', body: "Shopper got distracted. No follow-up. By morning the tab is closed and they've forgotten you exist." },
      { title: 'A browser spends 8 minutes and leaves', body: "No capture. No second chance. That traffic cost you money in ad spend and you got nothing back." },
      { title: 'Support answers the same questions all day', body: 'Order status. Returns. Product specs. Shipping. Answered manually, hundreds of times a week. That\'s payroll doing a script\'s job.' },
      { title: 'Post-purchase drops off', body: "Order ships. Then nothing. No review request. No reorder prompt. No reason for them to come back." },
    ],
    painCallout: { strong: "You don't have a traffic problem.", p: 'You have a workflow problem. Every day it runs manually costs revenue.' },
    offersIntro: "The highest-leverage problem gets fixed.<br>Sometimes that means removing manual work.<br>Sometimes it means fixing how the operation runs underneath it.",
    positioningLine: "Not every problem is automation.<br>But every problem has a cost.<br>That's what I look for first.",
    services: [
      { tag: "Carts don't sit", title: 'Abandoned carts get followed up automatically', body: 'Timed sequences sent when shoppers are most likely to return — personalized to exactly what they left behind.' },
      { tag: 'Support tickets stop piling up', title: 'Questions answered 24/7 without a human', body: 'Order status. Returns. Specs. Policies. Handled instantly. Your team handles only what actually needs judgment.' },
      { tag: 'Browsers get a second chance', title: 'Capture before they leave', body: 'Exit intent. Browse abandonment. Email capture. Another shot at traffic you already paid for.' },
      { tag: 'Repeat customers come back', title: 'Compounding without manual work', body: 'Shipping updates. Review requests. Reorder prompts. Sent at the right moment, automatically.' },
    ],
    offerCallout: { strong: "The goal isn't AI.", p: 'The goal is removing the repetitive work — until traffic you already paid for converts at a higher rate.' },
    authoritySignal: "This is almost always where the leak is. It's almost never a traffic problem.",
    howWorks: [
      { title: "I look at what's happening", body: "I map your funnel. Where are shoppers dropping off? What support is repeating itself? What's the cost of leaving it as-is? Sometimes the problem is obvious. Sometimes it's not where you think it is." },
      { title: 'I build around that', body: 'A system shaped to your actual store. You see it running before any commitment. Not slides. Not mockups. A live system handling real scenarios.' },
      { title: 'It runs', body: 'Live in 2–6 weeks. I stay engaged — refining, expanding, compounding what works.' },
    ],
    howWorksCallout: { strong: 'What used to require a team member runs in the background.' },
    proofs: [
      { strong: 'What store owners underestimate', p: 'How much revenue is sitting in abandoned carts — and how much support labor goes to questions a system could be answering.' },
      { strong: "What changes when it's fixed", p: 'More carts get recovered. Fewer tickets pile up. Repeat purchases come from customers who already trust you.' },
      { strong: 'The real result', p: 'Same traffic. More of it converts. Less of it needs a person to support.' },
    ],
    microProof: "One store had significant cart abandonment and a support team fielding the same questions all day. After adding automated recovery sequences and an instant-response layer, cart conversion improved and support volume dropped.",
    ctaHeadline: "I'll show you where this is happening",
    ctaSub: "30 minutes.<br>I'll map where shoppers are dropping off and what fixing it actually looks like.<br>No pitch.",
    ctaLossLine: "Every day this isn't fixed,<br>you're paying for it.",
    ctaList: ["— where cart abandonment is costing you most", "— what support work should be automated", "— what fixing it costs vs. what leaving it costs", "— what a live system looks like in your store"],
  },

  'auto-dealerships': {
    name: 'Auto & Dealerships',
    headline: "A buyer fills out a form at 11pm.",
    headlineBreak: "By morning, they've booked a test drive at the dealership down the road.",
    heroSub: "Most car shoppers research at night. Most dealerships respond in the morning.",
    heroInev: "They don't buy from the best lot. They buy from the one that called back first.",
    heroReframe: "I find where it's leaking. Sometimes it's overnight response. Sometimes it's service scheduling. Sometimes it's something deeper in the operation. Then I fix it.",
    heroNote: 'Built for independent dealers, franchise dealerships, and automotive groups managing web leads.',
    heroCta: "Show me where this is happening",
    heroPunch: "Most car shoppers research between 9pm and midnight.<br>Most dealerships respond at 9am.",
    heroReality: "Web forms come in overnight.<br>Service calls fill the line during peak hours.<br>Buyers don't wait for the morning.<br>They book a test drive with whoever answered.",
    reframeHeadline: "You're paying a sales floor to chase the same leads every week.<br>That shouldn't be the job.",
    reframeBody: "Same lead intake. Same service scheduling. Same follow-up cadence. Same trade-in questions. Either someone you pay handles it or it slips. That's where time and money go.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'A web form comes in at 11pm', body: "No one responds until morning. By then they've booked a test drive at the dealership down the road. That deal is gone." },
      { title: "Lead follow-up depends on who's working", body: "Hot lead on a slow Tuesday gets called back in 20 minutes. Same lead on a busy Saturday is still sitting there Monday." },
      { title: 'The service line is always backed up', body: "Customers on hold. Advisors tied up. Scheduling calls burning floor time that should be closing sales." },
      { title: 'Your team walks in cold', body: "Hot lead arrives. Nobody pulled the file. Nobody knows their budget or trade-in. The buyer feels it, and the deal cools." },
    ],
    painCallout: { strong: "You don't have a traffic problem.", p: 'You have a workflow problem. Every day it runs manually costs deals.' },
    offersIntro: "The highest-leverage problem gets fixed.<br>Sometimes that means removing manual work.<br>Sometimes it means fixing how the operation runs underneath it.",
    positioningLine: "Not every problem is automation.<br>But every problem has a cost.<br>That's what I look for first.",
    services: [
      { tag: "Overnight leads don't go cold", title: 'Every web lead answered immediately', body: 'Vehicle interest, budget, trade-in, timeline captured before your team sees it. Day or night.' },
      { tag: 'Service books itself', title: 'No more phone bottleneck', body: 'Customers schedule, confirm, and reschedule online. Advisors stay on the floor. Phones free up for buyers.' },
      { tag: "Follow-up runs the same on busy and slow days", title: 'Cadence without depending on staffing', body: 'Every lead gets consistent touchpoints. Busy Saturday or slow Tuesday — the system runs the same way.' },
      { tag: 'Your team walks in briefed', title: 'Hot lead summaries before they arrive', body: 'Vehicle interest. Budget. Trade-in. Timeline. Waiting for your team before they shake the buyer\'s hand.' },
    ],
    offerCallout: { strong: "The goal isn't AI.", p: 'The goal is removing the repetitive work — until your team spends their time selling, not scheduling.' },
    authoritySignal: "This is almost always where the leak is. It's almost never a traffic or inventory problem.",
    howWorks: [
      { title: "I look at what's happening", body: "I map your lead flow. Where are leads going cold? What's manual that shouldn't be? What's the cost of leaving it as-is? Sometimes the problem is obvious. Sometimes it's not where you think it is." },
      { title: 'I build around that', body: 'A system shaped to your actual operation. You see it running before any commitment. Not slides. Not mockups. A live system handling real leads.' },
      { title: 'It runs', body: 'Live in 2–6 weeks. I stay engaged — refining, expanding, compounding what works.' },
    ],
    howWorksCallout: { strong: 'What used to depend on who was working runs in the background.' },
    proofs: [
      { strong: 'What dealerships underestimate', p: 'How many web leads go cold overnight before anyone calls — and how much floor time goes to scheduling and follow-up.' },
      { strong: "What changes when it's fixed", p: 'More overnight leads convert. More test drives book. Follow-up runs the same way regardless of staffing.' },
      { strong: 'The real result', p: 'Same lead volume. More of them turn into test drives. Less of your team\'s time on the phone.' },
    ],
    microProof: "One dealership was getting consistent web leads overnight with no system to respond until the next morning. After automating the first response and follow-up cadence, more overnight leads converted to showroom visits.",
    ctaHeadline: "I'll show you where this is happening",
    ctaSub: "30 minutes.<br>I'll map where leads are going cold and what fixing it actually looks like.<br>No pitch.",
    ctaLossLine: "Every day this isn't fixed,<br>you're paying for it.",
    ctaList: ["— where overnight leads are disappearing", "— what follow-up and scheduling should be automated", "— what fixing it costs vs. what leaving it costs", "— what a live system looks like in your operation"],
  },

  'education-tutoring': {
    name: 'Education & Tutoring',
    headline: "A parent reaches out Tuesday.",
    headlineBreak: "You respond Friday. They enrolled somewhere else Thursday.",
    heroSub: "Most enrollment decisions happen in the first 72 hours after the inquiry.",
    heroInev: "They don't enroll with the best program. They enroll where someone replied.",
    heroReframe: "I find where it's leaking. Sometimes it's response time. Sometimes it's enrollment paperwork. Sometimes it's something deeper in the operation. Then I fix it.",
    heroNote: 'Built for tutoring centers, online educators, learning programs, test prep companies, and independent instructors.',
    heroCta: "Show me where this is happening",
    heroPunch: "Most families decide within 72 hours of reaching out.<br>Most programs reply by the end of the week.",
    heroReality: "Inquiries come in evenings and weekends.<br>Replies wait until Monday morning.<br>Families don't wait.<br>They enroll wherever they got an answer.",
    reframeHeadline: "You're paying staff to answer the same questions every week.<br>That shouldn't need a person.",
    reframeBody: "Same program questions. Same enrollment paperwork. Same scheduling back-and-forth. Same progress updates. Either someone you pay handles it or it slips. That's where time and money go.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'An inquiry comes in Tuesday evening', body: "You reply Friday morning. They already enrolled with the program that responded Wednesday." },
      { title: 'The same program questions, every day', body: "Curriculum. Schedule. Prerequisites. Pricing. Placement. Answered manually, one at a time, every single inquiry." },
      { title: 'Enrollment is still email threads and PDFs', body: "Application. Assessment. Onboarding packet. Done through email threads, by hand, for every student." },
      { title: 'Good leads go cold between inquiry and commitment', body: "Someone shows interest. Three days pass. They enrolled somewhere that stayed in touch." },
    ],
    painCallout: { strong: "You don't have a demand problem.", p: 'You have a workflow problem. Every week it runs manually costs enrollments.' },
    offersIntro: "The highest-leverage problem gets fixed.<br>Sometimes that means removing manual work.<br>Sometimes it means fixing how the operation runs underneath it.",
    positioningLine: "Not every problem is automation.<br>But every problem has a cost.<br>That's what I look for first.",
    services: [
      { tag: "Inquiries don't sit", title: 'Every family gets an instant answer', body: 'Program info. Pricing. Scheduling. Fit assessment. Handled automatically. No waiting for a business-hours reply.' },
      { tag: 'Nurture that converts', title: 'Consistent follow-up to the decision', body: 'Every inquiry gets touchpoints until they enroll or opt out. Nothing falls through between the first message and the commit.' },
      { tag: 'Enrollment runs itself', title: 'Paperwork without email threads', body: 'Applications. Assessments. Onboarding materials. Collected and processed automatically. Admin stays flat as you grow.' },
      { tag: 'Students stay. Families refer.', title: 'Compounding without admin', body: 'Progress updates. Rebooking prompts. Referral requests. Sent automatically at the right moment.' },
    ],
    offerCallout: { strong: "The goal isn't AI.", p: 'The goal is removing the repetitive work — until the operation runs without anyone touching it.' },
    authoritySignal: "This is almost always where the leak is. It's almost never a demand problem.",
    howWorks: [
      { title: "I look at what's happening", body: "I map your inquiry-to-enrollment process. Where are families going cold? What admin is repeating itself? What's the cost of leaving it as-is? Sometimes the problem is obvious. Sometimes it's not where you think it is." },
      { title: 'I build around that', body: 'A system shaped to your actual workflow. You see it running before any commitment. Not slides. Not mockups. A live system handling real inquiries.' },
      { title: 'It runs', body: 'Live in 2–6 weeks. I stay engaged — refining, expanding, compounding what works.' },
    ],
    howWorksCallout: { strong: 'What used to depend on someone following up runs in the background.' },
    proofs: [
      { strong: 'What programs underestimate', p: 'How many families quietly enroll elsewhere because no one stayed in touch in the first 72 hours — and how much admin time goes to work a system should handle.' },
      { strong: "What changes when it's fixed", p: 'More inquiries convert. Enrollment becomes predictable. Your team handles students instead of paperwork.' },
      { strong: 'The real result', p: 'Same inquiries. More of them turn into enrolled students. Less of the week going to admin.' },
    ],
    microProof: "One tutoring program was getting consistent inquiries but follow-up was inconsistent and enrollment paperwork started from scratch every time. After automating both, more inquiries converted and the admin workload didn't grow with enrollment.",
    ctaHeadline: "I'll show you where this is happening",
    ctaSub: "30 minutes.<br>I'll map where families are going cold and what fixing it actually looks like.<br>No pitch.",
    ctaLossLine: "Every day this isn't fixed,<br>you're paying for it.",
    ctaList: ["— where inquiries are going quiet", "— what follow-up and enrollment should be automated", "— what fixing it costs vs. what leaving it costs", "— what a live system looks like in your program"],
  },

  'events-entertainment': {
    name: 'Events & Entertainment',
    headline: "An inquiry comes in for a wedding next June.",
    headlineBreak: "By the time you've collected the details to quote, three other vendors already sent numbers.",
    heroSub: "Most event bookings go to whoever quoted first — not whoever was best.",
    heroInev: "They don't book the best vendor. They book the one that responded with a real number.",
    heroReframe: "I find where it's leaking. Sometimes it's intake. Sometimes it's quote turnaround. Sometimes it's something deeper in the operation. Then I fix it.",
    heroNote: 'Built for event planners, photographers, caterers, DJs, venues, and entertainment companies.',
    heroCta: "Show me where this is happening",
    heroPunch: "Most clients book the first vendor who quotes.<br>Most vendors take days to collect the details first.",
    heroReality: "Inquiries come in over the weekend.<br>Intake takes a back-and-forth.<br>Quotes go out days later.<br>Faster vendors already booked the date.",
    reframeHeadline: "You're paying yourself to gather the same details every inquiry.<br>That shouldn't need a person.",
    reframeBody: "Same intake questions. Same quote process. Same follow-up when they go quiet. Same coordination after they say yes. Either you do it between events or someone you pay does. That's where time and money go.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'Intake takes a back-and-forth before you can quote', body: "Date. Headcount. Budget. Venue. Vibe. Collected from scratch every inquiry. Meanwhile someone else is already sending a number." },
      { title: 'Quotes go out days after the inquiry', body: "You're building a proposal while they're hearing back from three other vendors. First real number wins. It's almost never about price." },
      { title: 'Follow-up falls off after you send the quote', body: "They go quiet. You mean to follow up. You don't. Someone with a system did, and they got the date." },
      { title: 'Post-booking coordination is its own full-time job', body: "Contract. Deposit. Vendor coordination. Day-of logistics. Managed through email threads, calendar reminders, and memory." },
    ],
    painCallout: { strong: "You don't have an inquiry problem.", p: 'You have a workflow problem. Every week it runs manually costs bookings.' },
    offersIntro: "The highest-leverage problem gets fixed.<br>Sometimes that means removing manual work.<br>Sometimes it means fixing how the operation runs underneath it.",
    positioningLine: "Not every problem is automation.<br>But every problem has a cost.<br>That's what I look for first.",
    services: [
      { tag: "Intake doesn't slow you down", title: 'Event details captured before you reply', body: 'Date. Headcount. Budget. Venue. Vibe. Captured automatically. You quote on the first reply instead of sending a questionnaire.' },
      { tag: 'You quote before competitors reply', title: 'First real number wins', body: 'With intake handled, your first reply is a real number. First vendor to quote wins. The system makes sure that\'s you.' },
      { tag: "Quotes don't go unanswered", title: 'Follow-up fires automatically', body: "If they go quiet after the quote, the system follows up. You stop losing bookings to whoever remembered to check in." },
      { tag: 'Coordination runs itself', title: 'Compounding without admin', body: 'Contracts. Deposits. Day-of logistics. Vendor confirmations. Handled automatically from the moment they say yes.' },
    ],
    offerCallout: { strong: "The goal isn't AI.", p: 'The goal is removing the repetitive work — until you respond first and the booking closes itself.' },
    authoritySignal: "This is almost always where the leak is. It's almost never an inquiry volume problem.",
    howWorks: [
      { title: "I look at what's happening", body: "I map your inquiry-to-booking process. Where are quotes slowing down? What admin is repeating itself? What's the cost of leaving it as-is? Sometimes the problem is obvious. Sometimes it's not where you think it is." },
      { title: 'I build around that', body: 'A system shaped to your actual operation. You see it running before any commitment. Not slides. Not mockups. A live system handling real inquiries.' },
      { title: 'It runs', body: 'Live in 2–6 weeks. I stay engaged — refining, expanding, compounding what works.' },
    ],
    howWorksCallout: { strong: 'What used to slow down your quote process runs in the background.' },
    proofs: [
      { strong: 'What event vendors underestimate', p: 'How often bookings go to competitors who quoted first — not better, not cheaper, just faster.' },
      { strong: "What changes when it's fixed", p: 'More inquiries convert to quotes. More quotes convert to bookings. You stop losing dates to vendors who moved faster.' },
      { strong: 'The real result', p: 'Same inquiries. More of them turn into bookings. Less time on intake and back-and-forth.' },
    ],
    microProof: "One event vendor was spending days collecting details before they could even quote — while competitors were already responding. After automating intake, they were quoting on the first reply and converting more inquiries.",
    ctaHeadline: "I'll show you where this is happening",
    ctaSub: "30 minutes.<br>I'll map where bookings are slipping and what fixing it actually looks like.<br>No pitch.",
    ctaLossLine: "Every day this isn't fixed,<br>you're paying for it.",
    ctaList: ["— where intake is slowing down your quotes", "— what should be automated first", "— what fixing it costs vs. what leaving it costs", "— what a live system looks like in your operation"],
  },

  'property-management': {
    name: 'Property Management',
    headline: "A pipe bursts at 11pm.",
    headlineBreak: "By the time someone reads the email tomorrow, the tenant's already left a one-star review.",
    heroSub: "Most maintenance requests come in when no one's at the desk to triage them.",
    heroInev: "They don't remember the response that fixed it. They remember the wait.",
    heroReframe: "I find where it's leaking. Sometimes it's maintenance routing. Sometimes it's leasing. Sometimes it's something deeper in the operation. Then I fix it.",
    heroNote: 'Built for property managers, landlords, and management companies handling 20+ units (long-term and short-term/vacation rentals).',
    heroCta: "Show me where this is happening",
    heroPunch: "Most issues happen outside business hours.<br>Most teams handle them next morning.",
    heroReality: "Tenants text at midnight.<br>Vacancy inquiries come in over the weekend.<br>They don't wait.<br>They post a review or rent somewhere else.",
    reframeHeadline: "You're paying a team to answer the same questions every day.<br>That shouldn't need people.",
    reframeBody: "Same maintenance triage. Same lease questions. Same showing coordination. Same renewal reminders. Either someone you pay handles it or it slips. That's where time and money go.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'A maintenance request comes in at 11pm', body: "Email. Text. Voicemail. Sometimes all three. By morning the tenant is angry and the issue is bigger than it had to be." },
      { title: 'Every new tenant asks the same questions', body: 'Lease terms. Parking. Payment portal. Trash schedules. Explained again for every move-in. Multiply by your turnover rate.' },
      { title: 'Showing coordination takes ten emails', body: "Prospect wants to see a unit. Three emails from you. Two replies. A reschedule. The unit sits vacant while you coordinate." },
      { title: "Your team is maxed at a unit count that should be higher", body: "Most of what they do is repetitive communication a system should handle. Instead it's their whole day, and you can't add units without adding people." },
    ],
    painCallout: { strong: "You don't have a staffing problem.", p: 'You have a workflow problem. Every day it runs manually costs more than fixing it.' },
    offersIntro: "The highest-leverage problem gets fixed.<br>Sometimes that means removing manual work.<br>Sometimes it means fixing how the operation runs underneath it.",
    positioningLine: "Not every problem is automation.<br>But every problem has a cost.<br>That's what I look for first.",
    services: [
      { tag: "Maintenance doesn't slip", title: 'Requests captured and routed automatically', body: 'Tenants submit through one interface. Urgency triaged. Vendor notified. Tenant updated. Without your team touching it.' },
      { tag: 'Tenants stop calling for the basics', title: 'Lease, payment, and policy questions answered 24/7', body: "Move-in procedures. Trash schedules. Portal logins. Handled automatically. Your team isn't fielding the same calls all day." },
      { tag: 'Showings book themselves', title: 'No more email back-and-forth', body: 'Prospective tenants pick a time, get a confirmation, receive prep info, get a reminder. Without a single back-and-forth from your team.' },
      { tag: 'More units, same team', title: 'Compounding without headcount', body: 'Rent reminders. Renewal prompts. Inspection notices. Sent to the right tenants at the right time, automatically.' },
    ],
    offerCallout: { strong: "The goal isn't AI.", p: 'The goal is removing the repetitive work — until your team handles only the work that actually needs them.' },
    authoritySignal: "This is almost always where the leak is. It's almost never a staffing problem.",
    howWorks: [
      { title: "I look at what's happening", body: "I map your team's workflow. Where are requests slipping? What's manual that shouldn't be? What's the cost of leaving it as-is? Sometimes the problem is obvious. Sometimes it's not where you think it is." },
      { title: 'I build around that', body: 'A system shaped to your actual operation. You see it running before any commitment. Not slides. Not mockups. A live system handling real tenants and real units.' },
      { title: 'It runs', body: 'Live in 2–6 weeks. I stay engaged — refining, expanding, compounding what works.' },
    ],
    howWorksCallout: { strong: "What used to fill your team's inbox runs in the background." },
    proofs: [
      { strong: "What property managers underestimate", p: "How much of the team's day goes to communication that follows the same patterns every time — and how many units they could manage if that time came back." },
      { strong: "What changes when it's fixed", p: 'Maintenance resolves faster. Fewer tenant complaints. Showings book themselves. The team focuses on the work that actually requires them.' },
      { strong: 'The real result', p: 'Same team. More units managed. Less of the day going to inbox triage.' },
    ],
    microProof: "One property management company was triaging maintenance requests through texts, calls, and emails. The team was fielding the same tenant questions all day. After routing everything through one system, less slipped and the team had capacity for more units.",
    ctaHeadline: "I'll show you where this is happening",
    ctaSub: "30 minutes.<br>I'll map where your team is losing time and what fixing it actually looks like.<br>No pitch.",
    ctaLossLine: "Every day this isn't fixed,<br>you're paying for it.",
    ctaList: ["— where maintenance triage is slipping", "— what tenant communication should be automated", "— what fixing it costs vs. what leaving it costs", "— what a live system looks like in your portfolio"],
  },

  'medical-dental': {
    name: 'Medical & Dental',
    headline: "Someone calls to book.",
    headlineBreak: "Front desk is on another line. They hang up and call the next office.",
    heroSub: "Most patient calls come in when the front desk can't pick up.",
    heroInev: "They don't pick the best provider. They pick the office that answered.",
    heroReframe: "I find where it's leaking. Sometimes it's missed calls. Sometimes it's no-shows. Sometimes it's something deeper in the operation. Then I fix it.",
    heroNote: 'Built for dental offices, medical practices, specialist clinics, and independent healthcare providers.',
    heroCta: "Show me where this is happening",
    heroPunch: "Most patient calls happen during business hours.<br>Most of those happen when the front desk is already on the phone.",
    heroReality: "Phones ring during appointments.<br>Reminder calls eat staff hours.<br>Recall lists never get pulled.<br>Patients fall through and book somewhere else.",
    reframeHeadline: "You're paying a front desk to do what shouldn't need a person.<br>That's where the schedule leaks.",
    reframeBody: "Same scheduling questions. Same reminder calls. Same recall lists. Same insurance basics. Either the front desk handles it or it slips. That's where time and money go.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'A call comes in during another call', body: "Front desk is on the phone with one patient. Another patient calls. Voicemail. They don't leave a message. They call the next office." },
      { title: 'Reminder calls are eating staff hours', body: "Manual confirmations for tomorrow's schedule. Same work, every day, handled by a person instead of a system." },
      { title: 'No-shows cost the slot and the revenue', body: "Patient forgets. Without two-way confirmation, the slot stays empty and can't be backfilled in time." },
      { title: "Recall lists never get pulled", body: "Patients due for cleanings and follow-ups aren't hearing from you. The list is in the PMS. Nobody's calling it. They go somewhere that did." },
    ],
    painCallout: { strong: "You don't have a patient problem.", p: 'You have a workflow problem. Every day it runs manually costs appointments.' },
    offersIntro: "The highest-leverage problem gets fixed.<br>Sometimes that means removing manual work.<br>Sometimes it means fixing how the operation runs underneath it.",
    positioningLine: "Not every problem is automation.<br>But every problem has a cost.<br>That's what I look for first.",
    services: [
      { tag: "Calls don't go to voicemail", title: 'Every patient inquiry handled, any hour', body: 'Scheduling. Questions. Directions. Insurance basics. Handled instantly. Front desk picks up only what actually needs them.' },
      { tag: 'No-shows drop. The schedule stays full.', title: 'Reminders that actually run', body: 'Automated reminders. Two-way confirmations. Cancellation recovery. None of it depends on staff making calls.' },
      { tag: 'Lapsed patients come back', title: 'Recall that runs in the background', body: 'Overdue cleanings. Annual checkups. Follow-up care. Outreach fires automatically. No one pulls a list.' },
      { tag: 'Admin runs itself', title: 'Compounding without staff time', body: 'Intake forms. Post-visit instructions. Insurance pre-auth follow-up. The repetitive coordination running off staff time, automated.' },
    ],
    offerCallout: { strong: "The goal isn't AI.", p: 'The goal is removing the repetitive work — until your staff focuses on patients in the office instead of the phone.' },
    authoritySignal: "This is almost always where the leak is. It's almost never a patient volume problem.",
    howWorks: [
      { title: "I look at what's happening", body: "I map your front-desk workflow. Where are calls being lost? What's manual that shouldn't be? What's the cost of leaving it as-is? Sometimes the problem is obvious. Sometimes it's not where you think it is." },
      { title: 'I build around that', body: 'A system shaped to your actual practice. You see it running before any commitment. Not slides. Not mockups. A live system handling real scenarios.' },
      { title: 'It runs', body: 'Live in 2–6 weeks. I stay engaged — refining, expanding, compounding what works.' },
    ],
    howWorksCallout: { strong: "What used to fill the front desk's day runs in the background." },
    proofs: [
      { strong: 'What practices underestimate', p: "How many patients call once, don't leave a message, and book elsewhere — and how many no-shows could have been prevented with an automated reminder sequence." },
      { strong: "What changes when it's fixed", p: 'Fewer missed calls. More confirmed appointments. Recall runs automatically. The front desk focuses on patients in the office.' },
      { strong: 'The real result', p: 'Same patient volume. More appointments kept. Less of the day going to phones.' },
    ],
    microProof: "One dental office was losing potential patients to voicemail during busy hours and spending 10+ hours a week on manual reminder calls. After automating scheduling response and reminders, no-show rates dropped and front-desk time came back.",
    ctaHeadline: "I'll show you where this is happening",
    ctaSub: "30 minutes.<br>I'll map where appointments are slipping and what fixing it actually looks like.<br>No pitch.",
    ctaLossLine: "Every day this isn't fixed,<br>you're paying for it.",
    ctaList: ["— where calls are going unanswered", "— what reminder and recall work should be automated", "— what fixing it costs vs. what leaving it costs", "— what a live system looks like in your practice"],
  },

  'insurance': {
    name: 'Insurance Agencies',
    headline: "A quote request comes in Friday afternoon.",
    headlineBreak: "You follow up Tuesday. They bound coverage with someone else Monday.",
    heroSub: "Most quote requests don't come in during business hours.",
    heroInev: "They don't pick the best agent. They pick the one who followed up first.",
    heroReframe: "I find where it's leaking. Sometimes it's quote response. Sometimes it's renewals. Sometimes it's something deeper in the operation. Then I fix it.",
    heroNote: 'Built for independent agencies, captive agents, and brokers managing personal and commercial lines.',
    heroCta: "Show me where this is happening",
    heroPunch: "Most quote requests are decided within 48 hours.<br>Most agencies follow up within a week, if at all.",
    heroReality: "Quotes come in over the weekend.<br>Renewal lists never get worked.<br>Cross-sell never happens.<br>Premium walks out without anyone noticing.",
    reframeHeadline: "You're paying staff to chase the same quotes and renewals every week.<br>That shouldn't need a person.",
    reframeBody: "Same quote follow-up. Same renewal outreach. Same document chasing. Same cross-sell prompts that nobody's sending. Either someone you pay handles it or it slips. That's where time and money go.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'A quote request sits over the weekend', body: "Lead comes in Friday. By Monday they've heard from two other agents. By Tuesday they've bound. Your follow-up was never going to be first." },
      { title: 'Renewals slip without outreach', body: "Policy renewal requires proactive contact. When that contact is manual, some renewals don't happen — and the client lapses without you ever knowing a conversation could have kept them." },
      { title: 'Cross-sell never happens', body: "Auto clients should hear about home. Home clients should hear about umbrella. Nobody's making those calls. Premium that should compound just sits." },
      { title: 'Document chasing drags every new policy', body: "Signed apps. Supporting docs. Payment info. Multi-touch back-and-forth on every new policy. Days lost on every bind." },
    ],
    painCallout: { strong: "You don't have a leads problem.", p: 'You have a workflow problem. Every day it runs manually costs premium.' },
    offersIntro: "The highest-leverage problem gets fixed.<br>Sometimes that means removing manual work.<br>Sometimes it means fixing how the operation runs underneath it.",
    positioningLine: "Not every problem is automation.<br>But every problem has a cost.<br>That's what I look for first.",
    services: [
      { tag: "Quote requests don't sit", title: 'Every inquiry answered instantly', body: 'Any channel. Any hour. Prospects get real engagement and a clear path to a quote before they\'ve had time to call your competitor.' },
      { tag: 'Renewals run automatically', title: 'No more working the list by hand', body: 'Proactive outreach. Multi-touch follow-up. Payment reminders. Running without anyone watching a calendar.' },
      { tag: 'Cross-sell happens on its own', title: 'Compounding from the book you already have', body: 'Automated cross-sell sequences. Annual review prompts. Reactivation for lapsed clients. Sent at the right moment, automatically.' },
      { tag: 'Document collection on autopilot', title: 'New policies move without staff chasing', body: 'Signed apps. Supporting docs. Payment collection. Multi-touch follow-up that closes the bind without manual work.' },
    ],
    offerCallout: { strong: "The goal isn't AI.", p: 'The goal is removing the repetitive work — until staff converts the leads they have and keeps the clients they wrote.' },
    authoritySignal: "This is almost always where the leak is. It's almost never a leads problem.",
    howWorks: [
      { title: "I look at what's happening", body: "I map your agency's workflow. Where are quotes going cold? What's manual that shouldn't be? What's the cost of leaving it as-is? Sometimes the problem is obvious. Sometimes it's not where you think it is." },
      { title: 'I build around that', body: 'A system shaped to your actual operation. You see it running before any commitment. Not slides. Not mockups. A live system handling real quotes and real renewals.' },
      { title: 'It runs', body: 'Live in 2–6 weeks. I stay engaged — refining, expanding, compounding what works.' },
    ],
    howWorksCallout: { strong: 'What used to require staff working a list runs in the background.' },
    proofs: [
      { strong: "What agencies underestimate", p: "How many quote requests go cold before the first follow-up — and how much renewal premium is lost to clients who simply never heard back at the right time." },
      { strong: "What changes when it's fixed", p: 'More quotes convert. Fewer renewals lapse. Cross-sell happens automatically. Staff focuses on clients instead of chasing.' },
      { strong: 'The real result', p: 'Same book. More premium retained. Less of the week going to follow-up that should run itself.' },
    ],
    microProof: "One independent agency was losing quote requests to slow follow-up and missing renewal outreach on a portion of their book. After automating lead response and renewal sequences, conversion improved and fewer clients lapsed at renewal.",
    ctaHeadline: "I'll show you where this is happening",
    ctaSub: "30 minutes.<br>I'll map where premium is walking out and what fixing it actually looks like.<br>No pitch.",
    ctaLossLine: "Every day this isn't fixed,<br>you're paying for it.",
    ctaList: ["— where quote requests are going cold", "— what renewal and cross-sell work should be automated", "— what fixing it costs vs. what leaving it costs", "— what a live system looks like in your agency"],
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

  const heroPunchHtml = niche.heroPunch
    ? `<p class="hero-punch">${niche.heroPunch}</p>`
    : '';
  const heroRealityHtml = niche.heroReality
    ? `<p class="hero-reality">${niche.heroReality}</p>`
    : '';
  const postHeroHtml = (heroPunchHtml || heroRealityHtml)
    ? `<div class="post-hero">${heroPunchHtml}${heroRealityHtml}</div>`
    : '';

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
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <meta property="og:title" content="NCSystems — ${niche.name}">
  <meta property="og:description" content="AI systems built for ${niche.name.toLowerCase()} businesses. Find where you're losing money and fix it.">
  <meta property="og:image" content="https://ncsystems.io/og-image.png">
  <meta property="og:url" content="https://ncsystems.io/${Object.keys(NICHES).find(k => NICHES[k] === niche)}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://ncsystems.io/og-image.png">
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
    .nav-right { display: flex; align-items: center; gap: 1.5rem; }
    .nav-link { font-size: 13px; color: rgba(237,238,242,0.38); text-decoration: none; letter-spacing: 0.04em; transition: color 0.2s; }
    .nav-link:hover { color: var(--fg); }
    .nav-cta { font-size: 13px; color: var(--muted); text-decoration: none; letter-spacing: 0.04em; transition: color 0.2s; }
    .nav-cta:hover { color: var(--fg); }

    /* Hero */
    .hero { max-width: 820px; margin: 0 auto; padding: 6rem 2rem 4rem; text-align: center; }
    .niche-tag { display: inline-block; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(237,238,242,0.35); border: 1px solid var(--pill); border-radius: 20px; padding: 5px 14px; margin-bottom: 2rem; }
    .hero h1 { font-size: clamp(2.15rem, 5vw, 3.35rem); font-weight: 700; line-height: 1.06; letter-spacing: -0.03em; margin-bottom: 1.2rem; }
    .hero h1 .break { display: block; color: rgba(237,238,242,0.92); }
    .hero-sub { max-width: 680px; margin: 0 auto 0.9rem; font-size: 1.08rem; color: var(--muted); }
    .hero-inev { max-width: 640px; margin: 0 auto 0.8rem; font-size: 1.02rem; font-weight: 600; color: rgba(237,238,242,0.72); }
    .hero-reframe { max-width: 640px; margin: 0 auto 2.5rem; font-size: 0.97rem; color: rgba(237,238,242,0.38); font-style: italic; }
    .btn { display: inline-block; background: var(--accent-bg); color: var(--accent-fg); font-size: 14px; font-weight: 600; letter-spacing: 0.02em; padding: 14px 32px; border-radius: 10px; text-decoration: none; transition: opacity 0.2s, transform 0.15s; }
    .btn:hover { opacity: 0.88; transform: translateY(-1px); }
    .hero-note { margin-top: 1.5rem; font-size: 13px; color: rgba(237,238,242,0.28); letter-spacing: 0.01em; }

    /* Post-hero realization block */
    .post-hero { max-width: 720px; margin: 0 auto; padding: 2.5rem 2rem 3.5rem; text-align: center; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
    .hero-punch { font-size: 1.18rem; font-weight: 600; color: var(--fg); line-height: 1.5; max-width: 600px; margin: 0 auto 1.75rem; letter-spacing: -0.005em; }
    .hero-punch:last-child { margin-bottom: 0; }
    .hero-reality { font-size: 1rem; color: rgba(237,238,242,0.55); line-height: 1.75; max-width: 600px; margin: 0 auto; }

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

    /* Positioning line (mid-page, after reframe) */
    .positioning-line { max-width: 720px; margin: 0 auto; padding: 3rem 2rem; text-align: center; }
    .positioning-line p { font-size: 1.18rem; font-weight: 600; color: var(--fg); line-height: 1.5; max-width: 540px; margin: 0 auto; letter-spacing: -0.005em; }

    /* Loss line (above CTA) */
    .loss-line { max-width: 720px; margin: 0 auto; padding: 3rem 2rem; text-align: center; border-top: 1px solid var(--rule); border-bottom: 1px solid var(--rule); }
    .loss-line p { font-size: 1.18rem; font-weight: 600; color: var(--fg); line-height: 1.5; max-width: 520px; margin: 0 auto; letter-spacing: -0.005em; }

    /* CTA */
    .cta-section { max-width: 820px; margin: 0 auto; padding: 4rem 2rem 6rem; text-align: center; }
    .cta-section.with-border { border-top: 1px solid var(--rule); }
    .cta-section h2 { font-size: 1.8rem; font-weight: 700; margin-bottom: 0.8rem; letter-spacing: -0.02em; }
    .cta-section p { color: var(--muted-2); margin: 0 auto 2rem; font-size: 15px; max-width: 580px; }
    .cta-list { list-style: none; display: inline-flex; flex-direction: column; gap: 0.35rem; margin: 0 0 2rem; color: rgba(237,238,242,0.55); font-size: 14px; text-align: left; }

    footer { display: flex; justify-content: space-between; padding: 1.5rem 2.5rem; border-top: 1px solid var(--rule); font-size: 12px; color: rgba(237,238,242,0.22); letter-spacing: 0.04em; gap: 1rem; flex-wrap: wrap; }
    .footer-right { display: flex; align-items: center; gap: 8px; }
    .footer-dot { width: 6px; height: 6px; background: rgba(237,238,242,0.22); border-radius: 50%; }

    @media (max-width: 640px) {
      nav, footer { padding: 1.2rem 1.25rem; }
      .hero, .section, .cta-section, .reframe-block, .trust-section { padding-left: 1.25rem; padding-right: 1.25rem; }
      .post-hero { padding: 2rem 1.25rem 3rem; }
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
      <div class="nav-right">
        <a href="/about" class="nav-link">About</a>
        <a href="${CALENDLY}" class="nav-cta" target="_blank" rel="noopener noreferrer">Book a call →</a>
      </div>
    </nav>

    <section class="hero">
      <div class="niche-tag">${niche.name}</div>
      <h1>${niche.headline}<span class="break">${niche.headlineBreak}</span></h1>
      <p class="hero-sub">${niche.heroSub}</p>
      <p class="hero-inev">${niche.heroInev}</p>
      <p class="hero-reframe">${niche.heroReframe}</p>
      <a href="${CALENDLY}" class="btn" target="_blank" rel="noopener noreferrer">${niche.heroCta}</a>
      <div class="hero-note">${niche.heroNote}</div>
    </section>

    ${postHeroHtml}

    <div class="reframe-block">
      <div class="reframe-eyebrow">The actual problem</div>
      <h2 class="reframe-headline">${niche.reframeHeadline}</h2>
      <p class="reframe-body">${niche.reframeBody}</p>
    </div>

    ${niche.positioningLine ? `<div class="positioning-line"><p>${niche.positioningLine}</p></div>` : ''}

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
          <div class="trust-body">All code, credentials, and infrastructure in your name from day one. Every build includes a 30-day optimization window. After that, a monthly retainer is available — but you never pay to keep access to something you already built.</div>
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

    ${niche.ctaLossLine ? `<div class="loss-line"><p>${niche.ctaLossLine}</p></div>` : ''}

    <section class="cta-section${niche.ctaLossLine ? '' : ' with-border'}">
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
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <meta property="og:title" content="NCSystems — Let's Talk">
  <meta property="og:description" content="AI systems built for your industry. Find where you're losing money and fix it.">
  <meta property="og:image" content="https://ncsystems.io/og-image.png">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://ncsystems.io/og-image.png">
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
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <meta property="og:title" content="NCSystems — Book a Call">
  <meta property="og:description" content="30 minutes. I'll map your operation, find where it's leaking, and show you what fixing it looks like.">
  <meta property="og:image" content="https://ncsystems.io/og-image.png">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://ncsystems.io/og-image.png">
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

// ── /booked confirmation page ─────────────────────────────────────────────────
function buildBookedPage() {
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
  <title>NCSystems — You're booked</title>
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root { --bg: #020203; --fg: #EDEEF2; --muted: rgba(237,238,242,0.50); --rule: rgba(237,238,242,0.08); --accent: rgba(237,238,242,0.06); }
    body { background: var(--bg); color: var(--fg); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; min-height: 100vh; line-height: 1.6; }
    #starfield { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
    .page { position: relative; z-index: 1; display: flex; flex-direction: column; min-height: 100vh; }
    nav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2.5rem; border-bottom: 1px solid var(--rule); }
    .wordmark { font-family: ui-monospace, 'Courier New', monospace; font-size: 13px; letter-spacing: 0.15em; color: var(--fg); display: flex; align-items: center; gap: 6px; text-decoration: none; }
    .wordmark-bracket { opacity: 0.35; }
    .wordmark-dot { width: 7px; height: 7px; background: var(--fg); border-radius: 50%; }
    .main { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 4rem 1.5rem; text-align: center; }
    .check { width: 52px; height: 52px; border-radius: 50%; border: 1px solid rgba(237,238,242,0.20); display: flex; align-items: center; justify-content: center; margin: 0 auto 2rem; }
    .check svg { width: 22px; height: 22px; stroke: var(--fg); stroke-width: 2; fill: none; stroke-linecap: round; stroke-linejoin: round; }
    .tag { display: inline-block; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(237,238,242,0.35); border: 1px solid rgba(237,238,242,0.12); border-radius: 20px; padding: 5px 14px; margin-bottom: 1.5rem; }
    h1 { font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 700; letter-spacing: -0.025em; line-height: 1.15; margin-bottom: 1rem; max-width: 540px; }
    .sub { color: var(--muted); font-size: 1rem; max-width: 440px; margin: 0 auto 3rem; }
    .prep { background: var(--accent); border: 1px solid var(--rule); border-radius: 12px; padding: 2rem 2.5rem; max-width: 480px; width: 100%; text-align: left; margin-bottom: 2.5rem; }
    .prep-label { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(237,238,242,0.35); margin-bottom: 1.25rem; }
    .prep-item { display: flex; gap: 0.9rem; align-items: flex-start; margin-bottom: 1rem; }
    .prep-item:last-child { margin-bottom: 0; }
    .prep-num { font-family: ui-monospace, monospace; font-size: 11px; color: rgba(237,238,242,0.30); padding-top: 3px; min-width: 16px; }
    .prep-text { font-size: 0.9rem; color: var(--muted); line-height: 1.55; }
    .prep-text strong { color: var(--fg); font-weight: 500; }
    .note { font-size: 0.8rem; color: rgba(237,238,242,0.25); max-width: 400px; }
    footer { display: flex; justify-content: space-between; padding: 1.5rem 2.5rem; border-top: 1px solid var(--rule); font-size: 12px; color: rgba(237,238,242,0.25); letter-spacing: 0.04em; flex-wrap: wrap; gap: 1rem; margin-top: auto; }
    .footer-right { display: flex; align-items: center; gap: 8px; }
    .footer-dot { width: 6px; height: 6px; background: rgba(237,238,242,0.25); border-radius: 50%; }
    @media (max-width: 640px) { nav, footer { padding: 1.2rem 1.25rem; } .prep { padding: 1.5rem; } }
  </style>
</head>
<body>
  <canvas id="starfield"></canvas>
  <div class="page">
    <nav>
      <a href="/" class="wordmark"><span class="wordmark-bracket">[</span>NCSYSTEMS<span class="wordmark-dot"></span><span class="wordmark-bracket">]</span></a>
    </nav>

    <div class="main">
      <div class="check">
        <svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <div class="tag">Call confirmed</div>
      <h1>You're on the calendar.</h1>
      <p class="sub">Check your email for the confirmation and Google Meet link. I'll see you on the call.</p>

      <div class="prep">
        <div class="prep-label">How to get the most out of 30 minutes</div>
        <div class="prep-item">
          <span class="prep-num">01</span>
          <span class="prep-text"><strong>Think about where time goes.</strong> What do you or your team handle manually every week that feels repetitive? Inquiries, follow-up, scheduling, reminders — anything that happens over and over.</span>
        </div>
        <div class="prep-item">
          <span class="prep-num">02</span>
          <span class="prep-text"><strong>Know your biggest leak.</strong> Where are you losing customers you shouldn't be losing? Slow response, no-shows, leads going cold — pick the one that stings the most.</span>
        </div>
        <div class="prep-item">
          <span class="prep-num">03</span>
          <span class="prep-text"><strong>No prep required beyond that.</strong> I'll walk you through the rest. This is a conversation, not a presentation.</span>
        </div>
      </div>

      <p class="note">Questions before the call? Reach out at <a href="mailto:nick@ncsystems.io" style="color: rgba(237,238,242,0.45); text-decoration: none;">nick@ncsystems.io</a></p>
    </div>

    <footer>
      <span>ncsystems.io</span>
      <div class="footer-right"><div class="footer-dot"></div><span>accepting new engagements</span></div>
    </footer>
  </div>
  <script>${starScript}</script>
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

Valid slugs: ${slugs}, strategic, other

Routing rules:
- Use "strategic" when the business is multi-location, multi-property, has an executive team, is a hotel or resort group, real estate portfolio, fleet operator, or otherwise signals revenue scale beyond a single owner-operator (typically $5M+ revenue or formal management layer).
- Use one of the niche slugs for single owner-operated businesses (one shop, one studio, one practice, one tour outfit, one restaurant, etc.).
- Use "other" only when nothing else fits.

Return ONLY the slug. No punctuation, no explanation.
Business: "${input}"`,
        }],
      }),
    });

    const data = await response.json();
    const raw  = data.content[0].text.trim().toLowerCase().replace(/[^a-z-]/g, '');
    const niche = (NICHES[raw] || raw === 'strategic') ? raw : 'other';
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
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <meta property="og:title" content="NCSystems — AI systems built for your industry">
  <meta property="og:description" content="I find where small businesses are losing money and replace the broken parts with systems that fix it.">
  <meta property="og:image" content="https://ncsystems.io/og-image.png">
  <meta property="og:url" content="https://ncsystems.io">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://ncsystems.io/og-image.png">
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

// ── /about page ──────────────────────────────────────────────────────────────
function buildAboutPage() {
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
  <title>NCSystems — About</title>
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <meta property="og:title" content="NCSystems — About">
  <meta property="og:description" content="I find where small businesses are losing money and replace the broken parts with systems that fix it.">
  <meta property="og:image" content="https://ncsystems.io/og-image.png">
  <meta property="og:url" content="https://ncsystems.io/about">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://ncsystems.io/og-image.png">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #020203; --fg: #EDEEF2;
      --muted: rgba(237,238,242,0.50);
      --muted-2: rgba(237,238,242,0.35);
      --rule: rgba(237,238,242,0.08);
      --rule-2: rgba(237,238,242,0.05);
      --accent-bg: #EDEEF2; --accent-fg: #020203;
    }
    body { background: var(--bg); color: var(--fg); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; min-height: 100vh; line-height: 1.6; }
    #starfield { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
    .page { position: relative; z-index: 1; display: flex; flex-direction: column; min-height: 100vh; }
    nav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2.5rem; border-bottom: 1px solid var(--rule); }
    .wordmark { font-family: ui-monospace, 'Courier New', monospace; font-size: 13px; letter-spacing: 0.15em; color: var(--fg); display: flex; align-items: center; gap: 6px; text-decoration: none; }
    .wordmark-bracket { opacity: 0.35; }
    .wordmark-dot { width: 7px; height: 7px; background: var(--fg); border-radius: 50%; animation: dot-pulse 3s ease-in-out infinite; }
    @keyframes dot-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
    .nav-right { display: flex; align-items: center; gap: 1.5rem; }
    .nav-link { font-size: 13px; color: rgba(237,238,242,0.38); text-decoration: none; letter-spacing: 0.04em; transition: color 0.2s; }
    .nav-link:hover { color: var(--fg); }
    .nav-cta { font-size: 13px; color: var(--muted); text-decoration: none; letter-spacing: 0.02em; }
    .content { max-width: 680px; margin: 0 auto; padding: 5rem 2.5rem 6rem; flex: 1; }
    .page-label { font-family: ui-monospace, monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(237,238,242,0.28); margin-bottom: 2.5rem; }
    .hero-lede { font-size: clamp(1.55rem, 3.5vw, 2rem); font-weight: 700; letter-spacing: -0.022em; line-height: 1.18; margin-bottom: 1.25rem; color: var(--fg); }
    .hero-sub { font-size: 15px; color: var(--muted); line-height: 1.72; max-width: 560px; }
    .hero-sub + .hero-sub { margin-top: 0.9rem; }
    .section { margin-top: 4rem; padding-top: 4rem; border-top: 1px solid var(--rule); }
    .section-label { font-family: ui-monospace, monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(237,238,242,0.28); margin-bottom: 2rem; }
    .wedge { font-size: 1.05rem; font-weight: 600; color: var(--fg); margin-bottom: 2rem; letter-spacing: -0.01em; }
    .principles { display: flex; flex-direction: column; }
    .principle { display: grid; grid-template-columns: 200px 1fr; gap: 2rem; padding: 1.4rem 0; border-bottom: 1px solid var(--rule-2); align-items: start; }
    .principle:first-child { padding-top: 0; }
    .principle:last-child { border-bottom: none; }
    @media (max-width: 580px) { .principle { grid-template-columns: 1fr; gap: 0.4rem; } }
    .principle-title { font-size: 13px; font-weight: 600; color: var(--fg); }
    .principle-body { font-size: 14px; color: var(--muted); line-height: 1.68; }
    .bg-statement { font-size: 17px; line-height: 1.65; color: var(--fg); margin-bottom: 1.5rem; font-weight: 500; }
    .bg-note { font-size: 15px; color: var(--muted); line-height: 1.72; }
    .cta-section { margin-top: 4rem; padding-top: 4rem; border-top: 1px solid var(--rule); text-align: center; }
    .cta-section h2 { font-size: 1.5rem; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 0.8rem; }
    .cta-section p { color: var(--muted-2); font-size: 15px; margin-bottom: 2rem; }
    .btn { display: inline-block; background: var(--accent-bg); color: var(--accent-fg); padding: 14px 26px; border-radius: 10px; font-size: 14px; font-weight: 600; text-decoration: none; transition: opacity 0.2s; }
    .btn:hover { opacity: 0.88; }
    footer { display: flex; justify-content: space-between; padding: 1.5rem 2.5rem; border-top: 1px solid var(--rule); font-size: 12px; color: rgba(237,238,242,0.22); letter-spacing: 0.04em; gap: 1rem; flex-wrap: wrap; }
    .footer-right { display: flex; align-items: center; gap: 8px; }
    .footer-dot { width: 6px; height: 6px; background: rgba(237,238,242,0.22); border-radius: 50%; }
    @media (max-width: 640px) { nav, footer { padding: 1.2rem 1.25rem; } .content { padding: 4rem 1.25rem 5rem; } }
  </style>
</head>
<body>
  <canvas id="starfield"></canvas>
  <div class="page">
    <nav>
      <a href="/" class="wordmark">
        <span class="wordmark-bracket">[</span>NCSYSTEMS<span class="wordmark-dot"></span><span class="wordmark-bracket">]</span>
      </a>
      <div class="nav-right">
        <a href="/about" class="nav-link">About</a>
        <a href="${CALENDLY}" class="nav-cta" target="_blank" rel="noopener noreferrer">Book a call →</a>
      </div>
    </nav>

    <div class="content">
      <div class="page-label">About</div>

      <h1 class="hero-lede">I find where small businesses are losing money and replace the broken parts with systems that fix it.</h1>
      <p class="hero-sub">Sometimes that's response time. Sometimes follow-up. Sometimes something else entirely.</p>
      <p class="hero-sub">Not another tool. Not a recommendation. Something that actually runs in your business.</p>

      <div class="section">
        <div class="section-label">How I work</div>
        <p class="wedge">Most businesses don't have an AI problem. They have a workflow problem.</p>
        <div class="principles">
          <div class="principle">
            <div class="principle-title">Proof before payment</div>
            <div class="principle-body">You evaluate a working system built for your actual workflow before any invoice. If you don't see clear ROI, we don't move forward.</div>
          </div>
          <div class="principle">
            <div class="principle-title">You own everything. Always.</div>
            <div class="principle-body">All code, credentials, and infrastructure in your name from day one. Every build includes a 30-day optimization window after launch. After that, a monthly retainer is available for continued optimization and priority on new systems — but you never pay to keep access to something you already built.</div>
          </div>
          <div class="principle">
            <div class="principle-title">Systems over recommendations</div>
            <div class="principle-body">I don't write strategy documents. I build things that run. The deliverable is a live system handling real work in your business — not a slide deck about what could be built.</div>
          </div>
          <div class="principle">
            <div class="principle-title">Simple or nothing</div>
            <div class="principle-body">If a system needs a manual to maintain, it's not done. Everything I build is designed to run without me — and without you needing to think about it.</div>
          </div>
          <div class="principle">
            <div class="principle-title">Systems compound over time</div>
            <div class="principle-body">The businesses that get the most out of this aren't the ones who built one system — they're the ones who kept finding the next thing to fix. The retainer exists for clients who want to keep going.</div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-label">Background</div>
        <p class="bg-statement">Studied economics at the University of Wisconsin. Since 2017, traded crypto and advised projects on strategy, go-to-market, and capital raises — from six to eight figures in valuation. Now I build AI systems for small businesses.</p>
        <p class="bg-note">The thread through all of it: finding where the structure is broken and fixing it. Economics gave me the analytical lens. Crypto — both trading and advising — was years of working inside businesses where the cost of a broken system is immediate and measurable. That's the same work I do now, applied to operations instead of markets.</p>
      </div>

      <div class="cta-section">
        <h2>I'll show you exactly where your operation is leaking</h2>
        <p>30 minutes. I'll map what's actually breaking, put a number on what it's costing, and show you what fixing it looks like.</p>
        <a href="${CALENDLY}" class="btn" target="_blank" rel="noopener noreferrer">Book a call</a>
      </div>
    </div>

    <footer>
      <span>ncsystems.io</span>
      <div class="footer-right"><div class="footer-dot"></div><span>accepting new engagements</span></div>
    </footer>
  </div>

  <script>${starScript}</script>
</body>
</html>`;
}

// ── /strategic page ──────────────────────────────────────────────────────────
// Tuned for $5-25M operators reached via heavy-hitter networking.
// Operator framing (not technologist), email-only CTA, no Calendly link,
// no service grid, no metrics bar. Discreet by design — noindex.
function buildStrategicPage() {
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
  <title>NCSystems — Strategic Engagements</title>
  <link rel="icon" href="/favicon.ico" sizes="any">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <meta name="robots" content="noindex,nofollow">
  <meta property="og:title" content="NCSystems — Strategic Engagements">
  <meta property="og:description" content="Operations advisory for owner-operators with serious revenue. Engagements are private and not advertised on the front of this site.">
  <meta property="og:image" content="https://ncsystems.io/og-image.png">
  <meta property="og:url" content="https://ncsystems.io/strategic">
  <meta property="og:type" content="website">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    :root {
      --bg: #020203; --fg: #EDEEF2;
      --muted: rgba(237,238,242,0.50);
      --muted-2: rgba(237,238,242,0.35);
      --rule: rgba(237,238,242,0.08);
      --rule-2: rgba(237,238,242,0.05);
      --accent-bg: #EDEEF2; --accent-fg: #020203;
    }
    body { background: var(--bg); color: var(--fg); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; min-height: 100vh; line-height: 1.6; }
    #starfield { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
    .page { position: relative; z-index: 1; display: flex; flex-direction: column; min-height: 100vh; }
    nav { display: flex; justify-content: space-between; align-items: center; padding: 1.5rem 2.5rem; border-bottom: 1px solid var(--rule); }
    .wordmark { font-family: ui-monospace, 'Courier New', monospace; font-size: 13px; letter-spacing: 0.15em; color: var(--fg); display: flex; align-items: center; gap: 6px; text-decoration: none; }
    .wordmark-bracket { opacity: 0.35; }
    .wordmark-dot { width: 7px; height: 7px; background: var(--fg); border-radius: 50%; animation: dot-pulse 3s ease-in-out infinite; }
    @keyframes dot-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }
    .nav-tag { font-family: ui-monospace, monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(237,238,242,0.32); }
    .content { max-width: 720px; margin: 0 auto; padding: 5rem 2.5rem 6rem; flex: 1; }
    .page-label { font-family: ui-monospace, monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(237,238,242,0.28); margin-bottom: 2.5rem; }
    .hero-lede { font-size: clamp(1.55rem, 3.5vw, 2rem); font-weight: 700; letter-spacing: -0.022em; line-height: 1.18; margin-bottom: 1rem; color: var(--fg); max-width: 640px; }
    .hero-lede-2 { font-size: clamp(1.55rem, 3.5vw, 2rem); font-weight: 700; letter-spacing: -0.022em; line-height: 1.18; margin-bottom: 1.75rem; color: var(--fg); max-width: 640px; }
    .hero-sub { font-size: 15px; color: var(--muted); line-height: 1.65; max-width: 600px; }
    .hero-sub + .hero-sub { margin-top: 1rem; }
    .section { margin-top: 4rem; padding-top: 4rem; border-top: 1px solid var(--rule); }
    .section-label { font-family: ui-monospace, monospace; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(237,238,242,0.28); margin-bottom: 2rem; }
    .principles { display: flex; flex-direction: column; }
    .principle { display: grid; grid-template-columns: 220px 1fr; gap: 2rem; padding: 1.4rem 0; border-bottom: 1px solid var(--rule-2); align-items: start; }
    .principle:first-child { padding-top: 0; }
    .principle:last-child { border-bottom: none; }
    @media (max-width: 580px) { .principle { grid-template-columns: 1fr; gap: 0.4rem; } }
    .principle-title { font-size: 13px; font-weight: 600; color: var(--fg); }
    .principle-body { font-size: 14px; color: var(--muted); line-height: 1.65; }
    .principle-body p { margin: 0; }
    .principle-body p + p { margin-top: 0.85rem; }
    .bg-statement { font-size: 16px; line-height: 1.65; color: var(--fg); margin-bottom: 1.5rem; font-weight: 500; }
    .bg-note { font-size: 15px; color: var(--muted); line-height: 1.7; }
    .cta-section { margin-top: 4rem; padding-top: 4rem; border-top: 1px solid var(--rule); }
    .cta-section h2 { font-size: 1.4rem; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 0.8rem; }
    .cta-section p { color: var(--muted); font-size: 15px; margin-bottom: 1rem; line-height: 1.65; max-width: 580px; }
    .cta-section p:last-of-type { margin-bottom: 2rem; }
    .cta-emphasis { color: var(--fg) !important; font-weight: 600; letter-spacing: -0.005em; }
    .email-link { font-family: ui-monospace, monospace; font-size: 16px; color: var(--fg); text-decoration: none; border-bottom: 1px solid rgba(237,238,242,0.25); padding-bottom: 2px; transition: border-color 0.2s; letter-spacing: 0.01em; }
    .email-link:hover { border-color: var(--fg); }
    footer { display: flex; justify-content: space-between; padding: 1.5rem 2.5rem; border-top: 1px solid var(--rule); font-size: 12px; color: rgba(237,238,242,0.22); letter-spacing: 0.04em; gap: 1rem; flex-wrap: wrap; }
    .footer-right { display: flex; align-items: center; gap: 8px; }
    .footer-dot { width: 6px; height: 6px; background: rgba(237,238,242,0.22); border-radius: 50%; }
    @media (max-width: 640px) { nav, footer { padding: 1.2rem 1.25rem; } .content { padding: 4rem 1.25rem 5rem; } }
  </style>
</head>
<body>
  <canvas id="starfield"></canvas>
  <div class="page">
    <nav>
      <a href="/" class="wordmark">
        <span class="wordmark-bracket">[</span>NCSYSTEMS<span class="wordmark-dot"></span><span class="wordmark-bracket">]</span>
      </a>
      <span class="nav-tag">By introduction</span>
    </nav>

    <div class="content">
      <div class="page-label">Strategic Engagements</div>

      <h1 class="hero-lede">Operations advisory for owner-operators with serious revenue.</h1>
      <p class="hero-lede-2">Focused on the part of the business that quietly breaks.</p>
      <p class="hero-sub">At a certain point, the problem isn't demand.</p>
      <p class="hero-sub">It's what happens after it comes in.</p>
      <p class="hero-sub">Decisions stall.<br>Work gets routed wrong.<br>Costs stay fixed while output slows.</p>
      <p class="hero-sub">Nothing looks broken from the outside.</p>
      <p class="hero-sub">But margin starts leaking.</p>
      <p class="hero-sub">I work with a small number of operators each year on the part of their business they don't have anyone to talk to about.</p>
      <p class="hero-sub">Engagements are private.<br>Scoped to the operator.<br>Not advertised publicly.</p>

      <div class="section">
        <div class="section-label">How engagements run</div>
        <div class="principles">
          <div class="principle">
            <div class="principle-title">Engagements start with a quiet read</div>
            <div class="principle-body"><p>I go inside the operation first. That means calls, dashboards, workflow, and the P&amp;L if you're open to it.</p><p>The first output is a written read: where margin is leaking, what's structural, and what can actually be fixed.</p></div>
          </div>
          <div class="principle">
            <div class="principle-title">Operator-led, not vendor-led</div>
            <div class="principle-body"><p>The work is whatever the problem requires. Sometimes systems. Sometimes process. Sometimes one decision that's been postponed.</p><p>Vendors lead with their hammer. I lead with what's actually in the way.</p></div>
          </div>
          <div class="principle">
            <div class="principle-title">The deliverable is leverage</div>
            <div class="principle-body"><p>If it doesn't reduce operator time, fixed cost, or risk within 90 days, it was scoped wrong.</p><p>I'd rather decline than take work where the framing isn't right.</p></div>
          </div>
          <div class="principle">
            <div class="principle-title">Confidential by default</div>
            <div class="principle-body"><p>Client work is private. No names on the site. No specifics in pitches.</p><p>Operators in the same vertical are referred elsewhere when there's overlap.</p></div>
          </div>
          <div class="principle">
            <div class="principle-title">The relationship compounds</div>
            <div class="principle-body"><p>The most useful engagements are the ones that come back.</p><p>The role becomes thinking partner more than consultant. After a year, operators know their business better than I do, and the work shifts toward what they bring me.</p></div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-label">Background</div>
        <p class="bg-statement">Background in economics and high-pressure operating environments. 9 years inside crypto markets: capital strategy, go-to-market, and operations across projects operating with real capital and non-trivial scale.</p>
        <p class="bg-note">The throughline is the same: finding where structure stopped fitting the business and fixing it before the cost shows up.</p>
      </div>

      <div class="cta-section">
        <h2>Private inquiries</h2>
        <p>I take on a small number of engagements each year.</p>
        <p>Initial conversations are by introduction or direct outreach.</p>
        <p class="cta-emphasis">No booking links.</p>
        <p>Reach me directly:</p>
        <a href="mailto:nick@ncsystems.io?subject=Strategic%20engagement%20inquiry" class="email-link">nick@ncsystems.io</a>
      </div>
    </div>

    <footer>
      <span>ncsystems.io</span>
      <div class="footer-right"><div class="footer-dot"></div><span>by introduction</span></div>
    </footer>
  </div>

  <script>${starScript}</script>
</body>
</html>`;
}

Object.keys(NICHES).forEach(slug => {
  app.get('/' + slug, (_, res) => res.send(buildNichePage(NICHES[slug])));
});

app.get('/about', (_, res) => res.send(buildAboutPage()));
app.get('/strategic', (_, res) => res.send(buildStrategicPage()));
app.get('/other', (_, res) => res.send(buildOtherPage()));
app.get('/book', (_, res) => res.send(buildBookPage()));
app.get('/booked', (_, res) => res.send(buildBookedPage()));

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`\n🚀  NCSystems running at http://localhost:${PORT}\n`));
