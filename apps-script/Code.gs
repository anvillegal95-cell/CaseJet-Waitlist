/**
 * CaseJet.ai pre-registration / waitlist handler.
 *
 * Setup (one-time):
 *   1. Open https://docs.google.com/spreadsheets and create a new Sheet.
 *   2. Rename the first tab to "Waitlist" and add this header row in A1:F1:
 *        Submitted At | Full Name | Email | Interest | Source | User Agent
 *   3. Extensions → Apps Script, paste this file, save.
 *   4. Deploy → New deployment → type: Web app.
 *        Execute as: Me
 *        Who has access: Anyone
 *   5. Copy the /exec URL and set VITE_WAITLIST_ENDPOINT in your .env file.
 */

var SHEET_NAME = "Waitlist";

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);
      sheet.appendRow(["Submitted At", "Full Name", "Email", "Interest", "Source", "User Agent"]);
    }

    var params = (e && e.parameter) || {};
    var submittedAt = params.submittedAt || new Date().toISOString();
    var fullName = (params.fullName || "").toString().trim();
    var email = (params.email || "").toString().trim().toLowerCase();
    var interest = (params.interest || "").toString().trim();
    var source = (params.source || "CaseJet.ai waitlist").toString().trim();
    var userAgent = (e && e.postData && e.postData.contents && params.userAgent) || "";

    if (!email || !fullName) {
      return jsonResponse({ success: false, error: "Missing name or email." });
    }

    if (isDuplicate(sheet, email)) {
      return jsonResponse({ success: true, duplicate: true });
    }

    sheet.appendRow([submittedAt, fullName, email, interest, source, userAgent]);
    return jsonResponse({ success: true });
  } catch (err) {
    return jsonResponse({ success: false, error: err && err.message ? err.message : String(err) });
  }
}

function doGet() {
  return jsonResponse({ ok: true, endpoint: "CaseJet waitlist" });
}

function isDuplicate(sheet, email) {
  if (!email) return false;
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return false;
  var values = sheet.getRange(2, 3, lastRow - 1, 1).getValues();
  for (var i = 0; i < values.length; i++) {
    var cell = (values[i][0] || "").toString().trim().toLowerCase();
    if (cell === email) return true;
  }
  return false;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
