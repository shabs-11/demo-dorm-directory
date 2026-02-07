// Fetch dorms from API and render grid with filters
const API_URL = 'https://script.google.com/macros/s/AKfycbxQbOK53qvL3FwtkYklYVFWjKn2yc4w9sN4t7DYcgNg_ex5TpNvkqlXulecBYfwSusCuw/exec?sheet=dorms'; // Replace with your actual API endpoint

let dorms = [];
let filteredDorms = [];
let events = [];
let filteredEvents = [];
// Embedded fallback for events-data.json so page works without a web server
const embeddedEvents = [
  {
    "Title": "Keenan Revue - Night 1",
    "Date": "2026-02-26T05:00:00.000Z",
    "Time": "1899-12-31T01:00:00.000Z",
    "EndTime": "1899-12-31T03:30:00.000Z",
    "Location": "Stepan Center",
    "Dorm": "Keenan Hall",
    "Category": "Tradition",
    "Description": "The legendary annual variety show featuring skits, comedy, and musical performances. Proceeds benefit Dismas House.",
    "Featured": true
  },
  {
    "Title": "Keenan Revue - Night 2",
    "Date": "2026-02-27T05:00:00.000Z",
    "Time": "1899-12-31T01:00:00.000Z",
    "EndTime": "1899-12-31T03:30:00.000Z",
    "Location": "Stepan Center",
    "Dorm": "Keenan Hall",
    "Category": "Tradition",
    "Description": "Night two of Notre Dame's most beloved student show. Get your tickets early — they go fast.",
    "Featured": true
  },
  {
    "Title": "Keenan Revue - Night 3",
    "Date": "2026-02-28T05:00:00.000Z",
    "Time": "1899-12-31T01:00:00.000Z",
    "EndTime": "1899-12-31T03:30:00.000Z",
    "Location": "Stepan Center",
    "Dorm": "Keenan Hall",
    "Category": "Tradition",
    "Description": "Closing night of the Keenan Revue. Don't miss the finale.",
    "Featured": true
  },
  {
    "Title": "Fisher Regatta",
    "Date": "2026-04-19T04:00:00.000Z",
    "Time": "1899-12-30T18:00:00.000Z",
    "EndTime": "1899-12-30T22:00:00.000Z",
    "Location": "St. Mary's Lake",
    "Dorm": "Fisher Hall",
    "Category": "Tradition",
    "Description": "Teams build and race homemade boats across the lake. One of the most iconic events of the year.",
    "Featured": true
  },
  {
    "Title": "Dillon Pep Rally",
    "Date": "2026-09-04T04:00:00.000Z",
    "Time": "1899-12-31T00:00:00.000Z",
    "EndTime": "1899-12-31T02:00:00.000Z",
    "Location": "South Quad",
    "Dorm": "Dillon Hall",
    "Category": "Tradition",
    "Description": "Comedy skits, dorm cheers, and high energy — the unofficial kickoff to football season.",
    "Featured": false
  },
  {
    "Title": "Mr. ND Pageant",
    "Date": "2026-03-27T04:00:00.000Z",
    "Time": "1899-12-31T01:00:00.000Z",
    "EndTime": "1899-12-31T03:00:00.000Z",
    "Location": "Washington Hall",
    "Dorm": "Walsh Hall",
    "Category": "Tradition",
    "Description": "Walsh Hall's annual pageant to crown Mr. ND. Ticket proceeds support St. Margaret's House.",
    "Featured": false
  },
  {
    "Title": "McGlinn Casino Night",
    "Date": "2026-03-06T05:00:00.000Z",
    "Time": "1899-12-31T02:00:00.000Z",
    "EndTime": "1899-12-31T05:00:00.000Z",
    "Location": "McGlinn Hall",
    "Dorm": "McGlinn Hall",
    "Category": "Social",
    "Description": "A glamorous casino-themed night with blackjack, roulette, and poker. Dress to impress.",
    "Featured": false
  },
  {
    "Title": "Carroll Christmas",
    "Date": "2026-12-05T05:00:00.000Z",
    "Time": "1899-12-31T00:00:00.000Z",
    "EndTime": "1899-12-31T03:00:00.000Z",
    "Location": "Carroll Hall",
    "Dorm": "Carroll Hall",
    "Category": "Tradition",
    "Description": "Christmas lights, hot chocolate, karaoke, and photos with Santa on the far side of campus.",
    "Featured": false
  },
  {
    "Title": "Lewis House of Pancakes (LHOP)",
    "Date": "2026-03-13T04:00:00.000Z",
    "Time": "1899-12-31T04:00:00.000Z",
    "EndTime": "1899-12-30T07:00:00.000Z",
    "Location": "Lewis Hall",
    "Dorm": "Lewis Hall",
    "Category": "Service",
    "Description": "Late-night brunch fundraiser by the Chicks. All proceeds benefit the Food Bank of Northern Indiana.",
    "Featured": false
  },
  {
    "Title": "Dunne Castles for a Cause",
    "Date": "2026-02-21T05:00:00.000Z",
    "Time": "1899-12-30T20:00:00.000Z",
    "EndTime": "1899-12-30T14:00:00.000Z",
    "Location": "North Quad",
    "Dorm": "Dunne Hall",
    "Category": "Service",
    "Description": "Build cardboard castles and camp out overnight to raise money for the South Bend Center for the Homeless.",
    "Featured": false
  },
  {
    "Title": "Stanford Mardi Scraw",
    "Date": "2026-02-14T05:00:00.000Z",
    "Time": "1899-12-31T01:00:00.000Z",
    "EndTime": "1899-12-31T04:00:00.000Z",
    "Location": "Stanford Hall",
    "Dorm": "Stanford Hall",
    "Category": "Social",
    "Description": "Cajun food, king cake, music and masks before Lent begins. Proceeds support Live Well Water.",
    "Featured": false
  },
  {
    "Title": "Farley 5K",
    "Date": "2026-04-04T04:00:00.000Z",
    "Time": "1899-12-30T16:00:00.000Z",
    "EndTime": "1899-12-30T18:00:00.000Z",
    "Location": "North Quad",
    "Dorm": "Farley Hall",
    "Category": "Service",
    "Description": "A 5K with an egg hunt and prizes. All proceeds go to Our Lady of the Road.",
    "Featured": false
  },
  {
    "Title": "Keough Chariot Race",
    "Date": "2026-04-11T04:00:00.000Z",
    "Time": "1899-12-30T19:00:00.000Z",
    "EndTime": "1899-12-30T21:00:00.000Z",
    "Location": "South Quad",
    "Dorm": "Keough Hall",
    "Category": "Tradition",
    "Description": "Sections build and race chariots across South Quad. Proceeds go to Reins of Life.",
    "Featured": false
  },
  {
    "Title": "Alumni Iditarod",
    "Date": "2026-03-20T04:00:00.000Z",
    "Time": "1899-12-30T18:00:00.000Z",
    "EndTime": "1899-12-30T18:00:00.000Z",
    "Location": "South Quad",
    "Dorm": "Alumni Hall",
    "Category": "Service",
    "Description": "24 consecutive hours of jogging around South Quad in relay fashion. A true test of Dawg endurance.",
    "Featured": false
  },
  {
    "Title": "Duncan 9/11 Stair Climb",
    "Date": "2026-09-11T04:00:00.000Z",
    "Time": "1899-12-30T14:00:00.000Z",
    "EndTime": "1899-12-30T18:00:00.000Z",
    "Location": "Notre Dame Stadium",
    "Dorm": "Duncan Hall",
    "Category": "Service",
    "Description": "Students climb 110 flights of stairs in the stadium to honor first responders. Proceeds go to HEART 9/11.",
    "Featured": false
  },
  {
    "Title": "Knott Hot Dog Eating Contest",
    "Date": "2026-03-28T04:00:00.000Z",
    "Time": "1899-12-30T23:00:00.000Z",
    "EndTime": "1899-12-31T01:00:00.000Z",
    "Location": "Knott Hall",
    "Dorm": "Knott Hall",
    "Category": "Tradition",
    "Description": "Knott's iconic hot dog eating contest benefiting the Ronald McDonald House.",
    "Featured": false
  },
  {
    "Title": "Welsh Fam 5K Color Run",
    "Date": "2026-04-18T04:00:00.000Z",
    "Time": "1899-12-30T15:00:00.000Z",
    "EndTime": "1899-12-30T17:00:00.000Z",
    "Location": "Campus Trails",
    "Dorm": "Welsh Family Hall",
    "Category": "Service",
    "Description": "The Clary Murphy Thomas Memorial Color Run in honor of the Class of 2002. A colorful morning for a great cause.",
    "Featured": false
  },
  {
    "Title": "Sophomore Study Night",
    "Date": "2026-02-10T05:00:00.000Z",
    "Time": "1899-12-31T02:00:00.000Z",
    "EndTime": "1899-12-31T05:00:00.000Z",
    "Location": "Hesburgh Library",
    "Dorm": "Campus-Wide",
    "Category": "Academic",
    "Description": "Open study session with free snacks and tutoring support ahead of midterms.",
    "Featured": false
  },
  {
    "Title": "ND Day Service Projects",
    "Date": "2026-03-07T05:00:00.000Z",
    "Time": "1899-12-30T15:00:00.000Z",
    "EndTime": "1899-12-30T20:00:00.000Z",
    "Location": "Various Locations",
    "Dorm": "Campus-Wide",
    "Category": "Service",
    "Description": "Multiple dorm-organized volunteer projects around South Bend. Sign up through your hall.",
    "Featured": false
  },
  {
    "Title": "Pasquerilla East Pyros Game Night",
    "Date": "2026-02-20T05:00:00.000Z",
    "Time": "1899-12-31T01:00:00.000Z",
    "EndTime": "1899-12-31T04:00:00.000Z",
    "Location": "Pasquerilla East Hall",
    "Dorm": "Pasquerilla East Hall",
    "Category": "Social",
    "Description": "Board games, video game tournaments, and snacks. Open to all students.",
    "Featured": false
  }
];

