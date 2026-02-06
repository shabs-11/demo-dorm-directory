// Fetch dorms from API and render grid with filters
const API_URL = 'https://script.google.com/macros/s/AKfycbxQbOK53qvL3FwtkYklYVFWjKn2yc4w9sN4t7DYcgNg_ex5TpNvkqlXulecBYfwSusCuw/exec?sheet=dorms'; // Replace with your actual API endpoint

let dorms = [];
let filteredDorms = [];

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
