// ========================
// 1. PAGE NAVIGATION
// ========================
document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const pageId = el.getAttribute('data-page');
    if (!pageId) return;
    document.querySelectorAll('.page-section').forEach(section => {
      section.classList.remove('active-page');
    });
    const target = document.getElementById(`${pageId}-page`);
    if (target) target.classList.add('active-page');
    // Scroll to top for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
});

// ========================
// 2. RESUME BUILDER
// ========================
// DOM elements
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const jobTitle = document.getElementById('jobTitle');
const phone = document.getElementById('phone');
const email = document.getElementById('email');
const address = document.getElementById('address');
const summary = document.getElementById('summary');
const experience = document.getElementById('experience');
const education = document.getElementById('education');
const skills = document.getElementById('skills');
const languages = document.getElementById('languages');
const awards = document.getElementById('awards');
const references = document.getElementById('references');
const templateSelect = document.getElementById('templateSelect');
const cvPreview = document.getElementById('cvPreview');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
const saveResumeBtn = document.getElementById('saveResumeBtn');

// Helper: parse experience lines (format: Position|Company|Location|Start|End|Description)
function parseExperience(text) {
  return text.split('\n').filter(line => line.trim()).map(line => {
    const parts = line.split('|').map(p => p.trim());
    return {
      position: parts[0] || '',
      company: parts[1] || '',
      location: parts[2] || '',
      start: parts[3] || '',
      end: parts[4] || '',
      description: parts[5] || ''
    };
  });
}

// Helper: parse education lines (format: Institution|Degree|Start|End)
function parseEducation(text) {
  return text.split('\n').filter(line => line.trim()).map(line => {
    const parts = line.split('|').map(p => p.trim());
    return {
      institution: parts[0] || '',
      degree: parts[1] || '',
      start: parts[2] || '',
      end: parts[3] || ''
    };
  });
}

// Helper: parse awards lines (format: Title|Description|Year)
function parseAwards(text) {
  return text.split('\n').filter(line => line.trim()).map(line => {
    const parts = line.split('|').map(p => p.trim());
    return {
      title: parts[0] || '',
      description: parts[1] || '',
      year: parts[2] || ''
    };
  });
}

// Helper: parse references lines (format: Name|Company|Phone|Email)
function parseReferences(text) {
  return text.split('\n').filter(line => line.trim()).map(line => {
    const parts = line.split('|').map(p => p.trim());
    return {
      name: parts[0] || '',
      company: parts[1] || '',
      phone: parts[2] || '',
      email: parts[3] || ''
    };
  });
}

// Helper: get skills as array
function getSkillsArray() {
  return skills.value.split(',').map(s => s.trim()).filter(s => s);
}

// Helper: get languages as array
function getLanguagesArray() {
  return languages.value.split(',').map(l => l.trim()).filter(l => l);
}

// Main preview update function
function updateCVPreview() {
  const template = templateSelect.value;
  const data = {
    firstName: firstName.value,
    lastName: lastName.value,
    jobTitle: jobTitle.value,
    phone: phone.value,
    email: email.value,
    address: address.value,
    summary: summary.value,
    experience: parseExperience(experience.value),
    education: parseEducation(education.value),
    skills: getSkillsArray(),
    languages: getLanguagesArray(),
    awards: parseAwards(awards.value),
    references: parseReferences(references.value)
  };

  let html = '';

  switch (template) {
    case 'minimal':
      html = minimalTemplate(data);
      break;
    case 'sidebar':
      html = sidebarTemplate(data);
      break;
    case 'elegant':
      html = elegantTemplate(data);
      break;
    case 'centered':
      html = centeredTemplate(data);
      break;
    case 'modern':
      html = modernTemplate(data);
      break;
    case 'card':
      html = cardTemplate(data);
      break;
    case 'classic':
      html = classicTemplate(data);
      break;
    default:
      html = minimalTemplate(data);
  }

  cvPreview.innerHTML = html;
}

