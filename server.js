const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

// ── Config ───────────────────────────────────────────────────────────────────
const CALENDLY = 'https://calendly.com/nick-ncsystems/30min';

// ── Niche data ───────────────────────────────────────────────────────────────
const NICHES = {
  'tourism-hospitality': {
    name: 'Tourism & Hospitality',
    headline: "You're not missing bookings.",
    headlineBreak: "You're missing the ones that happen when you're not there.",
    heroSub: "Most guests reach out at night, between tours, or while you're busy running the business. If no one responds, they book somewhere else. We fix that.",
    heroNote: 'Built for tour operators, activity companies, charters, surf schools, and boutique hospitality teams.',
    heroCta: "I'll show you exactly where this is happening in your business",
    connectionLine: "This is almost always the first place we find the leak in tour and hospitality businesses.",
    specificityLine: "The guests who don't hear back book somewhere else before morning.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'Someone messages you at night', body: 'You reply in the morning. They already booked.' },
      { title: 'Your inbox is full of the same questions', body: 'Pickup times, what to bring, where to park, what\'s included. You answer them manually, one by one, every day.' },
      { title: 'The booking doesn\'t stop at the booking', body: 'Confirmations, reminders, pre-trip details, follow-up after the experience. It all gets handled manually unless someone remembers.' },
      { title: 'You get enough inquiries', body: 'The problem is how many disappear before anyone gets back to them.' },
    ],
    painCallout: { strong: "You don't have a traffic problem.", p: 'You have a response and follow-up problem.' },
    offersIntro: 'Not "AI" for the sake of it. Just the systems that stop bookings from slipping.',
    offers: [
      { title: 'Every inquiry gets an instant response', body: "Even when you're on the water, running tours, or off the clock." },
      { title: 'Common questions get answered automatically', body: 'Without your team touching the inbox or typing the same answer for the fortieth time.' },
      { title: 'Guests are guided into booking', body: 'Instead of waiting around for a reply that may never come in time.' },
      { title: 'Confirmations, reminders, and follow-ups run in the background', body: 'Nothing depends on one person remembering to do it.' },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: 'The goal is simple: nothing slips through.' },
    authoritySignal: "We've seen this pattern across multiple tourism businesses. It's almost never a traffic problem.",
    howWorks: [
      { title: 'Someone reaches out', body: 'They get a reply immediately, with the information they need.' },
      { title: 'They get moved toward booking', body: 'Not just answered. Guided into the next step while interest is still there.' },
      { title: 'The system confirms, reminds, and follows up', body: "You don't touch it. Your team doesn't touch it. It just runs." },
    ],
    howWorksCallout: { strong: 'Everything that used to be manual runs in the background.' },
    proofs: [
      { strong: 'What operators usually underestimate', p: 'How many bookings are being lost between the first message and the first response.' },
      { strong: 'What happens when response time drops', p: 'More inquiries convert, fewer people disappear, and less time gets spent answering the same questions over and over.' },
      { strong: 'The real result', p: 'Same traffic. More bookings. Less manual work.' },
    ],
    microProof: "One tour operator was missing most of their after-hours inquiries. After setting up an automatic response, more of those turned into confirmed bookings.",
    ctaHeadline: "I'll show you where you're losing bookings",
    ctaSub: "30 minutes. No pitch. Just a clear breakdown of what's slipping, what should be automated, and what it could look like in your business.",
    ctaList: ['— where inquiries are falling off', '— what should be automated first', '— how it would work in your actual workflow'],
  },

  'health-fitness': {
    name: 'Health & Fitness',
    headline: "You're in a session.",
    headlineBreak: "Three people just DM'd about your pricing. One of them won't wait.",
    heroSub: "Your best leads show up while you're on the floor. If they don't hear back within the hour, they book somewhere else. We fix that.",
    heroNote: 'Built for personal trainers, fitness studios, yoga instructors, online coaches, and gym owners.',
    heroCta: "I'll show you exactly where this is happening in your business",
    connectionLine: "This is almost always the first place we find the leak in fitness businesses.",
    specificityLine: "The lead doesn't wait. They sign up with whoever responds in the next 20 minutes.",
    painLabel: "What's actually happening",
    pains: [
      { title: "Someone DMs while you're coaching", body: "You're fully present with a client. Three people ask about your packages. By the time you're free, two of them have moved on." },
      { title: 'Scheduling eats hours you could be billing', body: 'Back-and-forth to find a time, confirm, remind, follow up after a no-show. None of it makes you money.' },
      { title: 'The same questions, over and over', body: 'Pricing, class times, what to bring, what to expect. You answer them from memory across Instagram, email, and text every single day.' },
      { title: 'New leads go cold between inquiry and first session', body: 'Someone expresses interest. A day passes. They\'ve signed up with a trainer who responded in 20 minutes.' },
    ],
    painCallout: { strong: "You don't have a lead problem.", p: 'You have a response timing problem.' },
    offersIntro: 'Not complicated systems. Just the automation that keeps leads from disappearing.',
    offers: [
      { title: 'Every inquiry gets an instant response', body: "Even when you're on the floor, between sessions, or off the clock." },
      { title: 'Common questions get answered automatically', body: 'Pricing, schedule, what to bring — handled without you typing it out again.' },
      { title: 'Leads get moved toward booking', body: 'Not just replied to. Guided into a session before the interest fades.' },
      { title: 'Reminders and follow-ups run in the background', body: 'Nothing depends on you remembering to send a text.' },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: "The goal is simple: no lead disappears because you were busy coaching." },
    authoritySignal: "We've seen this pattern across multiple fitness businesses. It's almost never a lead volume problem.",
    howWorks: [
      { title: 'Someone reaches out', body: 'They get a reply immediately, with the information they need.' },
      { title: 'They get moved toward booking', body: 'Not just answered. Guided into a session while interest is still there.' },
      { title: 'The system confirms, reminds, and follows up', body: "You don't touch it. It just runs." },
    ],
    howWorksCallout: { strong: 'Everything that used to fall through runs in the background.' },
    proofs: [
      { strong: 'What trainers usually underestimate', p: 'How many leads go quiet between the first message and the first reply.' },
      { strong: 'What changes when response time drops', p: 'More inquiries convert, fewer no-shows, less time spent on scheduling back-and-forth.' },
      { strong: 'The real result', p: 'Same leads. More clients. Less admin.' },
    ],
    microProof: "One personal trainer was losing leads to delayed DM responses during sessions. After automating the first reply, more of those conversations turned into booked sessions.",
    ctaHeadline: "I'll show you where you're losing clients",
    ctaSub: "30 minutes. No pitch. Just a clear breakdown of where leads are slipping and what to fix first.",
    ctaList: ['— where inquiries are going cold', '— what should be automated first', '— how it fits into your actual workflow'],
  },

  'real-estate': {
    name: 'Real Estate',
    headline: "You're not losing deals to better agents.",
    headlineBreak: "You're losing them to faster ones.",
    heroSub: "Buyers fill out forms at 11pm ready to move. By 8am they've already called two other agents. We fix that.",
    heroNote: 'Built for independent agents, small teams, and brokerages managing high inquiry volume.',
    heroCta: "I'll show you exactly where this is happening in your business",
    connectionLine: "This is almost always the first place we find the leak in real estate businesses.",
    specificityLine: "The best agent doesn't win. The first one to respond does.",
    painLabel: "What's actually happening",
    pains: [
      { title: "Leads come in while you're showing", body: "You're at a showing or on a call. A form comes in. By the time you're free, they've already moved on." },
      { title: 'Follow-up is inconsistent', body: "When you're busy, leads wait. Some get five touchpoints. Others sit in your CRM untouched for a week." },
      { title: "You're answering the same questions constantly", body: 'Neighborhoods, timelines, process, pricing ranges — manually, across email and phone, for every single inquiry.' },
      { title: 'Some leads never get a real first response', body: "They came in at the wrong time. No one got back to them fast enough. The listing goes to someone else." },
    ],
    painCallout: { strong: "You don't have a lead quality problem.", p: 'The lead was ready. You just weren\'t first.' },
    offersIntro: "Not a CRM. Just the systems that make sure every lead gets a real response before they move on.",
    offers: [
      { title: 'Every inquiry gets an instant response', body: 'Budget, timeline, property type — collected before you even see the lead.' },
      { title: 'Follow-up runs automatically', body: 'Every lead gets consistent touchpoints on a cadence, regardless of how busy the week is.' },
      { title: 'Qualified leads book showings themselves', body: 'No phone tag, no back-and-forth. They pick a time and it lands on your calendar.' },
      { title: 'Common questions get answered without you', body: 'Neighborhoods, process, pricing — handled automatically so you\'re only talking to people who are ready.' },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: "The goal is simple: no lead goes cold because no one got back in time." },
    authoritySignal: "We've seen this pattern across multiple real estate businesses. It's almost never a lead quality problem.",
    howWorks: [
      { title: 'Someone fills out a form or DMs', body: 'They get a response in seconds, with the information they need.' },
      { title: 'They get moved toward a showing', body: 'Not just replied to. Qualified and guided into the next step.' },
      { title: 'The system follows up automatically', body: "You don't track it. It runs until they're ready or they opt out." },
    ],
    howWorksCallout: { strong: 'Everything that used to depend on timing runs in the background.' },
    proofs: [
      { strong: 'What agents usually underestimate', p: 'How many leads go cold in the first hour — not the first day.' },
      { strong: 'What changes when response time drops', p: 'More inquiries convert, more showings get booked, and follow-up stops depending on who\'s having a slow week.' },
      { strong: 'The real result', p: 'Same leads. More closings. Less time on admin.' },
    ],
    microProof: "One agent was getting web leads overnight but responding the next morning. After setting up an immediate response, more of those leads converted to showings.",
    ctaHeadline: "I'll show you where you're losing deals",
    ctaSub: "30 minutes. No pitch. Just a clear look at where leads are slipping and what to automate first.",
    ctaList: ['— where inquiries are going cold', '— what follow-up should be automated', '— how it fits your current workflow'],
  },

  'restaurants-food': {
    name: 'Restaurants & Food',
    headline: "Your team is mid-service.",
    headlineBreak: "The phone is ringing. Someone will hang up.",
    heroSub: "People decide where to eat at 10pm. If they can't get through or don't get a response, they book somewhere else. We fix that.",
    heroNote: 'Built for independent restaurants, fine dining, fast casual, catering operations, and food & beverage teams.',
    heroCta: "I'll show you exactly where this is happening in your business",
    connectionLine: "This is almost always the first place we find the leak in restaurant businesses.",
    specificityLine: "They checked you out at 10pm. By 11pm they booked the place that answered.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'The phone rings during a rush', body: "Your team is plating. The phone won't stop. Either service suffers or the call does." },
      { title: 'After-hours bookings go to voicemail', body: "People book at 9 or 10pm. Your voicemail doesn't close tables." },
      { title: 'The same menu questions flood your inbox', body: 'Dietary restrictions, allergy questions, what\'s included — answered manually, one by one, every day.' },
      { title: 'No-shows cost you real revenue', body: 'Empty slots at peak time that could have been filled. Manual reminder texts aren\'t enough.' },
    ],
    painCallout: { strong: "You don't have a marketing problem.", p: 'The table was available. No one answered to book it.' },
    offersIntro: 'Not software for the sake of it. Just the systems that fill tables and protect revenue.',
    offers: [
      { title: 'Reservations get handled automatically', body: "Bookings, party size, special requests, and confirmations — without anyone picking up the phone." },
      { title: 'Menu and allergy questions get answered instantly', body: "Without your team stopping what they're doing to type the same reply." },
      { title: "After-hours inquiries don't disappear", body: 'Someone reaching out at 10pm gets a real response and a path to booking.' },
      { title: 'No-shows drop', body: 'Automated reminders go out before every reservation. Cancellations fill from a waitlist automatically.' },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: "The goal is simple: every table that should be filled, is filled." },
    authoritySignal: "We've seen this pattern across multiple restaurant businesses. It's almost never a foot traffic problem.",
    howWorks: [
      { title: 'Someone wants to make a reservation', body: 'They get a response immediately — any time, any channel.' },
      { title: 'They get guided into booking', body: 'Not just answered. Confirmed, with details collected, before they close the tab.' },
      { title: 'The system reminds and follows up', body: "You don't touch it. Reminders go out. Cancellations get filled. It runs." },
    ],
    howWorksCallout: { strong: 'Everything that used to depend on someone answering the phone runs in the background.' },
    proofs: [
      { strong: 'What restaurant operators usually underestimate', p: 'How many covers are lost between the after-hours inquiry and the next morning\'s response.' },
      { strong: 'What changes when capture improves', p: "More tables filled, fewer no-shows, and your team stays focused on the floor instead of the phone." },
      { strong: 'The real result', p: 'Same traffic. More revenue. Less manual work.' },
    ],
    microProof: "One restaurant had no system for after-hours reservation requests. After automating responses, more of those inquiries turned into actual covers.",
    ctaHeadline: "I'll show you where you're losing covers",
    ctaSub: "30 minutes. No pitch. Just a clear look at where bookings are slipping and what to fix first.",
    ctaList: ['— where reservations are falling off', '— what should be automated first', '— how it works in your actual operation'],
  },

  'home-services': {
    name: 'Home Services',
    headline: 'The call you missed at 9pm',
    headlineBreak: "is a job your competitor starts tomorrow.",
    heroSub: "Emergency requests don't follow business hours. The contractor who responds first gets the job. We make sure that's you.",
    heroNote: 'Built for plumbers, HVAC techs, electricians, roofers, landscapers, and home service operators.',
    heroCta: "I'll show you exactly where this is happening in your business",
    connectionLine: "This is almost always the first place we find the leak in home service businesses.",
    specificityLine: "The job goes to whoever picks up first. That's almost never the person who missed the call.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'After-hours emergencies go to voicemail', body: 'Burst pipe. AC out in July. Downed tree. The homeowner calls every number they find. The one who responds gets the job.' },
      { title: 'On-site quotes eat your week', body: "Drive out. Assess. Quote. Follow up. Half don't convert. You burned a morning for nothing." },
      { title: 'Peak season breaks your intake', body: 'Storm rolls through. 40 calls in two days. Your phone rings off the hook and jobs start falling through the cracks.' },
      { title: 'Some jobs never make it to your calendar', body: "The request came in while you were on a roof. Nobody followed up. The customer booked someone else." },
    ],
    painCallout: { strong: "You don't have a workload problem.", p: 'The work is out there. You just aren\'t the one picking up.' },
    offersIntro: "Not complicated software. Just the systems that make sure every job request gets picked up.",
    offers: [
      { title: 'After-hours requests get captured automatically', body: "Job details and photos collected while you're unavailable. You get a prioritized summary so you know what to call first." },
      { title: 'Quote intake runs without you', body: 'Customers describe the job and upload photos before you ever set foot on site. You show up to close.' },
      { title: 'New jobs get routed to the right crew', body: 'Triaged by urgency, assigned automatically, confirmation sent to the customer. Nobody falls through.' },
      { title: 'Follow-up runs in the background', body: "Estimates that don't get a response get a nudge. Jobs don't disappear because nobody remembered to call back." },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: "The goal is simple: no job slips because you were on a job." },
    authoritySignal: "We've seen this pattern across multiple home service businesses. It's almost never a shortage of work.",
    howWorks: [
      { title: 'Someone reaches out — any time', body: 'They get a response immediately. Job details collected, urgency noted.' },
      { title: 'The request gets routed', body: 'Right crew, right priority. Customer gets a confirmation before you\'re off the other job.' },
      { title: 'The system follows up', body: "You don't track it. Estimates get followed up. Jobs get confirmed. It runs." },
    ],
    howWorksCallout: { strong: "Everything that used to depend on you being available runs in the background." },
    proofs: [
      { strong: 'What operators usually underestimate', p: 'How many jobs are lost between the after-hours call and the next morning\'s callback.' },
      { strong: 'What changes when capture improves', p: "More jobs won, less time on-site for quotes that don't convert, and peak season doesn't break the system." },
      { strong: 'The real result', p: 'Same call volume. More jobs won. Less work falling through.' },
    ],
    microProof: "One home service operator was missing after-hours calls and callbacks were coming too late. After capturing those requests automatically, more of them converted to booked jobs.",
    ctaHeadline: "I'll show you where you're losing jobs",
    ctaSub: "30 minutes. No pitch. Just a clear breakdown of where requests are slipping and what to fix first.",
    ctaList: ['— where after-hours requests are going unanswered', '— what should be automated first', '— how it fits into your current operation'],
  },

  'beauty-wellness': {
    name: 'Beauty & Wellness',
    headline: "You're booked solid.",
    headlineBreak: "Someone just DM'd. You can't do both.",
    heroSub: "Your best new clients show up in your Instagram DMs while you're with someone. If they don't hear back quickly, they book elsewhere. We fix that.",
    heroNote: 'Built for hair stylists, estheticians, nail techs, massage therapists, and independent wellness practitioners.',
    heroCta: "I'll show you exactly where this is happening in your business",
    connectionLine: "This is almost always the first place we find the leak in beauty and wellness businesses.",
    specificityLine: "They moved on to someone with online booking before you even saw the message.",
    painLabel: "What's actually happening",
    pains: [
      { title: "Booking requests come in while you're in the chair", body: "You're mid-service. Your phone is buzzing. You either stop what you're doing or lose the client." },
      { title: 'No-shows cost you real money', body: "Every empty slot is revenue you can't recover. Manual reminder texts aren't cutting it." },
      { title: "Instagram is your biggest lead source — and the hardest to manage", body: "DMs asking about availability, pricing, what's included. You can't respond from the chair. So you don't. And they book elsewhere." },
      { title: 'Back-and-forth to book takes longer than it should', body: 'Finding a time, confirming, sending prep instructions — done manually, for every client, every week.' },
    ],
    painCallout: { strong: "You don't have a marketing problem.", p: 'They were already interested. They just booked someone who replied.' },
    offersIntro: "Not complicated systems. Just the automation that keeps your chair full without interrupting your work.",
    offers: [
      { title: 'DMs get a response instantly', body: "Even when you're mid-service. Clients get the information they need and a path to booking." },
      { title: 'Appointments get booked automatically', body: "No calls, no back-and-forth. Clients pick a slot and confirm without involving you." },
      { title: 'No-shows drop', body: 'Automated reminders go out 48 hours and 2 hours before every appointment.' },
      { title: 'Prep instructions and follow-up run in the background', body: 'New clients get what to bring. Existing clients get rebooking prompts. None of it requires you to remember.' },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: "The goal is simple: your chair stays full and your focus stays on the client in front of you." },
    authoritySignal: "We've seen this pattern across multiple beauty businesses. It's almost never a visibility problem.",
    howWorks: [
      { title: 'Someone reaches out', body: 'They get an instant response with availability and a booking link.' },
      { title: 'They book themselves', body: 'No phone calls. No back-and-forth. They choose a slot and it lands on your calendar.' },
      { title: 'The system handles everything around it', body: "Reminders, confirmations, prep instructions. You don't touch it." },
    ],
    howWorksCallout: { strong: 'Everything that used to interrupt your day runs in the background.' },
    proofs: [
      { strong: 'What practitioners usually underestimate', p: "How many clients book elsewhere simply because no one responded to their DM in time." },
      { strong: 'What changes when booking gets automated', p: "Fewer no-shows, more bookings from DMs that used to go cold, and less time spent on scheduling back-and-forth." },
      { strong: 'The real result', p: 'Same clientele. Fuller calendar. Less admin.' },
    ],
    microProof: "One stylist was getting regular DM inquiries that went unanswered during appointments. After automating the first response, more of those turned into booked slots.",
    ctaHeadline: "I'll show you where you're losing bookings",
    ctaSub: "30 minutes. No pitch. Just a clear look at where clients are slipping and what to fix first.",
    ctaList: ['— where DMs are going unanswered', '— what should be automated first', '— how it fits into your current workflow'],
  },

  'professional-services': {
    name: 'Professional Services',
    headline: "Every hour you spend on intake",
    headlineBreak: "is an hour you're not billing.",
    heroSub: "Unqualified discovery calls, slow onboarding, and overnight prospects who go cold before morning — all fixable. We fix that.",
    heroNote: 'Built for attorneys, accountants, financial advisors, consultants, and professional services firms.',
    heroCta: "I'll show you exactly where this is happening in your business",
    connectionLine: "This is almost always the first place we find the leak in professional services firms.",
    specificityLine: "Every day without a follow-up is another day a competitor gets closer to closing them.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'Unqualified leads take your best hours', body: "45-minute discovery calls with people who can't afford you. It happens weekly. At your rate, that's hundreds of dollars gone every time." },
      { title: 'Intake is still email threads and PDFs', body: 'Collecting the same information manually, through back-and-forth email, before you can do any real work.' },
      { title: 'After-hours prospects go cold fast', body: "Someone reaches out at 9pm ready to hire. You see it Thursday morning. They've already signed with someone who replied in an hour." },
      { title: 'Your calendar fills with low-value conversations', body: "Time that should be billed gets spent on calls that shouldn't be happening at all." },
    ],
    painCallout: { strong: "You don't have a pipeline problem.", p: 'The prospect moved on while you were busy billing someone else.' },
    offersIntro: "Not a CRM. Just the systems that protect your time and make sure the right clients reach you.",
    offers: [
      { title: 'Every inquiry gets an instant response', body: 'Scope, budget, timeline, urgency — collected before you see the lead. You only hear from people worth your time.' },
      { title: 'Intake runs automatically', body: 'New clients complete your process before the first meeting. You get a complete brief instead of starting from scratch.' },
      { title: 'Qualified prospects book themselves', body: 'Consultations land in your calendar without anyone on your team coordinating them.' },
      { title: "After-hours prospects don't go cold", body: 'Someone reaching out at 9pm gets an immediate response and a path forward — before they move on.' },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: "The goal is simple: every hour you work is an hour worth working." },
    authoritySignal: "We've seen this pattern across multiple professional services firms. It's almost never a pipeline problem.",
    howWorks: [
      { title: 'Someone reaches out', body: 'They get a response immediately. Scope, budget, and timeline collected without you involved.' },
      { title: 'They get qualified', body: 'The right ones get moved toward a consultation. The wrong ones get a polite redirect.' },
      { title: 'Qualified prospects book and onboard', body: 'The consultation is scheduled. Intake is complete before you meet. You arrive ready to work.' },
    ],
    howWorksCallout: { strong: 'Everything that used to eat your billable time runs in the background.' },
    proofs: [
      { strong: 'What professionals usually underestimate', p: 'How many hours per week go to intake, scheduling, and discovery calls that don\'t convert.' },
      { strong: 'What changes when qualification improves', p: "Better-fit clients, faster onboarding, and less time spent on conversations that shouldn't be happening." },
      { strong: 'The real result', p: 'Same leads. More revenue. Less time on the wrong work.' },
    ],
    microProof: "One firm was spending a significant portion of their week on intake and discovery calls that didn't convert. After automating qualification, the calls that remained were substantially better fits.",
    ctaHeadline: "I'll show you where you're losing billable time",
    ctaSub: "30 minutes. No pitch. Just a clear breakdown of what's costing you time and what to automate first.",
    ctaList: ["— where unqualified leads are eating your schedule", "— what intake should look like", "— how it fits your existing workflow"],
  },

  'ecommerce-retail': {
    name: 'E-commerce & Retail',
    headline: "Seventy percent of your shoppers leave without buying.",
    headlineBreak: "Most of them could have been saved.",
    heroSub: "Cart abandonment, unanswered questions, and browsers who disappear — all fixable. We fix that.",
    heroNote: 'Built for Shopify stores, DTC brands, online retailers, and e-commerce operators.',
    heroCta: "I'll show you exactly where this is happening in your business",
    connectionLine: "This is almost always the first place we find the leak in e-commerce businesses.",
    specificityLine: "They abandoned the cart at midnight. By morning they found it somewhere else.",
    painLabel: "What's actually happening",
    pains: [
      { title: "Cart abandonment is your biggest leak", body: "70% of shoppers add to cart and leave. Most of them intended to buy. They just got distracted before you followed up." },
      { title: "Customer service doesn't scale with volume", body: "Order status, return questions, product specs — your team answers the same things hundreds of times a week." },
      { title: 'Browsers leave with no follow-up', body: "They spend 8 minutes on your site, don't buy, and leave. No capture. No second chance. That traffic cost you money." },
      { title: 'Post-purchase experience is manual', body: "Confirmation, shipping updates, review requests — handled inconsistently, or not at all." },
    ],
    painCallout: { strong: "You don't have a traffic problem.", p: 'The shopper was ready to buy. The window just closed before you followed up.' },
    offersIntro: "Not complicated software. Just the systems that turn existing traffic into more revenue.",
    offers: [
      { title: 'Cart abandoners come back', body: "Automated sequences timed to when they're most likely to return. Personalized to exactly what they left behind." },
      { title: 'Customer questions get answered instantly', body: "Order status, returns, product questions — handled 24/7 without a human involved." },
      { title: 'Browsers get captured', body: "Exit intent, browse abandonment, and email capture sequences that give you a second shot." },
      { title: 'Post-purchase runs automatically', body: "Confirmations, shipping updates, review requests, and reorder prompts — without anyone managing it." },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: "The goal is simple: the traffic you're already paying for converts at a higher rate." },
    authoritySignal: "We've seen this pattern across multiple e-commerce businesses. It's almost never a traffic problem.",
    howWorks: [
      { title: 'Shopper adds to cart and leaves', body: 'They get a sequence timed to bring them back — while they still remember what they wanted.' },
      { title: 'Questions get answered automatically', body: 'No wait time. No ticket queue. Instant response on the products and policies they\'re asking about.' },
      { title: 'The system follows up after the sale', body: "Shipping, reviews, reorders — all handled without anyone on your team touching it." },
    ],
    howWorksCallout: { strong: 'Everything that used to require a team member runs in the background.' },
    proofs: [
      { strong: 'What store owners usually underestimate', p: 'How much revenue is sitting in abandoned carts that a well-timed sequence could recover.' },
      { strong: 'What changes when follow-up improves', p: "Higher conversion rate, fewer support tickets, and more repeat purchases from existing customers." },
      { strong: 'The real result', p: 'Same traffic. More revenue. Less manual work.' },
    ],
    microProof: "One store had significant cart abandonment with no recovery sequence in place. After adding timed follow-up, a portion of those carts converted that previously would have been lost.",
    ctaHeadline: "I'll show you where you're losing revenue",
    ctaSub: "30 minutes. No pitch. Just a clear look at where shoppers are dropping off and what to fix first.",
    ctaList: ["— where cart abandonment is costing you most", "— what should be automated first", "— how it works in your actual store"],
  },

  'auto-dealerships': {
    name: 'Auto & Dealerships',
    headline: "Shoppers research at midnight.",
    headlineBreak: "Your website form sits there. They've booked a test drive somewhere else by morning.",
    heroSub: "Car buyers don't wait for business hours. The dealership that responds first closes more cars. We make sure that's you.",
    heroNote: 'Built for independent dealers, franchise dealerships, and automotive groups managing web leads.',
    heroCta: "I'll show you exactly where this is happening in your business",
    connectionLine: "This is almost always the first place we find the leak in dealership businesses.",
    specificityLine: "The customer who submits a form at 9pm buys from whoever calls first in the morning. Most dealers call at 10am.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'Night-shift web traffic goes nowhere', body: "9pm to midnight is your highest-traffic window. No one's responding. Shoppers move on to whoever answers." },
      { title: 'The service line is always backed up', body: "Customers on hold. Staff tied up. Scheduling calls burning time that should be on the floor." },
      { title: "Lead follow-up depends on who's working", body: "Hot lead on a slow Tuesday? Called back in 20 minutes. Same lead on a busy Saturday? Still sitting there Monday." },
      { title: 'Web form leads go cold overnight', body: "They submitted a form ready to come in. By morning, they've scheduled a test drive at a competitor who responded the same night." },
    ],
    painCallout: { strong: "You don't have a traffic problem.", p: 'The form was filled out. No one called before the competitor did.' },
    offersIntro: "Not a CRM. Just the systems that make sure no lead sits unanswered long enough to go cold.",
    offers: [
      { title: 'Every web inquiry gets an instant response', body: 'Vehicle interest, budget, trade-in, timeline — collected before your team even sees the lead.' },
      { title: 'Service scheduling runs online', body: "Customers book, confirm, and reschedule without calling. Your phone frees up. Your advisors stay on the floor." },
      { title: 'Follow-up runs automatically', body: "Every lead gets a consistent cadence regardless of day, volume, or who's working." },
      { title: 'Hot lead summaries hit your team before they arrive', body: "By the time your salesperson walks in, they know who's serious and what they're looking for." },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: "The goal is simple: no lead waits long enough to call your competitor." },
    authoritySignal: "We've seen this pattern across multiple dealerships. It's almost never a traffic or inventory problem.",
    howWorks: [
      { title: 'Someone fills out a form or DMs', body: "They get a response in seconds — the same response whether it's 2pm or 2am." },
      { title: 'They get qualified and moved forward', body: 'Vehicle interest collected. Appointment offered. Hot lead summary sent to your team.' },
      { title: 'The system follows up', body: "You don't track it. Consistent follow-up runs until they buy, visit, or opt out." },
    ],
    howWorksCallout: { strong: "Everything that used to depend on who was working runs in the background." },
    proofs: [
      { strong: 'What dealerships usually underestimate', p: 'How many web leads go cold overnight simply because no one responded before the competitor did.' },
      { strong: 'What changes when response time drops', p: "More test drives booked, more service appointments filled, and follow-up that doesn't depend on anyone remembering to call." },
      { strong: 'The real result', p: 'Same traffic. More sales. Less depending on the right person being available.' },
    ],
    microProof: "One dealership was getting consistent web leads overnight but had no system to respond until the next day. After automating the first response, more of those leads converted to showroom visits.",
    ctaHeadline: "I'll show you where you're losing sales",
    ctaSub: "30 minutes. No pitch. Just a clear look at where leads are going cold and what to fix first.",
    ctaList: ["— where overnight leads are disappearing", "— what should be automated first", "— how it works with your current setup"],
  },

  'education-tutoring': {
    name: 'Education & Tutoring',
    headline: "A parent's interest lasts about 72 hours.",
    headlineBreak: "After that, they've enrolled somewhere else.",
    heroSub: "Families research multiple programs at once. The one that responds fast and follows up wins the enrollment. We make sure that's you.",
    heroNote: 'Built for tutoring centers, online educators, learning programs, test prep companies, and independent instructors.',
    heroCta: "I'll show you exactly where this is happening in your business",
    connectionLine: "This is almost always the first place we find the leak in education and tutoring businesses.",
    specificityLine: "The parent reaching out is talking to three tutors at once. Whoever responds first usually gets the student.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'Inquiries sit unanswered for a day or two', body: "A family reaches out Tuesday. You respond Friday. They enrolled Thursday. That's the pace you're competing against." },
      { title: 'The same program questions repeat endlessly', body: "Curriculum, schedule, prerequisites, pricing, placement — every family asks the same things. You answer them manually, one at a time." },
      { title: 'Enrollment is still a manual process', body: "Application, assessment, onboarding packet — done through email threads, by hand, for every student." },
      { title: 'Good leads go cold between inquiry and commitment', body: "Someone expresses interest. Three days pass with no follow-up. They've moved on to a program that stayed in touch." },
    ],
    painCallout: { strong: "You don't have a demand problem.", p: 'The family was ready to enroll. They just enrolled somewhere that replied first.' },
    offersIntro: "Not complicated systems. Just the automation that turns inquiries into enrollments before interest fades.",
    offers: [
      { title: 'Every inquiry gets an instant response', body: "Program questions answered, fit assessed, and the family guided toward enrollment — automatically." },
      { title: 'Follow-up runs on a schedule', body: "Every lead gets consistent touchpoints that build trust and move them toward a decision, without you managing it." },
      { title: 'Enrollment paperwork runs automatically', body: "Applications, assessments, and onboarding handled without your admin team doing it manually for every student." },
      { title: 'New students get what they need immediately', body: "Access, schedules, prep materials — sent automatically upon enrollment." },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: "The goal is simple: no family falls through because the follow-up was slow." },
    authoritySignal: "We've seen this pattern across multiple education businesses. It's almost never a demand problem.",
    howWorks: [
      { title: 'A family reaches out', body: 'They get an immediate response with program information and a clear next step.' },
      { title: 'They get nurtured toward enrollment', body: 'Not just answered. Followed up with, consistently, until they commit or opt out.' },
      { title: 'Enrollment and onboarding run automatically', body: "You don't manage it. They get what they need. It runs." },
    ],
    howWorksCallout: { strong: 'Everything that used to depend on someone following up runs in the background.' },
    proofs: [
      { strong: 'What programs usually underestimate', p: 'How many families quietly enroll elsewhere because no one stayed in touch in the first 72 hours.' },
      { strong: 'What changes when response and follow-up improve', p: "More inquiries convert, enrollment becomes predictable, and your admin workload stays flat as you grow." },
      { strong: 'The real result', p: 'Same inquiries. More enrollments. Less manual work.' },
    ],
    microProof: "One tutoring program was getting consistent inquiries but follow-up was inconsistent. After automating the response and nurture sequence, more of those inquiries converted to enrolled students.",
    ctaHeadline: "I'll show you where you're losing enrollments",
    ctaSub: "30 minutes. No pitch. Just a clear breakdown of where families are going cold and what to fix first.",
    ctaList: ["— where inquiries are going quiet", "— what follow-up should look like", "— how it fits your current process"],
  },

  'events-entertainment': {
    name: 'Events & Entertainment',
    headline: "Every inquiry starts the same way.",
    headlineBreak: "Same questions. Same manual work. First vendor to quote wins.",
    heroSub: "Event clients are talking to three vendors at once. The first to respond with a real quote gets the call back. We make sure that's you.",
    heroNote: 'Built for event planners, photographers, caterers, DJs, venues, and entertainment companies.',
    heroCta: "I'll show you exactly where this is happening in your business",
    connectionLine: "This is almost always the first place we find the leak in events businesses.",
    specificityLine: "Event decisions move fast. If you're not the first to respond, you're not on the shortlist.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'Intake is manual, every single time', body: "Date, headcount, budget, venue, vibe, dietary restrictions — you collect it all from scratch for every inquiry. Hours, gone." },
      { title: 'Slow quotes lose clients to faster vendors', body: "You're building a proposal while they're hearing back from three other vendors. First to respond wins." },
      { title: 'Follow-up falls off after the first reply', body: "You send the quote. They go quiet. You mean to follow up. You don't. Someone else does." },
      { title: "Post-booking coordination is its own full-time job", body: "Contract, deposit, vendor calls, day-of logistics — managed through email threads, memory, and hope." },
    ],
    painCallout: { strong: "You don't have an inquiry problem.", p: 'The client was ready to book. They just booked the vendor who got back first.' },
    offersIntro: "Not complicated systems. Just the automation that gets you to a real quote faster than your competitors.",
    offers: [
      { title: 'Every inquiry gets an instant intake', body: 'Date, headcount, budget, and event details collected automatically so you can quote on the first reply.' },
      { title: 'Quotes go out faster', body: "With everything already collected, you're not sending a questionnaire — you're sending a number." },
      { title: 'Follow-up runs automatically', body: "If they go quiet after the quote, a follow-up fires. You stop losing bookings to whoever remembered to check in." },
      { title: 'Booking coordination runs in the background', body: "Contracts, deposits, and confirmations handled automatically. Clients always know what's next." },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: "The goal is simple: you respond with a real quote before they hear back from someone else." },
    authoritySignal: "We've seen this pattern across multiple events businesses. It's almost never an inquiry volume problem.",
    howWorks: [
      { title: 'Someone inquires', body: 'They get an instant intake — event details collected before you\'re even involved.' },
      { title: 'You quote fast', body: "Everything you need is already there. You respond with a real number on the first reply." },
      { title: 'The system follows up and closes the loop', body: "Quote sent. Follow-up scheduled. Contract and deposit handled automatically if they say yes." },
    ],
    howWorksCallout: { strong: 'Everything that used to slow down your quote process runs in the background.' },
    proofs: [
      { strong: 'What event vendors usually underestimate', p: 'How often they lose bookings to competitors who simply quoted first — not better, just faster.' },
      { strong: 'What changes when intake gets faster', p: "More inquiries convert to quotes, more quotes convert to bookings, and you stop losing business to vendors who move faster." },
      { strong: 'The real result', p: 'Same inquiries. More bookings. Less time on intake and follow-up.' },
    ],
    microProof: "One event vendor was taking several days to respond to inquiries while collecting details manually. After automating intake, they were quoting on the first reply and converting more of those inquiries.",
    ctaHeadline: "I'll show you where you're losing bookings",
    ctaSub: "30 minutes. No pitch. Just a clear look at where inquiries are slipping and what to fix first.",
    ctaList: ["— where intake is slowing you down", "— what should be automated first", "— how it fits your current operation"],
  },

  'property-management': {
    name: 'Property Management',
    headline: "More units, same team.",
    headlineBreak: "It's possible — if the right things run automatically.",
    heroSub: "Maintenance requests, tenant questions, and showing coordination eat your team's time. We build the systems that handle that automatically so your team handles what actually matters.",
    heroNote: 'Built for property managers, landlords, and management companies handling 20+ units.',
    heroCta: "I'll show you exactly where this is happening in your business",
    connectionLine: "This is almost always the first place we find the leak in property management businesses.",
    specificityLine: "The tenant who doesn't hear back in 24 hours signs somewhere else. The maintenance request that goes unacknowledged becomes a review.",
    painLabel: "What's actually happening",
    pains: [
      { title: 'Maintenance requests fall through the cracks', body: 'Tenants report issues by text, email, call, and portal — sometimes all four. Tracking, routing, and following up is a full-time job. Some always slip.' },
      { title: 'Every new tenant asks the same questions', body: 'Lease terms, parking, payment portals, trash schedules — you explain it again for every move-in. Multiply that by your vacancy rate.' },
      { title: 'Showing coordination takes 10 emails', body: "Prospective tenant wants to see unit 4B. Three emails from you, two replies, one time that doesn't work, a reschedule. Unit sits vacant." },
      { title: "Your team spends most of their time on repetitive communication", body: "Most of what they do could be handled automatically. Instead it's a full inbox and a long to-do list." },
    ],
    painCallout: { strong: "You don't have a staffing problem.", p: 'You have people doing work a system should be doing.' },
    offersIntro: "Not software for the sake of it. Just the systems that take repetitive work off your team's plate.",
    offers: [
      { title: 'Maintenance requests get routed automatically', body: "Tenants submit through one interface. AI triages by urgency, routes to the right vendor, and sends updates — without your team touching it." },
      { title: 'Tenant questions get answered instantly', body: "24/7 assistant that handles lease questions, payment info, policies, and move-in procedures. Same answer every time." },
      { title: 'Showings schedule themselves', body: "Prospective tenants pick a time, get a confirmation, and receive reminders — without a single back-and-forth email." },
      { title: 'Repetitive communication runs in the background', body: "Rent reminders, lease renewal prompts, policy updates — handled automatically so your team focuses on what matters." },
    ],
    offerCallout: { strong: 'The goal isn\'t "AI."', p: "The goal is simple: your team handles the work that needs them. Everything else runs automatically." },
    authoritySignal: "We've seen this pattern across multiple property management businesses. It's almost never a staffing problem — it's a systems problem.",
    howWorks: [
      { title: 'A tenant submits a request or has a question', body: 'They get an immediate response. Request logged, routed, or answered automatically.' },
      { title: 'The system handles the follow-through', body: "Vendor notified. Tenant updated. Nothing sits in someone's inbox waiting to be actioned." },
      { title: "Your team focuses on what can't be automated", body: "The work that actually needs judgment, relationship, and presence — not the third time someone asked about the parking policy." },
    ],
    howWorksCallout: { strong: "Everything that used to fill your team's inbox runs in the background." },
    proofs: [
      { strong: "What property managers usually underestimate", p: "How much of their team's day goes to communication that could be handled automatically." },
      { strong: 'What changes when systems improve', p: "Faster maintenance resolution, fewer tenant complaints, and a team that's focused on the work that actually requires them." },
      { strong: 'The real result', p: 'More units managed. Same team. Less friction.' },
    ],
    microProof: "One property management company was handling maintenance requests through a mix of texts, calls, and emails. After routing everything through one system, fewer requests slipped and tenants needed fewer follow-up contacts.",
    ctaHeadline: "I'll show you where your team is losing time",
    ctaSub: "30 minutes. No pitch. Just a clear look at what should be automated and what to fix first.",
    ctaList: ["— where repetitive work is eating your team's day", "— what should be automated first", "— how it fits your current operation"],
  },
};

