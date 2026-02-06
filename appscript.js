
// Serve sheet data as JSON. First row used as labels.
function doGet(e) {
	const sheetName = (e && e.parameter && e.parameter.sheet) || 'dorms';
	// Replace with your spreadsheet ID when using a standalone script.
	// If left as a placeholder or invalid, the script will try to use the bound spreadsheet.
	const spreadsheetId = '943877090ID';

	let spreadsheet = null;

	// Try opening by ID when the ID looks valid; otherwise use active spreadsheet.
	try {
		const looksLikeId = typeof spreadsheetId === 'string' && /^[A-Za-z0-9-_]{20,}$/.test(spreadsheetId);
		if (looksLikeId) {
			spreadsheet = SpreadsheetApp.openById(spreadsheetId);
		} else {
			spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
		}
	} catch (err) {
		// If openById failed (invalid ID or no access), try active spreadsheet as fallback.
		try {
			spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
		} catch (err2) {
			const payload = { error: 'Unable to open spreadsheet', details: err.toString() };
			return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
		}
	}

	if (!spreadsheet) {
		return ContentService.createTextOutput(JSON.stringify({ error: 'No spreadsheet available. Bind the script to a sheet or provide a valid spreadsheetId.' }))
			.setMimeType(ContentService.MimeType.JSON);
	}

	const sheet = spreadsheet.getSheetByName(sheetName);
	if (!sheet) {
		return ContentService.createTextOutput(JSON.stringify({ error: 'Sheet not found', sheet: sheetName }))
			.setMimeType(ContentService.MimeType.JSON);
	}

	try {
		const data = getSheetData(sheet);
		return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
	} catch (err) {
		return ContentService.createTextOutput(JSON.stringify({ error: 'Error reading sheet', details: err.toString() })).setMimeType(ContentService.MimeType.JSON);
	}
}

function getSheetData(sheet) {
	const range = sheet.getDataRange();
	const values = range.getValues();

	if (!values || values.length === 0) return [];

	const rawHeaders = values[0];
	const headers = rawHeaders.map(h => (h === null || h === undefined) ? '' : String(h).trim());

	const data = [];
	for (let i = 1; i < values.length; i++) {
		const rowArr = values[i];
		const rowObj = {};
		for (let j = 0; j < headers.length; j++) {
			const key = headers[j] || `column_${j + 1}`;
			rowObj[key] = rowArr[j] === undefined ? null : rowArr[j];
		}
		data.push(rowObj);
	}
	return data;
}
