# WildWooHoo — Netlify + Supabase migration notes

This document describes how to take the WildWooHoo site from its current state (static, GitHub Pages) to a live members area with real authentication, a private application form, and a searchable talent-pool database.

You don't need any of this for the site to *look* like a fundable, networked studio — the visual reframe (Projects / Impact / Network / Portal stubs) is already in place. This is the backend wiring for when you're ready to flip the switch.

Estimated total time for a comfortable solo go: **2 evenings** (one for Netlify + Forms; one for Supabase + member login). Cost on free tiers: **$0** until you exceed 100 form submissions/month or 50,000 monthly active auth users.

---

## Phase 1 — Move hosting from GitHub Pages to Netlify

**Why:** GitHub Pages is static-only. Netlify is also static-but-from-your-GitHub-repo, plus it gives you free form handling, free serverless functions, free identity, and a publishable subdomain instantly. You keep `wildwoohoo.com` pointed at it via DNS.

**Steps:**

1. Go to `https://app.netlify.com` → sign up with the GitHub account that owns `Dr-WELI/WildWooHooDotCom`.
2. *Add new site → Import an existing project → GitHub →* select `WildWooHooDotCom`.
3. Build settings:
   - **Branch:** `main` (or whichever is your live branch)
   - **Build command:** *(leave empty — pure HTML)*
   - **Publish directory:** `/` (root)
4. *Deploy site.* Netlify will give you `something-pretty.netlify.app` immediately. Test it.
5. Once happy, *Domain settings → Add custom domain → `wildwoohoo.com`*. Netlify will tell you what DNS to point at it.
6. Disable GitHub Pages on the repo (Settings → Pages → None) so it doesn't serve a stale copy.

**Result:** the same site, deployed every time you push, on Netlify's CDN.

---

## Phase 2 — Wire the Network apply form

The `/network/index.html` page already has the form pre-flagged for Netlify:

```html
<form name="network-apply" method="POST" data-netlify="true" netlify-honeypot="bot-field" action="?submitted=1">
  <input type="hidden" name="form-name" value="network-apply" />
  ...
</form>
```

**Steps:**

1. Push the current code to your `main` branch.
2. After Netlify re-deploys, go to *Site → Forms* in the Netlify dashboard. You should see `network-apply` listed.
3. *Form notifications → Add notification → Email* → enter `hello@wildwoohoo.com` (or wherever you want to receive applications).
4. (Optional) Add a Zapier or Make automation: when a new form submission arrives → create a row in Airtable. This gives you a searchable database of applicants from day one.
5. Edit the form's `action="?submitted=1"` if you want to redirect to a custom thank-you page — e.g. create `/network/thanks.html` and change the action to `/network/thanks.html`.

**Result:** every applicant emails you (and lands in Airtable if you set up that Zap). You review and approve manually. No code required.

---

## Phase 3 — Real member login with Supabase

When you want actual sign-in (members visit `/portal/`, log in, see the brief board and member directory), set up Supabase.

**Steps:**

1. Go to `https://supabase.com` → sign up (GitHub login is fine).
2. *New project →* name it `wildwoohoo`. Pick a region close to your audience (Sydney for AU/EU mix). Save the database password somewhere safe.
3. In your Supabase project, *Authentication → Providers* → enable **Email** (magic-link or password — magic-link is friendlier, no password resets to worry about).
4. *SQL Editor → New query →* run this to create the members table:

   ```sql
   create table public.members (
     id uuid primary key references auth.users(id) on delete cascade,
     full_name text,
     role text,
     city text,
     country text,
     portfolio_links text,
     status text default 'pending' check (status in ('pending','approved','declined')),
     created_at timestamptz default now(),
     approved_at timestamptz
   );

   alter table public.members enable row level security;

   -- Members can read their own row
   create policy "self_read" on public.members
     for select using (auth.uid() = id);

   -- Only admins (you) can update status
   create policy "admin_update" on public.members
     for update using (auth.jwt() ->> 'email' = 'weli@weli.live');

   -- Approved members can read each other (member directory)
   create policy "approved_directory" on public.members
     for select using (
       (select status from public.members where id = auth.uid()) = 'approved'
       and status = 'approved'
     );
   ```

5. *Project Settings → API →* copy the `Project URL` and the `anon public` key.
6. Add the Supabase JS SDK to `/portal/index.html` (before `</body>`):

   ```html
   <script type="module">
     import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
     const supabase = createClient(
       'https://YOUR-PROJECT.supabase.co',
       'YOUR-ANON-KEY'
     );

     const form = document.getElementById('loginForm');
     const status = document.getElementById('loginStatus');
     // Remove the disabled attrs on the inputs once Supabase is wired.
     form.querySelectorAll('input, button').forEach(el => el.disabled = false);

     form.addEventListener('submit', async (e) => {
       e.preventDefault();
       const email = form.email.value;
       const { error } = await supabase.auth.signInWithOtp({ email });
       status.hidden = false;
       status.textContent = error
         ? `Error: ${error.message}`
         : 'Check your email — we just sent you a magic sign-in link.';
     });

     // On page load, if already signed in, show the dashboard
     supabase.auth.getSession().then(({ data: { session } }) => {
       if (session) document.body.classList.add('is-signed-in');
     });
   </script>
   ```

7. Build a `/portal/dashboard.html` that pulls the member directory:

   ```js
   const { data: members } = await supabase
     .from('members')
     .select('full_name, role, city, country')
     .eq('status', 'approved');
   ```

   Render those rows into the page. Members can now see each other.

**Result:** members hit `/portal/`, enter their email, get a sign-in link, land on `/portal/dashboard.html` with a searchable member directory. You (admin) see all applications in the Supabase dashboard and can update `status` to `approved` from there with a click.

