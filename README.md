# The Tawny Sick Day Logger

A single-file internal payroll tool for logging staff absences at The Tawny and generating month-end return-to-work reports for payroll.

It is a Tawny-branded version of the BDEV sick day logger, kept as a completely separate tool (separate data, separate recipients). The two never share storage.

## What it does

1. **Select an employee** and **set a date range** (last day worked through to first day back).
2. **Mark each day** as Worked, Sickness, Holiday, or Day off. Only Sickness days count as missed shifts.
3. **Generate a payroll report** in the agreed format, then **save** it.
4. **At month end**, pick the month and click *Open Email Draft*. The tool opens a pre-addressed email to **josh@thetawny.co.uk** and **jess@thetawny.co.uk** with all that month's entries, formatted and colour-coded. Review and send.

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

## Changing the email recipients

Recipients are set in `index.html` in the `openEmail()` function:

```js
window.location.href = `mailto:josh@thetawny.co.uk,jess@thetawny.co.uk?subject=${subject}`;
```

The greeting (`Hi Josh and Jess,`) appears in both `buildEmailBodyPlain()` and `buildEmailBodyHtml()`.

---

The Tawny · Internal use only