// Template definitions (HTML strings)
function minimalTemplate(d) {
  return `
    <div class="cv-minimal" style="font-family: 'Inter', sans-serif; max-width: 800px; margin: 0 auto;">
      <div class="header">
        <div><strong>${d.firstName} ${d.lastName}</strong><br>${d.jobTitle}</div>
        <div>${d.phone} | ${d.email}<br>${d.address}</div>
      </div>
      <div class="main">
        <div class="left">
          <h3>Summary</h3>
          <p>${d.summary}</p>
          <h3>Skills</h3>
          <ul>${d.skills.map(s => `<li>${s}</li>`).join('')}</ul>
          <h3>Languages</h3>
          <ul>${d.languages.map(l => `<li>${l}</li>`).join('')}</ul>
        </div>
        <div class="right">
          <h3>Experience</h3>
          ${d.experience.map(exp => `
            <div><strong>${exp.position}</strong> at ${exp.company} (${exp.start} - ${exp.end})<br>${exp.description}</div>
          `).join('')}
          <h3>Education</h3>
          ${d.education.map(edu => `
            <div><strong>${edu.degree}</strong> – ${edu.institution} (${edu.start} - ${edu.end})</div>
          `).join('')}
          <h3>Awards</h3>
          ${d.awards.map(aw => `
            <div><strong>${aw.title}</strong> (${aw.year})<br>${aw.description}</div>
          `).join('')}
        </div>
      </div>
      <hr>
      <h3>References</h3>
      ${d.references.map(ref => `
        <div>${ref.name}, ${ref.company} – ${ref.phone} / ${ref.email}</div>
      `).join('')}
    </div>
  `;
}

function sidebarTemplate(d) {
  return `
    <div class="cv-sidebar" style="display: flex; max-width: 800px; margin: 0 auto;">
      <div class="left" style="background: #2f3b4c; color: white; padding: 20px; border-radius: 16px 0 0 16px;">
        <h3>Contact</h3>
        <p>${d.phone}<br>${d.email}<br>${d.address}</p>
        <h3>Skills</h3>
        <ul>${d.skills.map(s => `<li>${s}</li>`).join('')}</ul>
        <h3>Languages</h3>
        <ul>${d.languages.map(l => `<li>${l}</li>`).join('')}</ul>
      </div>
      <div class="right" style="padding: 20px;">
        <h2>${d.firstName} ${d.lastName}</h2>
        <h4>${d.jobTitle}</h4>
        <h3>Summary</h3>
        <p>${d.summary}</p>
        <h3>Experience</h3>
        ${d.experience.map(exp => `
          <div><strong>${exp.position}</strong> at ${exp.company} (${exp.start} - ${exp.end})<br>${exp.description}</div>
        `).join('')}
        <h3>Education</h3>
        ${d.education.map(edu => `
          <div><strong>${edu.degree}</strong> – ${edu.institution} (${edu.start} - ${edu.end})</div>
        `).join('')}
        <h3>References</h3>
        ${d.references.map(ref => `
          <div>${ref.name}, ${ref.company} – ${ref.phone} / ${ref.email}</div>
        `).join('')}
      </div>
    </div>
  `;
}

function elegantTemplate(d) {
  return `
    <div class="cv-elegant" style="max-width: 800px; margin: 0 auto; display: flex; gap: 30px;">
      <div class="left" style="background: #fef5e8; padding: 20px; border-radius: 20px;">
        <h3>Contact</h3>
        <p>${d.phone}<br>${d.email}<br>${d.address}</p>
        <h3>Skills</h3>
        <ul>${d.skills.map(s => `<li>${s}</li>`).join('')}</ul>
        <h3>Languages</h3>
        <ul>${d.languages.map(l => `<li>${l}</li>`).join('')}</ul>
      </div>
      <div class="right">
        <h1>${d.firstName} ${d.lastName}</h1>
        <h3>${d.jobTitle}</h3>
        <h3>Profile</h3>
        <p>${d.summary}</p>
        <h3>Experience</h3>
        ${d.experience.map(exp => `
          <div><strong>${exp.position}</strong> at ${exp.company} (${exp.start} - ${exp.end})<br>${exp.description}</div>
        `).join('')}
        <h3>Education</h3>
        ${d.education.map(edu => `
          <div><strong>${edu.degree}</strong> – ${edu.institution} (${edu.start} - ${edu.end})</div>
        `).join('')}
      </div>
    </div>
  `;
}

function centeredTemplate(d) {
  return `
    <div class="cv-centered" style="text-align: center; max-width: 800px; margin: 0 auto;">
      <h1>${d.firstName} ${d.lastName}</h1>
      <h3>${d.jobTitle}</h3>
      <p>${d.phone} | ${d.email} | ${d.address}</p>
      <hr>
      <h3>Summary</h3>
      <p>${d.summary}</p>
      <h3>Experience</h3>
      ${d.experience.map(exp => `
        <div><strong>${exp.position}</strong> at ${exp.company} (${exp.start} - ${exp.end})<br>${exp.description}</div>
      `).join('')}
      <h3>Education</h3>
      ${d.education.map(edu => `
        <div><strong>${edu.degree}</strong> – ${edu.institution} (${edu.start} - ${edu.end})</div>
      `).join('')}
    </div>
  `;
}