// Filter fields based on example-data.json
const filterFields = ['Sex', 'Quad', 'Capacity'];

// No sort options
const sortFields = [];

function fetchDorms() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      dorms = data;
      filteredDorms = dorms;
      renderFilters();
      renderDormsGrid();
    })
    .catch(err => {
      document.getElementById('dormsGrid').innerHTML = '<div class="text-red-500">Failed to load dorms.</div>';
    });
}

function renderFilters() {
  const filtersDiv = document.getElementById('filters');
  filtersDiv.innerHTML = '';
  // Sex and Quad dropdowns
  ['Sex', 'Quad'].forEach(field => {
    const values = [...new Set(dorms.map(d => d[field]).filter(Boolean))];
    const select = document.createElement('select');
    select.className = 'px-3 py-2 rounded border';
    select.innerHTML = `<option value="">All ${field}</option>` + values.map(v => `<option value="${v}">${v}</option>`).join('');
    select.onchange = () => {
      applyFilters();
    };
    select.setAttribute('data-field', field);
    filtersDiv.appendChild(select);
  });
  // Capacity min filter
  const capacities = dorms.map(d => {
    // Some capacities are strings, so parseInt safely
    const val = parseInt(d.Capacity);
    return isNaN(val) ? null : val;
  }).filter(v => v !== null);
  const min = Math.min(...capacities);
  const max = Math.max(...capacities);
  const capacitySelect = document.createElement('select');
  capacitySelect.className = 'px-3 py-2 rounded border';
  capacitySelect.innerHTML = `<option value="">Min Capacity</option>`;
  // Add increments of 50 for usability
  for (let v = min; v <= max; v += 50) {
    capacitySelect.innerHTML += `<option value="${v}">${v}+</option>`;
  }
  capacitySelect.onchange = () => {
    applyFilters();
  };
  capacitySelect.setAttribute('data-field', 'CapacityMin');
  filtersDiv.appendChild(capacitySelect);
  // No sort dropdown
}

