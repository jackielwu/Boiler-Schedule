// Get the schedule table.
var table = document.getElementsByClassName('datadisplaytable')[0];
// Get all items in the table.
var schedule_items = table.querySelectorAll('a');

var calendar_entries = Array.from(schedule_items).map(item => {
  // Extract information from HTML <a> items.
  const info_items = item.innerText.split("\n");
  const name = info_items[0];
  const CRN = info_items[1];
  const time = info_items[2];
  const location = info_items[3];
  // Store in JS objects.
  var calendar_entry = {};
  calendar_entry["name"] = name;
  calendar_entry["CRN"] = CRN;
  calendar_entry["time"] = time;
  calendar_entry["location"] = location;
  return calendar_entry;
});
// Send standard data object to main script.
chrome.extension.sendRequest(calendar_entries);
