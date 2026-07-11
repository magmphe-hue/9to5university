// ============================================================
//  Supabase Configuration
// ============================================================
const SUPABASE_URL = 'https://pfqpyzfqwsksepoohive.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcXB5emZxd3Nrc2Vwb29oaXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzM1MTMsImV4cCI6MjA4OTk0OTUxM30.NPbcOFUPS_2zYg-2MjH1ukHrHqN8AjXRDrP1OpU4nNs';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
//  Page Switching (unchanged)
// ============================================================
window.switchPage = function(pageId) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-page'));
  const target = document.getElementById(pageId + '-page');
  if (target) target.classList.add('active-page');
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === pageId) link.classList.add('active');
  });
  window.scrollTo(0, 0);
  if (pageId === 'profile') renderProfilePage();
  // Resume builder is initialised on DOMContentLoaded and when switching to resume page
  if (pageId === 'resume') initResumeBuilder();
};
document.body.addEventListener('click', (e) => {
  const link = e.target.closest('[data-page]');
  if (link && link.dataset.page) {
    e.preventDefault();
    window.switchPage(link.dataset.page);
  }
});

// ============================================================
//  Auth & Profile (unchanged)
// ============================================================
let currentUser = null;
async function checkUser() {
  const { data: { user } } = await supabase.auth.getUser();
  currentUser = user;
  return user;
}
async function renderProfilePage() { /* ... same as before ... */ }
async function login() { /* ... */ }
async function signup() { /* ... */ }
// (Keep existing functions – they are not shown for brevity but must be present)

// ============================================================
//  NEW RESUME BUILDER (Full integration)
// ============================================================
let resumeBuilderInitialized = false;

