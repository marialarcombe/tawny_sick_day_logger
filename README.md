# The Tawny Sick Day Logger

A single-file internal payroll tool for logging staff absences at The Tawny and generating month-end return-to-work reports for payroll.

It is a Tawny-branded version of the BDEV sick day logger, kept as a completely separate tool (separate data, separate recipients). The two never share storage.

## What it does

1. **Select an employee** and **set a date range** (last day worked through to first day back).
2. **Mark each day** as Worked, Sickness, Holiday, or Day off. Only Sickness days count as missed shifts.
3. **Generate a payroll report** in the agreed format, then **save** it.
4. **At month end**, pick the month and click *Open Email Draft*. The tool opens a pre-addressed email to **josh@thetawny.co.uk** and **jess@thetawny.co.uk** with all that month's entries, formatted and colour-coded. Review and send. If a Google Sheet is linked (see below), the same click also appends that month's data to the sheet.

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

## Sending the month's data to a Google Sheet (optional)

At month end, when you click **Open Email Draft**, the tool can also append that
month's entries to a Google Sheet. It writes one row per absence:

`Logged to sheet | Month | Employee | Sick shifts missed | From | To | Date logged | Full report`

Because the tool is a static page with no server, it sends the data to a tiny
Google Apps Script "web app" attached to your sheet. One-time setup, ~5 minutes:

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
5. **Paste it into the tool.** Open **⚙ Settings → Google Sheet Sync** and paste
   the URL. You'll see *"✓ Linked"*.

That's it. From then on, opening the email draft also sends the month to the
sheet. The tool remembers what it has already sent on that device, so opening
the draft again won't create duplicate rows.

**Notes**
- Treat the web-app URL like a password, it lets anyone with it add rows. Don't
  publish it. (For extra safety, set `SHARED_SECRET` in the script and add
  `?secret=YOURWORD` to the URL you paste into Settings.)
- The URL is stored only in each person's browser, never in this repo or the
  published page. Anyone who will push data needs to paste it into their own
  Settings once.
- **Why "Anyone" access?** The tool sends the data without a Google login, so the
  script must accept the request. The `SHARED_SECRET` option above adds a guard.

## Changing the email recipients

Recipients are set in `index.html` in the `openEmail()` function:

```js
window.location.href = `mailto:josh@thetawny.co.uk,jess@thetawny.co.uk?subject=${subject}`;
```

The greeting (`Hi Josh and Jess,`) appears in both `buildEmailBodyPlain()` and `buildEmailBodyHtml()`.

---

The Tawny · Internal use only
