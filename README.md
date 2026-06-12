# The Tawny Sick Day Logger

A single-file internal payroll tool for logging staff absences at The Tawny and generating month-end return-to-work reports for payroll.

It is a Tawny-branded version of the BDEV sick day logger, kept as a completely separate tool (separate data, separate recipients). The two never share storage.

## What it does

1. **Select an employee** and **set a date range** (last day worked through to first day back).
2. **Mark each day** as Worked, Sickness, Holiday, or Day off. Only Sickness days count as missed shifts.
3. **Generate a payroll report** in the agreed format, then **save** it.
4. **At month end**, pick the month and click *Open Email Draft*. The tool opens a pre-addressed email to **josh@thetawny.co.uk** and **jess@thetawny.co.uk** with all that month's entries, formatted and colour-coded. Review and send. If a Google Sheet is linked (see below), the same click also appends that month's data to the sheet.
5. **Return to Work form.** On each saved entry there's a *RTW form* button. It opens the full Tawny Return to Work & Self Certification form (Sections A–D), pre-filled with the employee name and absence dates. Complete it with the employee, type both signatures, and click *Send to Jess*. The tool generates a Tawny-branded PDF and emails it to Jess to add to the employee's file. *Preview PDF* lets you check or download a copy first.

## Storing data

Entries, the employee list, and your sign-off name are saved in the **browser's local storage** on the device you use it on. There is no server.

Use **Settings → Export Backup** regularly (and before clearing your browser or switching computers). Restore with **Import Backup**.

## Hosting

It is a single `index.html` with no build step or dependencies (fonts load from Google Fonts). To publish like the BDEV version:

1. Create a new repository (e.g. `tawny_sick_day_logger`) in GitHub Desktop.
2. Drop `index.html` and this `README.md` in, commit, and publish.
3. Enable **Settings → Pages → Deploy from branch → main / root** to get a live URL.

Or just open `index.html` in a browser to use it locally.

## Brand

Palette and type follow The Tawny house style: deep slate `#2a3b45`, warm cream `#efe8e0`, soft taupe `#c9bcaa`, muted slate-grey `#6e7c84`, with Playfair Display headings and Open Sans body. The status colours (red sickness / green worked / blue holiday) are kept functional for quick scanning.

## The Google backend (optional, powers two features)

One small Google Apps Script "web app" does two jobs for the tool:

1. **Month-end sheet sync** — when you click *Open Email Draft*, it appends one
   row per absence to a Google Sheet:
   `Logged to sheet | Month | Employee | Sick shifts missed | From | To | Date logged | Full report`
2. **Return to Work forms** — when you click *Send to Jess* on a form, it emails
   the completed PDF to Jess (and can also file it in a Drive folder).

You paste **one link** into Settings and it powers both. Because the tool is a
static page with no server, it talks to this script. One-time setup, ~5 minutes:

1. **Create the sheet.** Make a new Google Sheet (e.g. *Tawny Sick Days*) and
   share it with Josh and Jess.
2. **Add the script.** In the sheet: **Extensions → Apps Script**. Delete any
   placeholder code, paste the contents of [`google-sheet-sync.gs`](google-sheet-sync.gs),
   and click **Save**.
3. **Deploy it.** Top right: **Deploy → New deployment**. Click the gear and
   choose **Web app**. Set:
   - **Description:** Tawny sick day sync
   - **Execute as:** Me
   - **Who has access:** Anyone
   Click **Deploy**, then **Authorize access** and allow it (it's your own script).
4. **Copy the link.** Copy the **Web app URL** (it ends in `/exec`).
5. **Paste it into the tool.** Open **⚙ Settings → Google Sync** and paste the
   URL. You'll see *"✓ Linked"*.

That's it. Opening the email draft now also sends the month to the sheet, and
*Send to Jess* on a Return to Work form emails the PDF to Jess. The tool
remembers what it has already sent on that device, so reopening the draft won't
create duplicate rows.

**Recipient for RTW forms** is set at the top of `google-sheet-sync.gs`
(`RTW_RECIPIENT = 'jess@thetawny.co.uk'`). To also file each PDF in Drive, paste
a folder ID into `RTW_DRIVE_FOLDER_ID`.

**Already deployed the sheet-only version?** The Return to Work feature sends
email, which needs an extra permission. Paste the newer `google-sheet-sync.gs`,
then **Deploy → Manage deployments → Edit → Version: New version → Deploy**, and
authorise again when prompted.

**Notes**
- Treat the web-app URL like a password, it lets anyone with it add rows or
  trigger an email. Don't publish it. (For extra safety, set `SHARED_SECRET` in
  the script and add `?secret=YOURWORD` to the URL you paste into Settings.)
- The URL is stored only in each person's browser, never in this repo or the
  published page. Anyone who will push data needs to paste it into their own
  Settings once.
- **Why "Anyone" access?** The tool sends the data without a Google login, so the
  script must accept the request. The `SHARED_SECRET` option above adds a guard.

## Return to Work forms & data protection

The Return to Work form captures **health information** (reason for absence,
medication, GP, fitness to return). Under UK GDPR this is special-category data,
so the tool is built to minimise it:

- **Nothing from the form is stored in the browser.** The answers are used to
  build the PDF and send it, then discarded. The only thing kept against an entry
  is a flag that a form was sent (and the date) — no medical detail, so it isn't
  in exports/backups either.
- Non-sensitive details (payroll number, job title, department) are remembered
  per employee to save re-typing. These are not health data.
- The PDF is emailed to a single internal recipient (Jess). Make sure that
  mailbox is appropriate for sickness records, and confirm the approach with
  whoever owns data protection at The Tawny.
- Typed names act as electronic signatures. If wet-ink signatures are required,
  use *Preview PDF*, print, and sign by hand instead.

## Changing the email recipients

Recipients are set in `index.html` in the `openEmail()` function:

```js
window.location.href = `mailto:josh@thetawny.co.uk,jess@thetawny.co.uk?subject=${subject}`;
```

The greeting (`Hi Josh and Jess,`) appears in both `buildEmailBodyPlain()` and `buildEmailBodyHtml()`.

---

The Tawny · Internal use only
