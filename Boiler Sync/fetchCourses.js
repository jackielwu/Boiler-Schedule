// Extract schedule table UI element from DOM.
var table = document.getElementsByClassName('datadisplaytable')[1];
// Extract course rows from table.
var course_rows = table.querySelectorAll('tr');
// Process UI elements.
var course_array = Array.from(course_rows).slice(1, -1).filter(validateCourseRow).map(processCourseRow);

// Send data to extension.
chrome.extension.sendRequest(course_array);

/*
 * Validates course as non-online.
 */
function validateCourseRow(row) {
  // Get course columns.
  const course_info = row.querySelectorAll('td');
  // Make sure it's not an online course.
  return course_info[8].innerText.match("^[a-zA-Z\(\)]+$");
}

/*
 * Converts course UI element to standard data object format.
 */
function processCourseRow(row) {
  // Get course columns.
  const course_info = row.querySelectorAll('td');
  // Process course info.
  var course_obj = {};
  course_obj["CRN"] = course_info[0].innerText;
  course_obj["code"] = course_info[1].innerText;
  course_obj["name"] = course_info[2].innerText;
  course_obj["start_date"] = course_info[6].innerText;
  course_obj["end_date"] = course_info[7].innerText;
  course_obj["days"] = course_info[8].innerText;
  course_obj["start_time"] = getStartTime(course_info[9].innerText);
  course_obj["end_time"] = getEndTime(course_info[9].innerText);
  course_obj["location"] = course_info[10].innerText;
  course_obj["instructor"] = course_info[11].innerText;

  console.log(course_obj);

  return course_obj;
}

/*
 * Fetches start time from time string.
 */
function getStartTime(time_string) {
  var start_time = time_string.split(" - ")[0];
  return convertTo24Hour(start_time);
}

/*
 * Fetches end time from time string.
 */
function getEndTime(time_string) {
  var end_time = time_string.split(" - ")[1];
  return convertTo24Hour(end_time);
}

/*
 * Converts 12 HR format to 24 HR format.
 */
function convertTo24Hour(time) {
  var hours = parseInt(time.substr(0, 2));
  if(time.indexOf('am') != -1 && hours == 12) {
    time = time.replace('12', '0');
  }
  if(time.indexOf('pm')  != -1 && hours < 12) {
    time = time.replace(hours, (hours + 12));
  }
  time.replace(' ', '');
  return time.replace(/(am|pm)/, '');
}
