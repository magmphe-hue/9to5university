// ========================
// 1. PAGE NAVIGATION
// ========================
document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const pageId = el.dataset.page;
    if (!pageId) return;

    document.querySelectorAll('.page-section').forEach(section => {
      section.classList.remove('active-page');
    });

    const target = document.getElementById(`${pageId}-page`);
    if (target) target.classList.add('active-page');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// ========================
// 2. SAFE HELPERS
// ========================
function escapeHTML(str = '') {
  return str.replace(/[&<>"']/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[tag]));
}

function safeParse(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

// ========================
// 3. RESUME BUILDER
// ========================
const ids = [
  'firstName','lastName','jobTitle','phone','email','address',
  'summary','experience','education','skills','languages','awards','references',
  'templateSelect','cvPreview','downloadPdfBtn','saveResumeBtn'
];

const elements = {};
ids.forEach(id => elements[id] = document.getElementById(id));

const {
  firstName,lastName,jobTitle,phone,email,address,
  summary,experience,education,skills,languages,awards,references,
  templateSelect,cvPreview,downloadPdfBtn,saveResumeBtn
} = elements;

// ========================
// PARSERS
// ========================
const parseLines = (text, keys) =>
  text.split('\n').filter(l => l.trim()).map(line => {
    const parts = line.split('|').map(p => p.trim());
    return keys.reduce((obj, key, i) => {
      obj[key] = parts[i] || '';
      return obj;
    }, {});
  });

const getArray = (val) =>
  val.split(',').map(v => v.trim()).filter(Boolean);

// ========================
// DEBOUNCE
// ========================
let debounceTimer;
function debounceUpdate() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(updateCVPreview, 150);
}

// ========================
// PREVIEW
// ========================
function updateCVPreview() {
  if (!cvPreview) return;

  const data = {
    firstName: escapeHTML(firstName?.value),
    lastName: escapeHTML(lastName?.value),
    jobTitle: escapeHTML(jobTitle?.value),
    phone: escapeHTML(phone?.value),
    email: escapeHTML(email?.value),
    address: escapeHTML(address?.value),
    summary: escapeHTML(summary?.value),
    experience: parseLines(experience?.value || '', ['position','company','location','start','end','description']),
    education: parseLines(education?.value || '', ['institution','degree','start','end']),
    skills: getArray(skills?.value || ''),
    languages: getArray(languages?.value || ''),
    awards: parseLines(awards?.value || '', ['title','description','year']),
    references: parseLines(references?.value || '', ['name','company','phone','email'])
  };

  let html = minimalTemplate(data); // fallback
  const template = templateSelect?.value;

  const templates = {
    minimal: minimalTemplate,
    sidebar: sidebarTemplate,
    elegant: elegantTemplate,
    centered: centeredTemplate,
    modern: modernTemplate,
    card: cardTemplate,
    classic: classicTemplate
  };

  if (templates[template]) {
    html = templates[template](data);
  }

  if (cvPreview.innerHTML !== html) {
    cvPreview.innerHTML = html;
  }
}

// ========================
// TEMPLATES (UNCHANGED)
// ========================
// (All your template functions remain exactly the same here)

// ========================
// PDF DOWNLOAD
// ========================
async function downloadPDF() {
  if (!cvPreview) return;

  try {
    const canvas = await html2canvas(cvPreview, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210;
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save('resume.pdf');
  } catch (err) {
    console.error(err);
    alert('Failed to generate PDF.');
  }
}

// ========================
// SAVE RESUME
// ========================
function saveResumeToLocal() {
  const resumeData = {
    firstName: firstName?.value,
    lastName: lastName?.value,
    jobTitle: jobTitle?.value,
    phone: phone?.value,
    email: email?.value,
    address: address?.value,
    summary: summary?.value,
    experience: experience?.value,
    education: education?.value,
    skills: skills?.value,
    languages: languages?.value,
    awards: awards?.value,
    references: references?.value,
    template: templateSelect?.value,
    savedAt: new Date().toISOString()
  };

  const savedResumes = safeParse('9to5_resumes');
  savedResumes.push(resumeData);
  localStorage.setItem('9to5_resumes', JSON.stringify(savedResumes));

  alert('Resume saved!');
  loadProfilePage();
}

// ========================
// PROFILE PAGE
// ========================
function loadProfilePage() {
  const container = document.getElementById('profileContainer');
  if (!container) return;

  const savedResumes = safeParse('9to5_resumes');

  if (!savedResumes.length) {
    container.innerHTML = '<p>No saved resumes yet.</p>';
    return;
  }

  container.innerHTML = savedResumes.map((r, i) => `
    <div class="saved-resume-item">
      <div>
        <strong>${r.firstName} ${r.lastName}</strong> – ${r.jobTitle}<br>
        <small>${new Date(r.savedAt).toLocaleString()}</small>
      </div>
      <div>
        <button class="load-resume" data-i="${i}">Load</button>
        <button class="delete-resume" data-i="${i}">Delete</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.load-resume').forEach(btn => {
    btn.onclick = () => {
      const r = savedResumes[btn.dataset.i];
      if (!r) return;

      Object.keys(r).forEach(key => {
        if (elements[key]) elements[key].value = r[key];
      });

      updateCVPreview();
      document.querySelector('[data-page="resume"]').click();
    };
  });

  container.querySelectorAll('.delete-resume').forEach(btn => {
    btn.onclick = () => {
      if (!confirm('Delete this resume?')) return;
      savedResumes.splice(btn.dataset.i, 1);
      localStorage.setItem('9to5_resumes', JSON.stringify(savedResumes));
      loadProfilePage();
    };
  });
}

// ========================
// EVENTS
// ========================
Object.values(elements).forEach(el => {
  if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) {
    el.addEventListener('input', debounceUpdate);
  }
});

if (templateSelect) templateSelect.addEventListener('change', updateCVPreview);
if (downloadPdfBtn) downloadPdfBtn.addEventListener('click', downloadPDF);
if (saveResumeBtn) saveResumeBtn.addEventListener('click', saveResumeToLocal);

// ========================
// EXTRA
// ========================
const nominateBtn = document.getElementById('nominateBtn');
if (nominateBtn) {
  nominateBtn.onclick = () => {
    const msg = encodeURIComponent("I'd like to nominate someone for Hustler of the Month.");
    window.open(`https://wa.me/27794874559?text=${msg}`, '_blank');
  };
}

document.querySelector('[data-page="profile"]')?.addEventListener('click', loadProfilePage);

// Init
updateCVPreview();