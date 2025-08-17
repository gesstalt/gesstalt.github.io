// script.js (standalone file; no <script> tags)
// Keep your existing PhD rendering; add Masters rendering using the same JSON file.

console.log('script loaded');

function badge(text, cls) {
  return `<span class="badge badge-pill ${cls}">${text}</span>`;
}

function renderStudents(list = [], containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Container not found:', containerId);
    return;
  }
  container.innerHTML = '';
  list
    .slice()
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    .forEach(student => {
      const col = document.createElement('div');
      col.className = 'col-sm-3 mb-3';
      const tagsHtml = (student.tags || [])
        .map((t, i) => badge(t, i === 0 ? 'badge-primary' : 'badge-secondary'))
        .join(' ');
      const profileHtml = student.profile
        ? `<a href="${student.profile}" class="badge badge-info" target="_blank" rel="noopener">Profile</a>`
        : '';
      col.innerHTML = `
        <div class="well text-center">
          <img class="img-thumbnail" style="height:150px;object-fit:cover;" src="${student.image || ''}" alt="${student.name || ''}">
          <div class="caption mt-2">
            <h5>${student.name || ''}</h5>
            ${tagsHtml} ${profileHtml}
          </div>
        </div>
      `;
      container.appendChild(col);
    });
}


function renderMasters(list = [], containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Container not found:', containerId);
    return;
  }
  container.innerHTML = '';
  list
    .slice()
    .sort((a, b) => (a.name || '').localeCompare(b.name || ''))
    .forEach(s => {
      const col = document.createElement('div');
      col.className = 'col-sm-3 mb-3';

      const degreeHtml = s.degree ? badge(s.degree, 'badge-teach') : '';
      const statusHtml = s.status
        ? badge(s.status === 'Graduated' ? 'Graduated' : s.status, s.status === 'Graduated' ? 'badge-success' : 'badge-info')
        : '';
      const tagsHtml = (s.tags || [])
        .map((t, i) => badge(t, i === 0 ? 'badge-primary' : 'badge-secondary'))
        .join(' ');
      const profileHtml = s.profile
        ? `<a href="${s.profile}" class="badge badge-info" target="_blank" rel="noopener">Profile</a>`
        : '';

      col.innerHTML = `
        <div class="well text-center">
          <img class="img-thumbnail" style="height:150px;object-fit:cover;" src="${s.image || ''}" alt="${s.name || ''}">
          <div class="caption mt-2">
            <h5>${s.name || ''}</h5>
            ${degreeHtml} ${statusHtml} ${tagsHtml} ${profileHtml}
          </div>
        </div>
      `;
      container.appendChild(col);
    });
}

function renderInterns(list = [], containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error('Container not found:', containerId);
    return;
  }
  container.innerHTML = '';

  // Sort by name for consistent ordering
  const sorted = list.slice().sort((a, b) => (a.name || '').localeCompare(b.name || ''));

  sorted.forEach(intern => {
    const col = document.createElement('div');
    col.className = 'col-sm-3 mb-3';

    // Degree/status badges if provided
    const degreeHtml = intern.degree ? `<span class="badge badge-pill badge-teach">${intern.degree}</span>` : '';
    const statusHtml = intern.status
      ? `<span class="badge badge-pill ${intern.status === 'Graduated' ? 'badge-success' : 'badge-info'}">${intern.status}</span>`
      : '';

    // Tags badges
    const tagsHtml = (intern.tags || [])
      .map((t, i) => `<span class="badge badge-pill ${i === 0 ? 'badge-primary' : 'badge-secondary'}">${t}</span>`)
      .join(' ');

    // Optional profile link
    const profileHtml = intern.profile
      ? `<a href="${intern.profile}" class="badge badge-info" target="_blank" rel="noopener">Profile</a>`
      : '';

    col.innerHTML = `
      <div class="well text-center">
        <img class="img-thumbnail" style="height:150px;object-fit:cover;" src="${intern.image || ''}" alt="${intern.name || ''}">
        <div class="caption mt-2">
          <h5>${intern.name || ''}</h5>
          ${degreeHtml} ${statusHtml} ${tagsHtml} ${profileHtml}
        </div>
      </div>
    `;

    container.appendChild(col);
  });
}

async function loadStudents() {
  try {
    const res = await fetch('students.json?ts=' + Date.now(), { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to load students.json: ' + res.status + ' ' + res.statusText);
    const data = await res.json();

    // Ph.D
    renderStudents((data.phd && data.phd.graduated) || [], 'phd-graduated-container');
    renderStudents((data.phd && data.phd.ongoing) || [], 'phd-ongoing-container');

    // Masters
    renderMasters(data.masters || [], 'masters-container');

    // Interns
    renderInterns(data.interns || [], 'interns-container');
  } catch (e) {
    console.error('Error loading students:', e);
  }
}

document.addEventListener('DOMContentLoaded', loadStudents);
