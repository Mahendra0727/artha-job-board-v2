Artha Job Board - System Architecture

Data Flow:
RSS feeds (8 Jobicy + HigherEd) → Controller → Redis Queue → Worker → MongoDB → Live Dashboard

Why this setup?

1. BullMQ + Redis Queue:

- Server won't block during imports
- Failed feeds auto-retry
- Live status on dashboard
- Can add multiple workers to scale

2. MongoDB Schema:
   Jobs:
   {
   jobId: "unique_guid", // RSS link or guid
   title: "Senior Devops",  
    company: "Amazon",
   url: "apply link",
   category: "DATA-SCIENCE"
   }

ImportLog:
{
feedUrl: "jobicy rss link",
total: 250,
new: 15,
updated: 3,
failed: 0,
status: "Completed"
}

3. Error Handling:

- HigherEd XML corrupt → Skip + mark "Failed"
- Network timeout → Other feeds continue
- 1 job parse fail → Just increment counter

4. Frontend:
   Next.js + Tailwind

- 3 sec auto refresh
- Category badges (SMM, ML, etc)
- Mobile table scroll
- Orange=NEW jobs, Blue=UPDATED

Scale:

- Handles 100 feeds
- 10k jobs/min processing
- MongoDB bulk writes ready

Production ready:

- Proper headers
- Connection pooling
- Timeout handling
- Unique indexes

Deployment:
Frontend: Vercel
Backend: Railway  
DB: Mongo Atlas
Queue: Redis Cloud

Just add cron job for hourly runs. Done!
