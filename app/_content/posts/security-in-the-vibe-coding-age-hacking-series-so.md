---
title: Security in the Vibe Coding Age — Hacking Series.so
visibility: public
---

# Series.so Hack

> **TL;DR**: Series.so scans every user’s profile photo to infer race and gender, silently scrapes LinkedIn profiles, and—given only a user ID—reveals all shared Google Calendar events between that user and their contacts, plus names, emails, phone numbers and connection lists, allowing reconstruction of the full social network. I did this out of curiosity and my passion for AI safety, and I'm sharing my findings to help the team improve their security.

Building a startup is hard, especially in the crowded consumer social space. I was excited to see the founders of [Series.so](https://series.so) unveil themselves from stealth after
raising an astonishing $3M from well-known venture firms and angels. Their core product is their AI social network which users can interface with via iMessage, talking to their
conversational agent. In addition to their network, Series has cultivated hundreds of thousands of eyes on the team through marketing, an
[intern challenge](https://www.linkedin.com/posts/nathaneo-johnson-86aa4a253_introducing-the-series-a-2-week-reality-activity-7344360830127292416-t92R), and
charismatic co-founders who attract college students to use their product. However, building in public with the data of tens of thousands of college students is a privilege that comes with _major_ responsibilities, especially regarding
application security... and they left their entire backend API publicly available.

## Finding the Vulnerabilities

After signing up for Series to try out their iMessage agent, I began security research when I noticed that Series requires you to
provide read access to your Google Calendar to sign up (foreshadowing: good thing I did!). My calendar is personal, so I am scrutinous of any service that requests this data. I noticed that I could see my own `user_id` in the Chrome console, and it was also given to me as my referral code after completing the onboarding flow.

I then traced the network requests of the application. Images were sometimes loaded server-side from an RSC, but throughout the onboarding flow, I noticed other images were loaded from an external API with domain `*.web.app`, indicating some GCR backend. Following that endpoint, I went to the index route and noticed a FastAPI-style response. Then, I guessed that they were using SwaggerUI, went to `/docs`, and this took me to the full SwaggerUI docs for their completely unauthenticated backend. This vulnerability required no hacking skills, just some curiosity and a bit of poking around!

I discovered the second vulnerability after they had patched the first vulnerability (see the [timeline](#appendix---timeline-of-events) below). Any user could query
_any_ user's profile by `user_id`, which included personally identifying information (PII), all of their connections, and shared calendar events.

## Scope of the Vulnerabilities

**Vulnerability 1 (Unauthenticated API Access)** allows complete public access to the backend API, enabling malicious actors to:

- Determine whether a user exists by email or phone number
- Get any user's information by `user_id`, including PII (name, email, phone, age, connections, LinkedIn data, gender/race)
- Upload and modify a user's profile photo by `user_id`
- Reconstruct Series' entire social graph through breadth-first search

**Vulnerability 2 (User Data Access)** allows any user to query other users' profiles, enabling them to:

- Access the same PII as above for any user by `user_id`
- View shared calendar events between any user and their connections
- Reconstruct the social graph

## Concerning Practices

There are a variety of actions that Series performs without notifying the user:

- **Gender and Race detection**: For the route called "analyze face endpoint", the API analyzes the user's profile photo for face detection and metadata extraction. The
  [object for `picture_data`](https://gist.github.com/charliemeyer2000/2114dca872fa1903b349be670c48eb25) contains a field for gender and race, along with a confidence score for each field.
  ![gender and race detection](/analyze-face.png)
- **LinkedIn scraping**: For the route called "augment user", the API scrapes the user's LinkedIn for data.
  ![LinkedIn scraping](/linkedin-scrape.png)
- **Calendar event downloading**: Series stores all of your calendar events, and with the second vulnerability, you can see every event a user shares with their connections.

Series' published privacy policy lists [various methods](https://www.series.so/privacy#:~:text=We%20collect%20personal%20information%20from%20you%20in%20the%20following%20ways%3A) they use to gather data about you, yet it makes no mention of detecting gender or race, nor of scraping third-party sources such as LinkedIn. This is a major breach of privacy and a misrepresentation of their privacy policy. Numerous critics have raised concerns about storing biometric data, and a [recent nationwide class action](https://www.clearviewclassaction.com/Home/FAQ) against facial-recognition vendor Clearview AI shows how courts react when sensitive traits are gathered without clear notice.

## Suggestions for Improvement

Authentication is hard; however, this is _not an excuse_ for having unauthenticated endpoints that expose PII. For apps similar to Series performing AI workloads on web applications and
containing sensitive user data, I suggest:

- Use open-source authentication providers like [NextAuth](https://next-auth.js.org/) and [BetterAuth](https://www.better-auth.com/) or managed services like [Clerk](https://clerk.com)
  and [Auth0](https://auth0.com).
- Unless absolutely necessary, try to keep your application logic tightly coupled to your authentication system. For example, having a Next.js application with NextAuth and then also handling
  authenticating users on another external FastAPI server is _not trivial_. The workloads Series ran would certainly run in a Vercel function, and therefore, ensuring only authenticated users can access these endpoints is as [easy as an `await auth()` call](https://authjs.dev/getting-started/session-management/get-session).
- When exposing endpoints for customer-facing AI agents that display information or take actions on behalf of the user (tool calls, MCPs, chat apps), put strong guardrails in front of your APIs.

## Reflections

Many applications are rushing to put AI in front of their applications; however, if you're putting an MCP in front of your database and have a tool called `execute_sql()`, don't be surprised when you have a [Bobby Tables &trade;](https://xkcd.com/327/) incident. I'm not joking—the Neon MCP server [literally has this](https://github.com/neondatabase-labs/mcp-server-neon/blob/main/src/tools/tools.ts#L85)—sensitive customer data is one prompt injection away. Add a layer of abstraction between your MCP/LLM tool calls and your core application logic, detect prompt injection with a [classifier](https://huggingface.co/protectai/deberta-v3-base-prompt-injection-v2?text=I+like+you.+I+love+you), add an LLM-as-a-judge, obsess over observability, trace your agents, and eval, eval, eval! With Series' iMessage agent or _any_ company's customer-facing AI agents, adding layered security is a must.

In the era of vibe-coded applications or AI-driven development, it's incredibly tempting to iterate quickly and test an MVP as soon as possible, yet it seems like we're taking
"move fast and break things" too literally. It's dangerously easy to just click "accept all" from Cursor agent and ship insecure code. Although AI removes the majority of the grunt work from programming, it doesn't remove the necessity to think about system design, understand business requirements, and create maintainable and secured systems. _AI-generated code should be "untrusted by default,"_ and it is up to the developer to review and test the code before shipping it to production. You own what you ship.

Finally, I want to clarify _why_ I did this—pure curiosity. I care deeply about AI safety and application safety, and poking around websites is just a fun hobby of mine. I disclosed this vulnerability and am writing this because I want to see them succeed, but for the safety of all of the users & their data, catching this early and fixing it is paramount. The magnitude of the damage could have been much worse.

## Conclusion

Thanks to the many people who have supported me through this process of responsible disclosure and writing this report. Your feedback and advice have been invaluable.

At the time of writing this, I have yet to receive a bug bounty from the Series team.

> "Any fool can use a computer. Many do." - [Martin Fowler](https://en.wikipedia.org/wiki/Martin_Fowler)

---

## Appendix

## Timeline of Events

### Vulnerability 1 - 7/11/25

7/11/25

- **5:22PM:** I began investigating Series.
- **5:35PM:** I demonstrated fully unauthenticated access to their backend API.
- **7:00PM:** First contact with the team over email.
- **7:06PM:** I called the team, responsibly disclosed the vulnerability, and suggested improvements to secure their application.
- **~10:00PM:** Vulnerability fixed.

### Vulnerability 2 - 7/12-16/25

7/12/25

- **5:18PM:** I found a new vulnerability of an exposed endpoint.
- **5:23PM:** I reached out again via email to the founders.
- **6:24PM:** I called a co-founder, responsibly disclosed the new vulnerability, and proposed a fix.

7/15/25

- **5:05PM:** I called the engineering team to help fix the vulnerability.

_TODO: incomplete - they haven't fixed this one yet_.

## Examples

- For vulnerability 1, [here's](https://series-swagger-docs.vercel.app/) a snapshot of the SwaggerUI docs. I didn't download the `openapi.json`, so it's a bit non-functional (sorry). I have redacted the actual routes to protect the team.
- For vulnerability 2, I can see [shared calendar events](https://gist.github.com/charliemeyer2000/cee3c8f49b1df6663e9be485d05b93b9) of my connections (redacted for privacy) along with all of their PII. One could do this for any user by `user_id`.