function fetchEvents() {
  fetch('events-data.json')
    .then(res => {
      if (!res.ok) throw new Error('Network response not ok');
      return res.json();
    })
    .then(data => {
      events = data;
      filteredEvents = events;
      renderEventsFilters();
      renderEventsList();
    })
    .catch(err => {
      console.warn('events fetch failed, falling back to embeddedEvents:', err);
      events = embeddedEvents.slice();
      filteredEvents = events;
      renderEventsFilters();
      renderEventsList();
    });
}

function renderEventsFilters() {
  const filtersDiv = document.getElementById('eventFilters');
  if (!filtersDiv) return;
  filtersDiv.innerHTML = '';
  // Date filter (unique dates from events)
  const dateValues = [...new Set(events.map(e => e.Date ? new Date(e.Date).toISOString().slice(0,10) : null).filter(Boolean))].sort();
  const dateSelect = document.createElement('select');
  dateSelect.className = 'px-3 py-2 rounded border';
  dateSelect.innerHTML = `<option value="">All Dates</option>` + dateValues.map(d => {
    const label = new Date(d).toLocaleDateString();
    return `<option value="${d}">${label}</option>`;
  }).join('');
  dateSelect.onchange = () => applyEventFilters();
  dateSelect.setAttribute('data-field', 'EventDate');
  filtersDiv.appendChild(dateSelect);

  // Time filter (unique times)
  const timeValues = [...new Set(events.map(e => e.Time ? new Date(e.Time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : null).filter(Boolean))];
  const timeSelect = document.createElement('select');
  timeSelect.className = 'px-3 py-2 rounded border';
  timeSelect.innerHTML = `<option value="">All Times</option>` + timeValues.map(t => `<option value="${t}">${t}</option>`).join('');
  timeSelect.onchange = () => applyEventFilters();
  timeSelect.setAttribute('data-field', 'EventTime');
  filtersDiv.appendChild(timeSelect);

  // Location filter
  const locationValues = [...new Set(events.map(e => e.Location).filter(Boolean))].sort();
  const locSelect = document.createElement('select');
  locSelect.className = 'px-3 py-2 rounded border';
  locSelect.innerHTML = `<option value="">All Locations</option>` + locationValues.map(l => `<option value="${l}">${l}</option>`).join('');
  locSelect.onchange = () => applyEventFilters();
  locSelect.setAttribute('data-field', 'EventLocation');
  filtersDiv.appendChild(locSelect);

  // Dorm filter
  const dormValues = [...new Set(events.map(e => e.Dorm).filter(Boolean))].sort();
  const dormSelect = document.createElement('select');
  dormSelect.className = 'px-3 py-2 rounded border';
  dormSelect.innerHTML = `<option value="">All Dorms</option>` + dormValues.map(d => `<option value="${d}">${d}</option>`).join('');
  dormSelect.onchange = () => applyEventFilters();
  dormSelect.setAttribute('data-field', 'EventDorm');
  filtersDiv.appendChild(dormSelect);
}

function applyEventFilters() {
  const dateSelect = document.querySelector('#eventFilters select[data-field="EventDate"]');
  const timeSelect = document.querySelector('#eventFilters select[data-field="EventTime"]');
  const locSelect = document.querySelector('#eventFilters select[data-field="EventLocation"]');
  const dormSelect = document.querySelector('#eventFilters select[data-field="EventDorm"]');
  filteredEvents = events.filter(ev => {
    // Date exact match (ISO yyyy-mm-dd)
    if (dateSelect && dateSelect.value) {
      const evDate = ev.Date ? new Date(ev.Date).toISOString().slice(0,10) : '';
      if (evDate !== dateSelect.value) return false;
    }
    // Time exact match (localized hh:mm)
    if (timeSelect && timeSelect.value) {
      const evTime = ev.Time ? new Date(ev.Time).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) : '';
      if (evTime !== timeSelect.value) return false;
    }
    // Location contains
    if (locSelect && locSelect.value) {
      if (!((ev.Location || '').toLowerCase().includes(locSelect.value.toLowerCase()))) return false;
    }
    // Dorm contains
    if (dormSelect && dormSelect.value) {
      if (!((ev.Dorm || '').toLowerCase().includes(dormSelect.value.toLowerCase()))) return false;
    }
    return true;
  });
  renderEventsList();
}