---

## Phase 4 — Tie applications to Supabase (optional, later)

Right now, the apply form on `/network/` goes to Netlify. The login on `/portal/` goes to Supabase. To unify:

- Use a Netlify Function (free) triggered on form submission → insert a row in the Supabase `members` table with `status='pending'` → send the applicant a magic-link to log in once approved.
- OR: After you approve someone in Airtable/Netlify, manually email them a "you're in — sign in at wildwoohoo.com/portal" link. The first time they sign in, Supabase creates an `auth.users` row; you then manually create a matching `members` row in Supabase with `status='approved'`.

Phase 4 is convenience, not a blocker. Phase 3 + manual member creation is enough to ship.

---

## Phase 5 — Slack + Notion for collaboration

The web portal is for *discovery and identity*. Day-to-day collaboration should live where work actually happens.

- **Slack** (free tier) — one workspace, channels per project (`#kangaroo-time`, `#benevolence`, `#kanga-kangaroo`), one general (`#network`), one for open calls (`#briefs`). Invites sent manually after approval.
- **Notion** (free for personal) — one shared workspace, pages for: brand & visual guidelines, current briefs, project archive, grant templates, rate cards, contracts.
- Optional: **Airtable** for the master member directory you (admin) search when applying for grants ("show me music producers in Canberra with credits"). Airtable's view-and-filter UX is faster than building one yourself.

The site links to Slack and Notion via invite URLs inside the `/portal/dashboard.html` once members are signed in.

---

## Grant-application narrative (what funders see)

When you apply for ACT, NSW, Creative Australia, Creative Europe, Lei Rouanet, etc., the narrative is:

> *WildWooHoo is an independent creative studio with a curated network of XX music, video, animation, and research collaborators across Australia, Europe, and Brazil. Network members are vetted by application; all projects are produced with named collaborators credited and paid through the studio. Our flagship project (Kangaroo Time) has reached 250+ media outlets across six continents; the studio's project line (Mirror Worlds) is currently in pre-production on a 3-track EP (Benevolence) and a children's animated series (Kanga-Kangaroo).*

You apply through WildWooHoo. Collaborators are credited and paid. You can show:

- A live website with vetted member directory
- A roster of past and current projects with public reach metrics
- A defined social-impact thesis (animal behaviour as mirror for human society)
- A track record (Dance Your PhD 2024, Falling Walls Engage 2025 Top 30)

That's the package.

---

## Costs at a glance

| Service | Free tier | When you'd outgrow it |
|---|---|---|
| Netlify | 100 GB bandwidth, 100 form submissions/month, 125k function invocations/month | High-traffic launch or many applicants |
| Supabase | 50,000 monthly active users, 500 MB database | Once you have a real audience or large project archive |
| Slack | 10,000 messages history, unlimited members | Never — free tier is fine for a small network |
| Notion | Unlimited pages (personal), 10 guests | If the network grows beyond ~50 members |
| Airtable | 1,000 records per base | When the directory exceeds 1,000 |

Total at this stage: **$0/month** with custom domain.

---

## TL;DR action list

- [ ] Connect repo to Netlify, point `wildwoohoo.com` DNS at it
- [ ] Verify the apply form on `/network/` shows up in Netlify Forms after deploy
- [ ] Set up email notifications + optional Airtable Zap
- [ ] Create Supabase project, run the SQL above
- [ ] Replace the placeholder `<script>` in `/portal/index.html` with the real Supabase SDK
- [ ] Build `/portal/dashboard.html` for the member directory
- [ ] Set up Slack + Notion, link from the dashboard
- [ ] Write the grant-application narrative paragraph and keep it in Notion for re-use

---

## Phase 6 — Front-end / experience scale-up (future, optional)

The site is intentionally hand-coded static HTML/CSS/JS today — robust, fast, zero-maintenance, which is exactly right for the "fundable, established studio" goal. When there's appetite (and time) to push the *experience* toward a more cutting-edge, "2050" feel, these are the levers, lowest-risk first:

- **Motion & micro-interaction polish (low risk, high ROI).** A scroll-reveal proof is already live on the home page (self-contained block at the bottom of `index.html` — sections rise + fade in on scroll; fully progressive, reduced-motion-safe). Extend it page by page; add refined hover states, subtle parallax, tasteful entrance choreography. No framework or build step required.
- **Smooth-scroll with inertia (e.g. Lenis).** The continuous "buttery" feel beyond CSS `scroll-behavior`. Small library; test carefully on mobile and under reduced-motion.
- **WebGL / generative visuals (Three.js or raw WebGL).** On-brand with the stellar/starfield motif — an immersive generative hero or section background. **NOTE:** the user previously chose the moving showreel over a star overlay in the hero (see the reduced-motion comment in `styles.css`), so any starfield must be a deliberately re-confirmed decision, and probably lives somewhere *other* than the hero.
- **Component architecture (Astro).** The genuine structural upgrade: header / footer / nav become single components instead of being duplicated across ~8 HTML files. (Renaming "Open Calls" → "Collaborate" took edits in 7 files — that pain disappears with components.) Astro stays static-fast but adds reusability; the right moment to introduce a shared design-token system (spacing, type scale, motion language).
- **Dynamic / AI features (Netlify functions).** Now possible on Netlify: a live member directory (Supabase, see Phase 3), personalised content, generative or interactive elements, an AI-assisted concierge, and so on.

**Guiding principle:** for grant / funder optics, *clean + fast + coherent + 60fps* reads as premium. Restraint beats maximalism. Scale up craft deliberately — don't trade a robust, low-maintenance asset for a fragile spectacle.
