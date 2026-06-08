/**
 * The Tawny Sick Day Logger — Google Sheet sync
 * ---------------------------------------------
 * Paste this into the Apps Script editor of the Google Sheet that should
 * receive the data (in the sheet: Extensions → Apps Script), then deploy it
 * as a Web App. Full step-by-step is in the README.
 *
 * It appends one row per absence each time the tool sends a month's data:
 *   Logged to sheet | Month | Employee | Sick shifts missed | From | To | Date logged | Full report
 */

// Optional extra safety. If you set a value here, also append it to the web-app
// link you paste into the tool's Settings, like:  ...AKfycb.../exec?secret=YOURWORD
// Leave as '' to turn the check off.
const SHARED_SECRET = '';

function doPost(e) {
  try {
    if (SHARED_SECRET) {
      const provided = (e.parameter && e.parameter.secret) || '';
      if (provided !== SHARED_SECRET) {
        return ContentService.createTextOutput('Unauthorised');
      }
    }

    const data  = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Write a header row the first time the sheet is used
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Logged to sheet', 'Month', 'Employee', 'Sick shifts missed',
        'From', 'To', 'Date logged', 'Full report'
      ]);
    }

    (data.rows || []).forEach(function (r) {
      sheet.appendRow([
        new Date(), r.month, r.employee, r.sick, r.from, r.to, r.savedAt, r.report
      ]);
    });

    return ContentService.createTextOutput('OK');
  } catch (err) {
    return ContentService.createTextOutput('Error: ' + err.message);
  }
}