function renderEventsList() {
  const list = document.getElementById('eventsList');
  if (!list) return;
  if (!filteredEvents.length) {
    list.innerHTML = '<div class="text-gray-500">No events found.</div>';
    return;
  }
  list.innerHTML = filteredEvents.map(ev => {
    const date = ev.Date ? new Date(ev.Date) : null;
    const time = ev.Time ? new Date(ev.Time) : null;
    const when = date ? (time ? `${date.toLocaleDateString()} ${time.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : date.toLocaleString()) : '-';
    return `
      <div class="bg-white rounded shadow p-4 flex flex-col">
        <h3 class="text-lg font-semibold mb-1">${ev.Title || 'Untitled Event'}</h3>
        <div class="mb-1"><span class="font-medium">When:</span> ${when}</div>
        <div class="mb-1"><span class="font-medium">Location:</span> ${ev.Location || '-'}</div>
        <div class="mb-1"><span class="font-medium">Dorm:</span> ${ev.Dorm || '-'}</div>
        <div class="mb-1"><span class="font-medium">Category:</span> ${ev.Category || '-'}</div>
        <div class="text-sm text-gray-700 mt-2">${ev.Description || ''}</div>
      </div>
    `;
  }).join('');
}

function applyFilters() {
  const sexSelect = document.querySelector('#filters select[data-field="Sex"]');
  const quadSelect = document.querySelector('#filters select[data-field="Quad"]');
  const capacitySelect = document.querySelector('#filters select[data-field="CapacityMin"]');
  // No sort selects
  filteredDorms = dorms.filter(dorm => {
    // Sex filter
    if (sexSelect && sexSelect.value && dorm.Sex !== sexSelect.value) return false;
    // Quad filter
    if (quadSelect && quadSelect.value && dorm.Quad !== quadSelect.value) return false;
    // Capacity min filter
    if (capacitySelect && capacitySelect.value) {
      const dormCap = parseInt(dorm.Capacity);
      const minCap = parseInt(capacitySelect.value);
      if (isNaN(dormCap) || dormCap < minCap) return false;
    }
    return true;
  });
  // No sorting
  renderDormsGrid();
}

function renderDormsGrid() {
  const grid = document.getElementById('dormsGrid');
  if (!filteredDorms.length) {
    grid.innerHTML = '<div class="text-gray-500">No dorms found.</div>';
    return;
  }
  grid.innerHTML = filteredDorms.map(dorm => `
    <div class="bg-white rounded shadow p-4 flex flex-col">
      <h2 class="text-xl font-semibold mb-2">${dorm.Name || 'Unnamed Dorm'}</h2>
      <div class="mb-1"><span class="font-medium">Sex:</span> ${dorm.Sex || '-'}</div>
      <div class="mb-1"><span class="font-medium">Quad:</span> ${dorm.Quad || '-'}</div>
      <div class="mb-1"><span class="font-medium">Capacity:</span> ${dorm.Capacity || '-'}</div>
      <div class="mb-1"><span class="font-medium">Colors:</span> ${dorm.Colors || '-'}</div>
      <div class="mb-1"><span class="font-medium">Chapel:</span> ${dorm.Chapel || '-'}</div>
      <div class="mb-1"><span class="font-medium">Mascot:</span> ${dorm.Mascot || '-'}</div>
      <div class="mb-1"><span class="font-medium">Notes:</span> ${dorm.Notes || '-'}</div>
    </div>
  `).join('');
}

// Start
fetchDorms();
fetchEvents();