function initResumeBuilder() {
  if (resumeBuilderInitialized) return;
  resumeBuilderInitialized = true;

  // ----- DOM refs -----
  const previewName = document.getElementById("previewName");
  const previewTitle = document.getElementById("previewTitle");
  const previewContact = document.getElementById("previewContact");
  const previewSummary = document.getElementById("previewSummary");
  const previewSkills = document.getElementById("previewSkills");
  const previewEducation = document.getElementById("previewEducation");
  const previewExperience = document.getElementById("previewExperience");
  const previewLanguages = document.getElementById("previewLanguages");
  const previewReferences = document.getElementById("previewReferences");

  // ----- Input listeners -----
  const inputs = ['fullName','jobTitle','email','phone','location','website','summary','skills','languages','references'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updateResume);
  });

  // ----- Main update function -----
  function updateResume() {
    previewName.textContent = document.getElementById("fullName").value || "Your Name";
    previewTitle.textContent = document.getElementById("jobTitle").value || "Professional Title";
    previewContact.innerHTML = `
      ${document.getElementById("email").value}<br>
      ${document.getElementById("phone").value}<br>
      ${document.getElementById("location").value}<br>
      ${document.getElementById("website").value}
    `;
    previewSummary.textContent = document.getElementById("summary").value;
    previewLanguages.textContent = document.getElementById("languages").value;
    previewReferences.textContent = document.getElementById("references").value;

    // Skills
    previewSkills.innerHTML = "";
    const skills = document.getElementById("skills").value.split(",");
    skills.forEach(skill => {
      if (skill.trim() !== "") {
        const badge = document.createElement("span");
        badge.className = "skill";
        badge.textContent = skill.trim();
        previewSkills.appendChild(badge);
      }
    });

    // Education
    previewEducation.innerHTML = "";
    document.querySelectorAll(".education-item").forEach(item => {
      const school = item.querySelector(".school").value;
      const qualification = item.querySelector(".qualification").value;
      const year = item.querySelector(".educationYear").value;
      if (school || qualification) {
        previewEducation.innerHTML += `
          <div class="education-card">
            <h3>${qualification}</h3>
            <small>${school}</small>
            <p>${year}</p>
          </div>
        `;
      }
    });

    // Experience
    previewExperience.innerHTML = "";
    document.querySelectorAll(".experience-item").forEach(item => {
      const company = item.querySelector(".company").value;
      const position = item.querySelector(".position").value;
      const years = item.querySelector(".years").value;
      const description = item.querySelector(".description").value;
      if (company || position) {
        previewExperience.innerHTML += `
          <div class="experience-card">
            <h3>${position}</h3>
            <small>${company}</small>
            <p>${years}</p>
            <p>${description}</p>
          </div>
        `;
      }
    });

    // Auto-save to localStorage
    saveToLocalStorage();
  }

  // ----- Dynamic sections: Education -----
  document.getElementById("addEducation").addEventListener("click", () => {
    const container = document.getElementById("educationContainer");
    const div = document.createElement("div");
    div.className = "education-item";
    div.innerHTML = `
      <input type="text" class="school" placeholder="Institution">
      <input type="text" class="qualification" placeholder="Qualification">
      <input type="text" class="educationYear" placeholder="Year">
      <button class="removeEducation" style="background:#fee2e2; color:#b91c1c; padding:6px 12px; border-radius:6px; margin-top:5px;">Remove</button>
    `;
    container.appendChild(div);
    attachListeners(div);
  });

  // ----- Dynamic sections: Experience -----
  document.getElementById("addExperience").addEventListener("click", () => {
    const container = document.getElementById("experienceContainer");
    const div = document.createElement("div");
    div.className = "experience-item";
    div.innerHTML = `
      <input type="text" class="company" placeholder="Company">
      <input type="text" class="position" placeholder="Job Title">
      <input type="text" class="years" placeholder="Years Worked">
      <textarea class="description" placeholder="Description"></textarea>
      <button class="removeExperience" style="background:#fee2e2; color:#b91c1c; padding:6px 12px; border-radius:6px; margin-top:5px;">Remove</button>
    `;
    container.appendChild(div);
    attachListeners(div);
  });

  // ----- Remove handlers (delegated) -----
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("removeEducation")) {
      e.target.parentElement.remove();
      updateResume();
    }
    if (e.target.classList.contains("removeExperience")) {
      e.target.parentElement.remove();
      updateResume();
    }
  });

  // ----- Attach listeners to new dynamic fields -----
  function attachListeners(container) {
    container.querySelectorAll("input,textarea").forEach(el => {
      el.addEventListener("input", updateResume);
    });
  }

  // ----- Auto-save to localStorage -----
  function saveToLocalStorage() {
    const data = {};
    document.querySelectorAll("#resume-page input, #resume-page textarea").forEach(field => {
      if (field.id) data[field.id] = field.value;
    });
    // Also store dynamic sections as arrays
    const eduItems = [];
    document.querySelectorAll(".education-item").forEach(item => {
      eduItems.push({
        school: item.querySelector(".school").value,
        qualification: item.querySelector(".qualification").value,
        year: item.querySelector(".educationYear").value
      });
    });
    data._education = eduItems;
    const expItems = [];
    document.querySelectorAll(".experience-item").forEach(item => {
      expItems.push({
        company: item.querySelector(".company").value,
        position: item.querySelector(".position").value,
        years: item.querySelector(".years").value,
        description: item.querySelector(".description").value
      });
    });
    data._experience = expItems;
    localStorage.setItem("resumeBuilder", JSON.stringify(data));
  }

  // ----- Load from localStorage -----
  function loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem("resumeBuilder"));
    if (!data) return;
    Object.keys(data).forEach(key => {
      if (key.startsWith("_")) return; // skip meta
      const field = document.getElementById(key);
      if (field) field.value = data[key];
    });
    // Restore education
    if (data._education) {
      const container = document.getElementById("educationContainer");
      container.innerHTML = "";
      data._education.forEach(edu => {
        const div = document.createElement("div");
        div.className = "education-item";
        div.innerHTML = `
          <input type="text" class="school" placeholder="Institution" value="${edu.school || ''}">
          <input type="text" class="qualification" placeholder="Qualification" value="${edu.qualification || ''}">
          <input type="text" class="educationYear" placeholder="Year" value="${edu.year || ''}">
          <button class="removeEducation" style="background:#fee2e2; color:#b91c1c; padding:6px 12px; border-radius:6px; margin-top:5px;">Remove</button>
        `;
        container.appendChild(div);
        attachListeners(div);
      });
    }
    // Restore experience
    if (data._experience) {
      const container = document.getElementById("experienceContainer");
      container.innerHTML = "";
      data._experience.forEach(exp => {
        const div = document.createElement("div");
        div.className = "experience-item";
        div.innerHTML = `
          <input type="text" class="company" placeholder="Company" value="${exp.company || ''}">
          <input type="text" class="position" placeholder="Job Title" value="${exp.position || ''}">
          <input type="text" class="years" placeholder="Years Worked" value="${exp.years || ''}">
          <textarea class="description" placeholder="Description">${exp.description || ''}</textarea>
          <button class="removeExperience" style="background:#fee2e2; color:#b91c1c; padding:6px 12px; border-radius:6px; margin-top:5px;">Remove</button>
        `;
        container.appendChild(div);
        attachListeners(div);
      });
    }
    updateResume();
  }

  // ----- Photo upload -----
  document.getElementById("profilePhoto").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function() {
      const img = document.getElementById("previewPhoto");
      img.src = reader.result;
      img.style.display = "block";
      localStorage.setItem("profilePhoto", reader.result);
    };
    reader.readAsDataURL(file);
  });

  // Restore photo
  const savedPhoto = localStorage.getItem("profilePhoto");
  if (savedPhoto) {
    const img = document.getElementById("previewPhoto");
    img.src = savedPhoto;
    img.style.display = "block";
  }

  // ----- Template switching -----
  document.getElementById("templateSelector").addEventListener("change", function() {
    document.getElementById("resume").className = this.value;
  });

  // ----- Theme switching -----
  document.getElementById("themeSelector").addEventListener("change", function() {
    const resume = document.getElementById("resume");
    resume.classList.remove("theme-blue", "theme-green", "theme-gold", "theme-purple", "theme-black");
    resume.classList.add(this.value);
  });

  // ----- Dark mode -----
  document.getElementById("toggleDark").addEventListener("click", function() {
    document.body.classList.toggle("dark");
  });

  // ----- Reset -----
  document.getElementById("resetResume").addEventListener("click", function() {
    if (confirm("Delete this resume?")) {
      localStorage.clear();
      location.reload();
    }
  });

  // ----- PDF download (using html2pdf) -----
  document.getElementById("downloadPDF").addEventListener("click", function() {
    const resume = document.getElementById("resume");
    const opt = {
      margin: 0,
      filename: "Resume_9to5.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
    };
    html2pdf().set(opt).from(resume).save();
  });

  // ----- Save to Supabase (Cloud) -----
  document.getElementById("saveResumeSupabase").addEventListener("click", async function() {
    const user = await checkUser();
    if (!user) {
      alert("Please sign in to save to the cloud.");
      window.switchPage("profile");
      return;
    }
    // Gather all data
    const data = {
      fullName: document.getElementById("fullName").value,
      jobTitle: document.getElementById("jobTitle").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      location: document.getElementById("location").value,
      website: document.getElementById("website").value,
      summary: document.getElementById("summary").value,
      skills: document.getElementById("skills").value,
      languages: document.getElementById("languages").value,
      references: document.getElementById("references").value,
      education: [],
      experience: []
    };
    document.querySelectorAll(".education-item").forEach(item => {
      data.education.push({
        school: item.querySelector(".school").value,
        qualification: item.querySelector(".qualification").value,
        year: item.querySelector(".educationYear").value
      });
    });
    document.querySelectorAll(".experience-item").forEach(item => {
      data.experience.push({
        company: item.querySelector(".company").value,
        position: item.querySelector(".position").value,
        years: item.querySelector(".years").value,
        description: item.querySelector(".description").value
      });
    });
    const name = data.fullName || "Untitled";
    const { error } = await supabase.from("resumes").insert({
      user_id: user.id,
      name,
      data: data
    });
    if (error) alert("Error saving to cloud: " + error.message);
    else alert("Resume saved to cloud!");
  });

  // ----- Change Template button (opens dropdown) -----
  document.getElementById("changeTemplate").addEventListener("click", function() {
    document.getElementById("templateSelector").focus();
    document.getElementById("templateSelector").click();
  });

  // ----- Load from localStorage on init -----
  loadFromLocalStorage();

  // Expose updateResume globally for other functions
  window.updateResume = updateResume;
}

// ============================================================
//  DOMContentLoaded – Initialise
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
  await checkUser();
  // If resume page is active, init builder
  if (document.getElementById('resume-page').classList.contains('active-page')) {
    initResumeBuilder();
  }
  // Profile page initialisation (if needed)
  if (document.getElementById('profile-page').classList.contains('active-page')) {
    renderProfilePage();
  }
  // Nominate button (existing)
  document.getElementById('nominateBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    alert('Send nominations to mphelamlangeni@gmail.com with story and contact.');
  });
});