function modernTemplate(d) {
  return `
    <div class="cv-modern" style="max-width: 800px; margin: 0 auto;">
      <div style="background: #014656; color: white; padding: 20px; border-radius: 20px 20px 0 0;">
        <h1>${d.firstName} ${d.lastName}</h1>
        <h3>${d.jobTitle}</h3>
      </div>
      <div class="columns" style="display: flex; gap: 30px; padding: 20px;">
        <div style="flex: 1;">
          <h3>Contact</h3>
          <p>${d.phone}<br>${d.email}<br>${d.address}</p>
          <h3>Skills</h3>
          <ul>${d.skills.map(s => `<li>${s}</li>`).join('')}</ul>
          <h3>Languages</h3>
          <ul>${d.languages.map(l => `<li>${l}</li>`).join('')}</ul>
        </div>
        <div style="flex: 2;">
          <h3>Summary</h3>
          <p>${d.summary}</p>
          <h3>Experience</h3>
          ${d.experience.map(exp => `
            <div><strong>${exp.position}</strong> at ${exp.company} (${exp.start} - ${exp.end})<br>${exp.description}</div>
          `).join('')}
          <h3>Education</h3>
          ${d.education.map(edu => `
            <div><strong>${edu.degree}</strong> – ${edu.institution} (${edu.start} - ${edu.end})</div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function cardTemplate(d) {
  return `
    <div class="cv-card" style="max-width: 800px; margin: 0 auto; border: 1px solid #ddd; border-radius: 24px; padding: 20px;">
      <div style="text-align: center;">
        <h1>${d.firstName} ${d.lastName}</h1>
        <h3>${d.jobTitle}</h3>
        <p>${d.phone} | ${d.email} | ${d.address}</p>
      </div>
      <div class="main" style="display: flex; gap: 30px; margin-top: 20px;">
        <div style="flex: 1;">
          <h3>Summary</h3>
          <p>${d.summary}</p>
          <h3>Skills</h3>
          <ul>${d.skills.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
        <div style="flex: 2;">
          <h3>Experience</h3>
          ${d.experience.map(exp => `
            <div><strong>${exp.position}</strong> at ${exp.company} (${exp.start} - ${exp.end})<br>${exp.description}</div>
          `).join('')}
          <h3>Education</h3>
          ${d.education.map(edu => `
            <div><strong>${edu.degree}</strong> – ${edu.institution} (${edu.start} - ${edu.end})</div>
          `).join('')}
        </div>
      </div>
    </div>
  `;
}

function classicTemplate(d) {
  return `
    <div class="cv-classic" style="max-width: 800px; margin: 0 auto; display: flex; gap: 30px;">
      <div class="left" style="background: #f4f4f4; padding: 20px; border-radius: 20px;">
        <h3>Contact</h3>
        <p>${d.phone}<br>${d.email}<br>${d.address}</p>
        <h3>Skills</h3>
        <ul>${d.skills.map(s => `<li>${s}</li>`).join('')}</ul>
        <h3>Languages</h3>
        <ul>${d.languages.map(l => `<li>${l}</li>`).join('')}</ul>
      </div>
      <div class="right">
        <h1>${d.firstName} ${d.lastName}</h1>
        <h3>${d.jobTitle}</h3>
        <h3>Summary</h3>
        <p>${d.summary}</p>
        <h3>Experience</h3>
        ${d.experience.map(exp => `
          <div><strong>${exp.position}</strong> at ${exp.company} (${exp.start} - ${exp.end})<br>${exp.description}</div>
        `).join('')}
        <h3>Education</h3>
        ${d.education.map(edu => `
          <div><strong>${edu.degree}</strong> – ${edu.institution} (${edu.start} - ${edu.end})</div>
        `).join('')}
      </div>
    </div>
  `;
}

// PDF download using html2canvas and jspdf
async function downloadPDF() {
  const element = cvPreview;
  if (!element) return;
  try {
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgWidth = 210; // A4 width in mm
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
    console.error('PDF error:', err);
    alert('Failed to generate PDF. Please try again.');
  }
}

// Save current resume data to localStorage (and also to "profile" saved list)
function saveResumeToLocal() {
  const resumeData = {
    firstName: firstName.value,
    lastName: lastName.value,
    jobTitle: jobTitle.value,
    phone: phone.value,
    email: email.value,
    address: address.value,
    summary: summary.value,
    experience: experience.value,
    education: education.value,
    skills: skills.value,
    languages: languages.value,
    awards: awards.value,
    references: references.value,
    template: templateSelect.value,
    savedAt: new Date().toISOString()
  };
  let savedResumes = JSON.parse(localStorage.getItem('9to5_resumes') || '[]');
  savedResumes.push(resumeData);
  localStorage.setItem('9to5_resumes', JSON.stringify(savedResumes));
  alert('Resume saved to your profile!');
  loadProfilePage(); // Refresh profile display if visible
}

// Load profile page: display saved resumes and allow load/delete
function loadProfilePage() {
  const profileContainer = document.getElementById('profileContainer');
  if (!profileContainer) return;
  const savedResumes = JSON.parse(localStorage.getItem('9to5_resumes') || '[]');
  if (savedResumes.length === 0) {
    profileContainer.innerHTML = '<p>No saved resumes yet. Create and save one from the Resume Builder.</p>';
    return;
  }
  let html = '<h2>Your Saved Resumes</h2>';
  savedResumes.forEach((resume, idx) => {
    html += `
      <div class="saved-resume-item">
        <div>
          <strong>${resume.firstName} ${resume.lastName}</strong> – ${resume.jobTitle}<br>
          <small>Saved: ${new Date(resume.savedAt).toLocaleString()}</small>
        </div>
        <div>
          <button class="btn-outline load-resume" data-index="${idx}" style="margin-right: 0.5rem;">Load</button>
          <button class="btn-outline delete-resume" data-index="${idx}" style="background: #dc3545; color: white;">Delete</button>
        </div>
      </div>
    `;
  });
  profileContainer.innerHTML = html;

  // Attach load events
  document.querySelectorAll('.load-resume').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      const resume = savedResumes[idx];
      if (resume) {
        firstName.value = resume.firstName;
        lastName.value = resume.lastName;
        jobTitle.value = resume.jobTitle;
        phone.value = resume.phone;
        email.value = resume.email;
        address.value = resume.address;
        summary.value = resume.summary;
        experience.value = resume.experience;
        education.value = resume.education;
        skills.value = resume.skills;
        languages.value = resume.languages;
        awards.value = resume.awards;
        references.value = resume.references;
        templateSelect.value = resume.template;
        updateCVPreview();
        // Switch to resume page
        document.querySelector('[data-page="resume"]').click();
      }
    });
  });

  document.querySelectorAll('.delete-resume').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.getAttribute('data-index'));
      savedResumes.splice(idx, 1);
      localStorage.setItem('9to5_resumes', JSON.stringify(savedResumes));
      loadProfilePage();
    });
  });
}