// ── Page template ────────────────────────────────────────────────────────────
function buildNichePage(niche) {
  const painItems = niche.pains.map(p => `
        <div class="item">
          <div class="item-title">${p.title}</div>
          <div class="item-body">${p.body}</div>
        </div>`).join('');

  const offerItems = niche.offers.map(o => `
        <div class="item">
          <div class="item-title">${o.title}</div>
          <div class="item-body">${o.body}</div>
        </div>`).join('');

  const howWorksItems = niche.howWorks.map(h => `
        <div class="item">
          <div class="item-title">${h.title}</div>
          <div class="item-body">${h.body}</div>
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
      --bg: #020203;
      --fg: #EDEEF2;
      --muted: rgba(237,238,242,0.50);
      --muted-2: rgba(237,238,242,0.38);
      --rule: rgba(237,238,242,0.08);
      --rule-2: rgba(237,238,242,0.05);
      --pill: rgba(237,238,242,0.12);
      --accent-bg: #EDEEF2;
      --accent-fg: #020203;
    }

    body {
      background: var(--bg);
      color: var(--fg);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      min-height: 100vh;
      line-height: 1.6;
    }

    #starfield { position: fixed; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none; }
    .page { position: relative; z-index: 1; }

    nav {
      display: flex; justify-content: space-between; align-items: center;
      padding: 1.5rem 2.5rem;
      border-bottom: 1px solid var(--rule);
    }
    .wordmark {
      font-family: ui-monospace, 'Courier New', monospace;
      font-size: 13px; letter-spacing: 0.15em; color: var(--fg);
      display: flex; align-items: center; gap: 6px; text-decoration: none;
    }
    .wordmark-bracket { opacity: 0.35; }
    .wordmark-dot { width: 7px; height: 7px; background: var(--fg); border-radius: 50%; }
    .nav-cta {
      font-size: 13px; color: var(--muted); text-decoration: none;
      letter-spacing: 0.04em; transition: color 0.2s;
    }
    .nav-cta:hover { color: var(--fg); }

    .hero { max-width: 820px; margin: 0 auto; padding: 6rem 2rem 4rem; text-align: center; }
    .niche-tag {
      display: inline-block; font-size: 11px; letter-spacing: 0.12em;
      text-transform: uppercase; color: rgba(237,238,242,0.35);
      border: 1px solid var(--pill); border-radius: 20px;
      padding: 5px 14px; margin-bottom: 2rem;
    }
    .hero h1 {
      font-size: clamp(2.15rem, 5vw, 3.35rem); font-weight: 700;
      line-height: 1.06; letter-spacing: -0.03em; margin-bottom: 1.2rem;
    }
    .hero h1 .break { display: block; color: rgba(237,238,242,0.92); }
    .hero-sub { max-width: 700px; margin: 0 auto 2.5rem; font-size: 1.08rem; color: var(--muted); }
    .btn {
      display: inline-block; background: var(--accent-bg); color: var(--accent-fg);
      font-size: 14px; font-weight: 600; letter-spacing: 0.02em;
      padding: 14px 32px; border-radius: 10px; text-decoration: none;
      transition: opacity 0.2s, transform 0.15s;
    }
    .btn:hover { opacity: 0.88; transform: translateY(-1px); }
    .hero-note { margin-top: 1.5rem; font-size: 13px; color: rgba(237,238,242,0.34); letter-spacing: 0.01em; }

    /* ── Connection block ── */
    .connection-block {
      max-width: 820px;
      margin: 0 auto;
      padding: 2rem 2rem 0;
    }
    .connection-block p {
      font-size: 15px;
      color: rgba(237,238,242,0.52);
    }
    .specificity-line {
      margin-top: 0.45rem;
      font-size: 14px;
      color: rgba(237,238,242,0.34);
    }

    .section { max-width: 820px; margin: 0 auto; padding: 4rem 2rem; border-top: 1px solid var(--rule); }
    .section-label { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(237,238,242,0.3); margin-bottom: 2rem; }
    .section-intro { font-size: 1rem; color: var(--muted); margin-bottom: 2.2rem; max-width: 660px; }
    .items { display: flex; flex-direction: column; gap: 2rem; }
    .item { display: grid; grid-template-columns: 1fr; gap: 0.45rem; padding-bottom: 0.25rem; }
    @media (min-width: 620px) { .item { grid-template-columns: 250px 1fr; gap: 1.5rem; align-items: start; } }
    .item-title { font-size: 15px; font-weight: 600; color: var(--fg); }
    .item-body { font-size: 15px; color: var(--muted); line-height: 1.68; }

    .split-callout {
      margin-top: 2rem; padding-top: 1.75rem;
      border-top: 1px solid var(--rule-2);
      display: grid; grid-template-columns: 1fr; gap: 0.8rem;
    }
    .split-callout strong { display: block; font-size: 1.05rem; font-weight: 650; color: var(--fg); letter-spacing: -0.01em; }
    .split-callout p { color: var(--muted); font-size: 15px; max-width: 620px; }

    /* ── Authority signal ── */
    .authority-signal {
      font-size: 13px;
      color: rgba(237,238,242,0.32);
      font-style: italic;
      margin-top: 0.2rem;
    }

    .micro-proof { display: grid; grid-template-columns: 1fr; gap: 1rem; margin-top: 1rem; }
    .proof-box { padding: 1.15rem 1.25rem; border: 1px solid var(--rule); border-radius: 14px; background: rgba(237,238,242,0.02); }
    .proof-box strong { display: block; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: rgba(237,238,242,0.68); margin-bottom: 0.5rem; }
    .proof-box p { font-size: 15px; color: var(--muted); line-height: 1.65; }

    /* ── Micro proof story box ── */
    .proof-box.proof-story {
      border-style: dashed;
      border-color: rgba(237,238,242,0.1);
    }
    .proof-box.proof-story p {
      font-size: 14px;
      color: rgba(237,238,242,0.42);
      font-style: italic;
    }

    .cta-section { max-width: 820px; margin: 0 auto; padding: 4rem 2rem 6rem; text-align: center; border-top: 1px solid var(--rule); }
    .cta-section h2 { font-size: 1.8rem; font-weight: 700; margin-bottom: 0.8rem; letter-spacing: -0.02em; }
    .cta-section p { color: var(--muted-2); margin: 0 auto 2rem; font-size: 15px; max-width: 620px; }
    .cta-list { list-style: none; display: inline-flex; flex-direction: column; gap: 0.35rem; margin: 0 0 2rem; color: rgba(237,238,242,0.62); font-size: 14px; }

    footer {
      display: flex; justify-content: space-between; padding: 1.5rem 2.5rem;
      border-top: 1px solid var(--rule); font-size: 12px;
      color: rgba(237,238,242,0.25); letter-spacing: 0.04em; gap: 1rem; flex-wrap: wrap;
    }
    .footer-right { display: flex; align-items: center; gap: 8px; }
    .footer-dot { width: 6px; height: 6px; background: rgba(237,238,242,0.25); border-radius: 50%; }

    @media (max-width: 640px) {
      nav, footer { padding: 1.2rem 1.25rem; }
      .hero, .section, .cta-section { padding-left: 1.25rem; padding-right: 1.25rem; }
      .connection-block { padding-left: 1.25rem; padding-right: 1.25rem; }
      .hero { padding-top: 4.5rem; }
      .hero-sub { font-size: 1rem; }
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
      <a href="${CALENDLY}" class="btn" target="_blank" rel="noopener noreferrer">${niche.heroCta}</a>
      <div class="hero-note">${niche.heroNote}</div>
    </section>

    <div class="connection-block">
      <p>${niche.connectionLine}</p>
      <p class="specificity-line">${niche.specificityLine}</p>
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
      <div class="items">${offerItems}
      </div>
      <div class="split-callout">
        <strong>${niche.offerCallout.strong}</strong>
        ${niche.offerCallout.p ? `<p>${niche.offerCallout.p}</p>` : ''}
        <p class="authority-signal">${niche.authoritySignal}</p>
      </div>
    </section>

    <section class="section">
      <div class="section-label">How it actually works</div>
      <div class="items">${howWorksItems}
      </div>
      <div class="split-callout">
        <strong>${niche.howWorksCallout.strong}</strong>
      </div>
    </section>

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
