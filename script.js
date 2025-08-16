<script>
async function loadStudents() {
  try {
    // Load JSON file
    const response = await fetch('students.json');
    const data = await response.json();

    // Render both groups
    renderStudents(data.graduated, 'graduated-container');
    renderStudents(data.ongoing, 'ongoing-container');
  } catch (error) {
    console.error("Error loading students:", error);
  }
}

function renderStudents(list, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ""; // clear old content if any

  list
    .sort((a, b) => a.name.localeCompare(b.name)) // ensure alphabetical order
    .forEach(student => {
      // Build card dynamically
      const card = document.createElement("div");
      card.className = "col-sm-3 mb-3"; // 4 per row

      card.innerHTML = `
        <div class="well text-center">
          <img class="img-thumbnail" style="height: 150px; object-fit: cover;" 
               src="${student.image}" alt="${student.name}" />
          <div class="caption mt-2">
            <h5>${student.name}</h5>
            ${
              student.tags.map(
                (tag, idx) =>
                  `<span class="badge badge-pill ${idx === 0 ? "badge-primary" : "badge-secondary"}">${tag}</span>`
              ).join(" ")
            }
            ${student.profile ? `<a href="${student.profile}" class="badge badge-info" target="_blank">Profile</a>` : ""}
          </div>
        </div>
      `;

      container.appendChild(card);
    });
}

// Run generator after page loads
document.addEventListener("DOMContentLoaded", loadStudents);
</script>