// Attach event listeners for resume builder
firstName.addEventListener('input', updateCVPreview);
lastName.addEventListener('input', updateCVPreview);
jobTitle.addEventListener('input', updateCVPreview);
phone.addEventListener('input', updateCVPreview);
email.addEventListener('input', updateCVPreview);
address.addEventListener('input', updateCVPreview);
summary.addEventListener('input', updateCVPreview);
experience.addEventListener('input', updateCVPreview);
education.addEventListener('input', updateCVPreview);
skills.addEventListener('input', updateCVPreview);
languages.addEventListener('input', updateCVPreview);
awards.addEventListener('input', updateCVPreview);
references.addEventListener('input', updateCVPreview);
templateSelect.addEventListener('change', updateCVPreview);
downloadPdfBtn.addEventListener('click', downloadPDF);
saveResumeBtn.addEventListener('click', saveResumeToLocal);

// Initial preview
updateCVPreview();

// ========================
// 3. HUSTLER NOMINATION (WhatsApp)
// ========================
const nominateBtn = document.getElementById('nominateBtn');
if (nominateBtn) {
  nominateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const message = encodeURIComponent("I'd like to nominate someone for Hustler of the Month.");
    window.open(`https://wa.me/27794874559?text=${message}`, '_blank');
  });
}

// ========================
// 4. PROFILE PAGE LOAD (when shown)
// ========================
// Whenever profile page becomes active, refresh display
const profileNavLink = document.querySelector('[data-page="profile"]');
if (profileNavLink) {
  profileNavLink.addEventListener('click', () => {
    loadProfilePage();
  });
}
// Also load on initial if profile page is already active (unlikely, but safe)
if (document.getElementById('profile-page').classList.contains('active-page')) {
  loadProfilePage();
}

// ========================
// 5. (Optional) Supabase fallback – not configured, but you can add your keys
// ========================
// If you have Supabase keys, you can extend this to sync with cloud.
// For now, localStorage handles saving.

console.log('All functionality loaded!');