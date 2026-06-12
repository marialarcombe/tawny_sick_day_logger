/**
 * The Tawny Sick Day Logger — Google sync backend
 * -----------------------------------------------
 * Paste this into the Apps Script editor of the Google Sheet that should
 * receive the data (in the sheet: Extensions → Apps Script), then deploy it
 * as a Web App. Full step-by-step is in the README.
 *
 * It does two jobs, depending on what the tool sends:
 *
 *  1. Month-end sheet sync (type omitted): appends one row per absence:
 *       Logged to sheet | Month | Employee | Sick shifts missed | From | To | Date logged | Full report
 *
 *  2. Return to Work form (type === 'rtw'): emails the completed PDF to Jess
 *     so it can be added to the employee's file.
 *
 * NOTE: job 2 sends email, so the script needs Gmail/Mail permission. If you
 * deployed an earlier (sheet-only) version, you must paste this newer code and
 * deploy a NEW version so it asks for the extra permission.
 */

// Where Return to Work PDFs are sent. Change if needed.
const RTW_RECIPIENT = 'jess@thetawny.co.uk';

// Optional: also drop a copy of each RTW PDF into a Google Drive folder.
// Paste a Drive folder ID here to enable, or leave '' to skip.
const RTW_DRIVE_FOLDER_ID = '';

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

    const data = JSON.parse(e.postData.contents);

    if (data.type === 'rtw') {
      return handleRtw_(data);
    }

    return handleSheet_(data);
  } catch (err) {
    return ContentService.createTextOutput('Error: ' + err.message);
  }
}

// ── Month-end sheet sync ──────────────────────────────────────────────────────
function handleSheet_(data) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

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
}

// ── Return to Work form → email PDF to Jess ───────────────────────────────────
function handleRtw_(data) {
  const filename = data.filename || 'Return-to-Work.pdf';
  const blob = Utilities.newBlob(Utilities.base64Decode(data.pdfBase64), 'application/pdf', filename);

  const subject = 'Return to Work form — ' + (data.employee || 'Employee') +
                  (data.monthLabel ? ' (' + data.monthLabel + ')' : '');
  const body = 'Please find attached the completed Return to Work form for ' +
               (data.employee || 'the employee') + '.\n\n' +
               'Sent automatically from The Tawny Sick Day Logger.';

  MailApp.sendEmail({
    to: RTW_RECIPIENT,
    subject: subject,
    body: body,
    attachments: [blob]
  });

  // Optional: also file a copy in Drive
  if (RTW_DRIVE_FOLDER_ID) {
    try { DriveApp.getFolderById(RTW_DRIVE_FOLDER_ID).createFile(blob); } catch (err) {}
  }

  return ContentService.createTextOutput('OK');
}
