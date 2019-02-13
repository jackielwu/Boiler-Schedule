/*
 * Array to store all event objects to be sent to Google Calendar.
 */
var allEvents = [];

/*
 * Function to make every month string 2 characters long. Used in creating RRULE.
 */
Date.prototype.getMonthFormatted = function() {
  var month = this.getMonth() + 1;
  return month < 10 ? '0' + month : '' + month; // ('' + month) for string result
}

/*
 * Converts Date to RFC3339 format.
 */
function rfc3339(d) {
    function pad(n) {
        return n < 10 ? "0" + n : n;
    }
    function timezoneOffset(offset) {
        var sign;
        if (offset === 0) {
            return "Z";
        }
        sign = (offset > 0) ? "-" : "+";
        offset = Math.abs(offset);
        return sign + pad(Math.floor(offset / 60)) + ":" + pad(offset % 60);
    }
    return d.getFullYear() + "-" +
        pad(d.getMonth() + 1) + "-" +
        pad(d.getDate()) + "T" +
        pad(d.getHours()) + ":" +
        pad(d.getMinutes()) + ":" +
        pad(d.getSeconds()) +
        timezoneOffset(d.getTimezoneOffset());
}

/*
 * Updates UI with courses.
 */
function loadCourses() {
  var courseTable = document.getElementById('courses');
  for (var i = 0; i < allEvents.length; ++i) {
    var row = document.createElement('tr');
    var col0 = document.createElement('td');
    var checkbox = document.createElement('input');
    checkbox.checked = true;
    checkbox.type = 'checkbox';
    checkbox.id = 'course' + i;
    col0.appendChild(checkbox);
    var col1 = document.createElement('td');
    col1.innerText = allEvents[i].summary;
    row.appendChild(col0);
    row.appendChild(col1);
    courseTable.appendChild(row);
  }
}

/*
 * Converts course to Google Calendar event.
 */
function convertCourseToEvents(course) {
  var event = {};
  event["summary"] = course["code"];
  event["location"] = course["location"];
  event["description"] = course["name"] + "\n" + "Instructor: " + course["instructor"];
  event["start"] = {
    "dateTime" : getRealStartDate(convertTimeFormat(course["start_date"], course["start_time"]), course["days"][0]),
    "timeZone": "America/New_York"
  };
  event["end"] = {
    "dateTime" : getRealStartDate(convertTimeFormat(course["start_date"], course["end_time"]), course["days"][0]),
    "timeZone": "America/New_York"
  };
  event["recurrence"] = [recurrenceString(course["days"], course["end_date"])];
  return event;
}

/*
 * Replaces character in string.
 */
function setCharAt(str,index,chr) {
    if(index > str.length - 1) return str;
    return str.substr(0,index) + chr + str.substr(index+1);
}


/*
 * Creates RRULE string for event.
 */
function recurrenceString(days, end_date) {
  var str = "RRULE:";
  var freq_str = "FREQ=WEEKLY;"
  var days_str = "BYDAY=";
  for (var i = 0; i < days.length; i++) {
    days_str += convertDayCharToDayCode(days.charAt(i)) + ",";
  }
  days_str = setCharAt(days_str, days_str.length - 1, "");
  var end_date_obj = new Date(end_date);
  var until_str = "UNTIL=" + end_date_obj.getFullYear() + "" + end_date_obj.getMonthFormatted() + "" + end_date_obj.getDate() + "T035959Z;";
  return str + freq_str + until_str + days_str;
}

/*
 * Converts date and time to Google Calendar format.
 */
 function convertTimeFormat(date, time) {
   var date = new Date(date);
   date.setHours(time.split(":")[0]);
   date.setMinutes(time.split(":")[1]);
   return date;
 }

/*
* Converts day character to RRULE day format.
*/
function convertDayCharToDayCode(day) {
 switch (day) {
   case 'M':
     return 'MO';
   case 'T':
     return 'TU';
   case 'W':
     return 'WE';
   case 'R':
     return 'TH';
   case 'F':
     return 'FR';
 }
}

/*
 *
 */
function getRealStartDate(semester_start_date, day_code) {
  var increment_count;
  switch(day_code) {
    case 'M':
      increment_count = 0;
      break;
    case 'T':
      increment_count = 1;
      break;
    case 'W':
      increment_count = 2;
      break;
    case 'R':
      increment_count = 3;
      break;
    case 'F':
      increment_count = 4;
      break;
  }

  semester_start_date.setDate(semester_start_date.getDate() + increment_count);
  return rfc3339(semester_start_date);
}


chrome.extension.onRequest.addListener(function (course_array) {
  for (var i = 0; i < course_array.length; i++) {
    allEvents[i] = convertCourseToEvents(course_array[i]);
  }
  loadCourses();
})


/*
 * Authenticates with Google Calendar and synchronize events.
 */
function synchronize() {
  // Use jQuery to load GAPI script.
  $.getScript("https://apis.google.com/js/client.js", function() {
    // Load GAPI.Client.
    gapi.load('client', function() {
      console.log('GAPI.Client loaded.');
      // Load GAPI.Client.Calendar.
      gapi.client.load('calendar', 'v3', function() {
        console.log('GAPI.Client.Calendar loaded.');
        // Authenticate with Chrome identity.
        chrome.identity.getAuthToken({'interactive': true}, function(token) {
          // Set GAPI OAuth2 token.
          gapi.client.setToken({access_token: token});

          for (var i = 0; i < allEvents.length; i++) {
            var checked = document.getElementById('course' + i).checked;
            if (checked == false) {
              continue;
            }

            var request = gapi.client.calendar.events.insert({
              'calendarId': 'primary',
              'resource': allEvents[i]
            });

            console.log(allEvents[i]);
            request.execute(function(event) {
              console.log('Event created: ' + event.htmlLink);
            });
          }
        });
      });
    });
  });

};

window.onload = function() {
  document.getElementById('submit').onclick = synchronize;
  chrome.windows.getCurrent(function (currentWindow) {
    chrome.tabs.query(
      {
        active: true,
        windowId: currentWindow.id
      },
      function(activeTabs) {
        chrome.tabs.executeScript(
          activeTabs[0].id,
          {
            file: 'fetchCourses.js',
            allFrames: true
          });
      });
  });
};
