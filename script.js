// ==========================================
// SUPABASE INITIALIZATION
// ==========================================
const SUPABASE_URL = 'https://pfqpyzfqwsksepoohive.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcXB5emZxd3Nrc2Vwb29oaXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzM1MTMsImV4cCI6MjA4OTk0OTUxM30.NPbcOFUPS_2zYg-2MjH1ukHrHqN8AjXRDrP1OpU4nNs';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// PAGE NAVIGATION (for multi-page site)
// ==========================================
// Not needed because we use separate HTML files; but we keep for any in-page links
document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const pageId = el.getAttribute('data-page');
    if (!pageId) return;
    window.location.href = `${pageId}.html`;
  });
});

// ==========================================
// RESUME BUILDER (only if on resume.html)
// ==========================================
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const jobTitle = document.getElementById('jobTitle');
const phone = document.getElementById('phone');
const emailField = document.getElementById('email');
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

function getSkillsArray() {
  return skills.value.split(',').map(s => s.trim()).filter(s => s);
}

function getLanguagesArray() {
  return languages.value.split(',').map(l => l.trim()).filter(l => l);
}

// ==================== PROFESSIONAL RESUME TEMPLATES ====================
function minimalTemplate(d) {
  return `
    <div style="font-family: 'Inter', sans-serif; max-width: 800px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 0 20px rgba(0,0,0,0.05);">
      <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 1rem; border-bottom: 2px solid #00a2ad; padding-bottom: 1rem; margin-bottom: 1.5rem;">
        <div>
          <h1 style="font-size: 2rem; margin: 0; color: #014656;">${d.firstName} ${d.lastName}</h1>
          <p style="font-size: 1.2rem; color: #00a2ad; margin: 0.25rem 0 0;">${d.jobTitle}</p>
        </div>
        <div style="text-align: right;">
          <p style="margin: 0;">${d.phone}</p>
          <p style="margin: 0;">${d.email}</p>
          <p style="margin: 0;">${d.address}</p>
        </div>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 2rem;">
        <div style="flex: 1.5;">
          <h3 style="color: #014656; border-left: 4px solid #00a2ad; padding-left: 0.75rem; margin: 1rem 0 0.5rem;">Summary</h3>
          <p>${d.summary}</p>
          <h3 style="color: #014656; border-left: 4px solid #00a2ad; padding-left: 0.75rem; margin: 1rem 0 0.5rem;">Experience</h3>
          ${d.experience.map(exp => `
            <div style="margin-bottom: 1rem;">
              <strong>${exp.position}</strong> at ${exp.company} (${exp.start} – ${exp.end})<br>
              <span style="color: #666;">${exp.description}</span>
            </div>
          `).join('')}
          <h3 style="color: #014656; border-left: 4px solid #00a2ad; padding-left: 0.75rem; margin: 1rem 0 0.5rem;">Education</h3>
          ${d.education.map(edu => `
            <div><strong>${edu.degree}</strong>, ${edu.institution} (${edu.start} – ${edu.end})</div>
          `).join('')}
        </div>
        <div style="flex: 1;">
          <h3 style="color: #014656; border-left: 4px solid #00a2ad; padding-left: 0.75rem; margin: 1rem 0 0.5rem;">Skills</h3>
          <ul style="list-style: none; padding-left: 0;">${d.skills.map(s => `<li style="margin-bottom: 0.5rem;">✓ ${s}</li>`).join('')}</ul>
          <h3 style="color: #014656; border-left: 4px solid #00a2ad; padding-left: 0.75rem; margin: 1rem 0 0.5rem;">Languages</h3>
          <ul style="list-style: none; padding-left: 0;">${d.languages.map(l => `<li>• ${l}</li>`).join('')}</ul>
          <h3 style="color: #014656; border-left: 4px solid #00a2ad; padding-left: 0.75rem; margin: 1rem 0 0.5rem;">Awards</h3>
          ${d.awards.map(aw => `<div><strong>${aw.title}</strong> (${aw.year}) – ${aw.description}</div>`).join('')}
        </div>
      </div>
      <hr style="margin: 1.5rem 0 1rem;">
      <h3 style="color: #014656;">References</h3>
      ${d.references.map(ref => `<div>${ref.name}, ${ref.company} – ${ref.phone} / ${ref.email}</div>`).join('')}
    </div>
  `;
}

function sidebarTemplate(d) {
  return `
    <div style="display: flex; flex-wrap: wrap; max-width: 800px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.05);">
      <div style="background: #014656; color: white; width: 33%; padding: 2rem 1.5rem;">
        <h3 style="color: #f6a801; margin-bottom: 1rem;">Contact</h3>
        <p>${d.phone}<br>${d.email}<br>${d.address}</p>
        <h3 style="color: #f6a801; margin-top: 2rem; margin-bottom: 1rem;">Skills</h3>
        <ul style="list-style: none; padding-left: 0;">${d.skills.map(s => `<li>• ${s}</li>`).join('')}</ul>
        <h3 style="color: #f6a801; margin-top: 2rem; margin-bottom: 1rem;">Languages</h3>
        <ul style="list-style: none; padding-left: 0;">${d.languages.map(l => `<li>• ${l}</li>`).join('')}</ul>
      </div>
      <div style="width: 67%; padding: 2rem;">
        <h1 style="font-size: 2rem; margin: 0 0 0.25rem; color: #014656;">${d.firstName} ${d.lastName}</h1>
        <p style="color: #00a2ad; font-weight: 600; margin-bottom: 1.5rem;">${d.jobTitle}</p>
        <h3 style="color: #014656;">Profile</h3>
        <p>${d.summary}</p>
        <h3 style="color: #014656; margin-top: 1.5rem;">Experience</h3>
        ${d.experience.map(exp => `
          <div style="margin-bottom: 1rem;">
            <strong>${exp.position}</strong> at ${exp.company} (${exp.start} – ${exp.end})<br>
            <span>${exp.description}</span>
          </div>
        `).join('')}
        <h3 style="color: #014656; margin-top: 1.5rem;">Education</h3>
        ${d.education.map(edu => `<div><strong>${edu.degree}</strong>, ${edu.institution} (${edu.start} – ${edu.end})</div>`).join('')}
      </div>
    </div>
  `;
}

function elegantTemplate(d) {
  return `
    <div style="max-width: 800px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 0 20px rgba(0,0,0,0.05);">
      <div style="background: #fef5e8; padding: 2rem; text-align: center;">
        <h1 style="margin: 0; color: #014656;">${d.firstName} ${d.lastName}</h1>
        <p style="color: #00a2ad; font-size: 1.2rem; margin: 0.5rem 0 0;">${d.jobTitle}</p>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 2rem; padding: 2rem;">
        <div style="flex: 1;">
          <h3 style="color: #014656;">Contact</h3>
          <p>${d.phone}<br>${d.email}<br>${d.address}</p>
          <h3 style="color: #014656; margin-top: 1.5rem;">Skills</h3>
          <ul>${d.skills.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
        <div style="flex: 2;">
          <h3 style="color: #014656;">Profile</h3>
          <p>${d.summary}</p>
          <h3 style="color: #014656; margin-top: 1.5rem;">Experience</h3>
          ${d.experience.map(exp => `
            <div style="margin-bottom: 1rem;">
              <strong>${exp.position}</strong> at ${exp.company} (${exp.start} – ${exp.end})<br>
              ${exp.description}
            </div>
          `).join('')}
          <h3 style="color: #014656; margin-top: 1.5rem;">Education</h3>
          ${d.education.map(edu => `<div><strong>${edu.degree}</strong>, ${edu.institution} (${edu.start} – ${edu.end})</div>`).join('')}
        </div>
      </div>
    </div>
  `;
}

function centeredTemplate(d) {
  return `
    <div style="max-width: 800px; margin: 0 auto; background: white; padding: 2rem; text-align: center; border-radius: 8px; box-shadow: 0 0 20px rgba(0,0,0,0.05);">
      <h1 style="color: #014656; margin-bottom: 0.25rem;">${d.firstName} ${d.lastName}</h1>
      <p style="color: #00a2ad; font-size: 1.2rem;">${d.jobTitle}</p>
      <p style="margin: 1rem 0;">${d.phone} | ${d.email} | ${d.address}</p>
      <hr style="margin: 1rem 0;">
      <h3 style="color: #014656;">Summary</h3>
      <p>${d.summary}</p>
      <h3 style="color: #014656;">Experience</h3>
      ${d.experience.map(exp => `
        <div><strong>${exp.position}</strong> at ${exp.company} (${exp.start} – ${exp.end})<br>${exp.description}</div>
      `).join('')}
      <h3 style="color: #014656;">Education</h3>
      ${d.education.map(edu => `<div><strong>${edu.degree}</strong>, ${edu.institution} (${edu.start} – ${edu.end})</div>`).join('')}
    </div>
  `;
}

function modernTemplate(d) {
  return `
    <div style="max-width: 800px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 0 20px rgba(0,0,0,0.05);">
      <div style="background: #014656; color: white; padding: 2rem; border-radius: 8px 8px 0 0;">
        <h1 style="margin: 0;">${d.firstName} ${d.lastName}</h1>
        <p style="margin: 0.5rem 0 0; opacity: 0.9;">${d.jobTitle}</p>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 2rem; padding: 2rem;">
        <div style="flex: 1;">
          <h3 style="color: #014656;">Contact</h3>
          <p>${d.phone}<br>${d.email}<br>${d.address}</p>
          <h3 style="color: #014656; margin-top: 1.5rem;">Skills</h3>
          <ul>${d.skills.map(s => `<li>${s}</li>`).join('')}</ul>
          <h3 style="color: #014656; margin-top: 1.5rem;">Languages</h3>
          <ul>${d.languages.map(l => `<li>${l}</li>`).join('')}</ul>
        </div>
        <div style="flex: 2;">
          <h3 style="color: #014656;">Summary</h3>
          <p>${d.summary}</p>
          <h3 style="color: #014656; margin-top: 1.5rem;">Experience</h3>
          ${d.experience.map(exp => `
            <div style="margin-bottom: 1rem;">
              <strong>${exp.position}</strong> at ${exp.company} (${exp.start} – ${exp.end})<br>
              ${exp.description}
            </div>
          `).join('')}
          <h3 style="color: #014656; margin-top: 1.5rem;">Education</h3>
          ${d.education.map(edu => `<div><strong>${edu.degree}</strong>, ${edu.institution} (${edu.start} – ${edu.end})</div>`).join('')}
        </div>
      </div>
    </div>
  `;
}

function cardTemplate(d) {
  return `
    <div style="max-width: 800px; margin: 0 auto; background: white; border-radius: 16px; padding: 2rem; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <div style="text-align: center;">
        <h1 style="color: #014656;">${d.firstName} ${d.lastName}</h1>
        <p style="color: #00a2ad; font-size: 1.1rem;">${d.jobTitle}</p>
        <p style="margin: 1rem 0;">${d.phone} | ${d.email} | ${d.address}</p>
      </div>
      <div style="display: flex; flex-wrap: wrap; gap: 2rem; margin-top: 1.5rem;">
        <div style="flex: 1;">
          <h3 style="color: #014656;">Summary</h3>
          <p>${d.summary}</p>
          <h3 style="color: #014656; margin-top: 1rem;">Skills</h3>
          <ul>${d.skills.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
        <div style="flex: 2;">
          <h3 style="color: #014656;">Experience</h3>
          ${d.experience.map(exp => `
            <div style="margin-bottom: 1rem;">
              <strong>${exp.position}</strong> at ${exp.company} (${exp.start} – ${exp.end})<br>
              ${exp.description}
            </div>
          `).join('')}
          <h3 style="color: #014656; margin-top: 1rem;">Education</h3>
          ${d.education.map(edu => `<div><strong>${edu.degree}</strong>, ${edu.institution} (${edu.start} – ${edu.end})</div>`).join('')}
        </div>
      </div>
    </div>
  `;
}

function classicTemplate(d) {
  return `
    <div style="max-width: 800px; margin: 0 auto; background: white; display: flex; flex-wrap: wrap; border-radius: 8px; box-shadow: 0 0 20px rgba(0,0,0,0.05);">
      <div style="width: 35%; background: #f4f4f4; padding: 2rem; border-radius: 8px 0 0 8px;">
        <h3 style="color: #014656;">Contact</h3>
        <p>${d.phone}<br>${d.email}<br>${d.address}</p>
        <h3 style="color: #014656; margin-top: 1.5rem;">Skills</h3>
        <ul style="list-style: none; padding-left: 0;">${d.skills.map(s => `<li>• ${s}</li>`).join('')}</ul>
        <h3 style="color: #014656; margin-top: 1.5rem;">Languages</h3>
        <ul style="list-style: none; padding-left: 0;">${d.languages.map(l => `<li>• ${l}</li>`).join('')}</ul>
      </div>
      <div style="width: 65%; padding: 2rem;">
        <h1 style="font-size: 2rem; margin: 0 0 0.25rem; color: #014656;">${d.firstName} ${d.lastName}</h1>
        <p style="color: #00a2ad; font-weight: 600; margin-bottom: 1.5rem;">${d.jobTitle}</p>
        <h3 style="color: #014656;">Summary</h3>
        <p>${d.summary}</p>
        <h3 style="color: #014656; margin-top: 1.5rem;">Experience</h3>
        ${d.experience.map(exp => `
          <div style="margin-bottom: 1rem;">
            <strong>${exp.position}</strong> at ${exp.company} (${exp.start} – ${exp.end})<br>
            ${exp.description}
          </div>
        `).join('')}
        <h3 style="color: #014656; margin-top: 1.5rem;">Education</h3>
        ${d.education.map(edu => `<div><strong>${edu.degree}</strong>, ${edu.institution} (${edu.start} – ${edu.end})</div>`).join('')}
      </div>
    </div>
  `;
}

function updateCVPreview() {
  const template = templateSelect.value;
  const data = {
    firstName: firstName.value,
    lastName: lastName.value,
    jobTitle: jobTitle.value,
    phone: phone.value,
    email: emailField.value,
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
    case 'minimal': html = minimalTemplate(data); break;
    case 'sidebar': html = sidebarTemplate(data); break;
    case 'elegant': html = elegantTemplate(data); break;
    case 'centered': html = centeredTemplate(data); break;
    case 'modern': html = modernTemplate(data); break;
    case 'card': html = cardTemplate(data); break;
    case 'classic': html = classicTemplate(data); break;
    default: html = minimalTemplate(data);
  }
  cvPreview.innerHTML = html;
}

async function downloadPDF() {
  const element = cvPreview;
  if (!element) return;
  try {
    const canvas = await html2canvas(element, { scale: 2, backgroundColor: '#ffffff' });
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
    console.error('PDF error:', err);
    alert('Failed to generate PDF. Please try again.');
  }
}

async function saveResumeToSupabase() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    alert('You must be logged in to save resumes. Please sign in on the Profile page.');
    return;
  }

  const resumeData = {
    user_id: user.id,
    first_name: firstName.value,
    last_name: lastName.value,
    job_title: jobTitle.value,
    phone: phone.value,
    email: emailField.value,
    address: address.value,
    summary: summary.value,
    experience: experience.value,
    education: education.value,
    skills: skills.value,
    languages: languages.value,
    awards: awards.value,
    references: references.value,
    template: templateSelect.value,
    created_at: new Date().toISOString()
  };

  const { error } = await supabase
    .from('resumes')
    .insert([resumeData]);

  if (error) {
    console.error('Supabase insert error:', error);
    alert('Failed to save resume. ' + error.message);
  } else {
    alert('Resume saved to your cloud profile!');
  }
}

// Attach resume builder events if elements exist
if (firstName) {
  const inputs = [firstName, lastName, jobTitle, phone, emailField, address, summary, experience, education, skills, languages, awards, references];
  inputs.forEach(input => input.addEventListener('input', updateCVPreview));
  templateSelect.addEventListener('change', updateCVPreview);
  downloadPdfBtn.addEventListener('click', downloadPDF);
  saveResumeBtn.addEventListener('click', saveResumeToSupabase);
  updateCVPreview();
}

// ==========================================
// PROFILE PAGE
// ==========================================
async function renderAuthForm() {
  const profileContainer = document.getElementById('profileContainer');
  if (!profileContainer) return;
  profileContainer.innerHTML = `
    <div class="auth-form">
      <h2>Sign In / Sign Up</h2>
      <input type="email" id="authEmail" placeholder="Email" required>
      <input type="password" id="authPassword" placeholder="Password" required>
      <button id="loginBtn" class="btn-primary">Sign In</button>
      <button id="signupBtn" class="btn-outline">Sign Up</button>
      <button id="logoutBtn" class="btn-outline" style="margin-top:1rem; background:#dc3545; color:white;">Sign Out</button>
    </div>
  `;
  document.getElementById('loginBtn').addEventListener('click', () => handleLogin());
  document.getElementById('signupBtn').addEventListener('click', () => handleSignup());
  document.getElementById('logoutBtn').addEventListener('click', () => handleLogout());
}

async function handleLogin() {
  const email = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert('Login failed: ' + error.message);
  else {
    alert('Logged in successfully!');
    loadProfilePage();
  }
}

async function handleSignup() {
  const email = document.getElementById('authEmail').value;
  const password = document.getElementById('authPassword').value;
  const { error } = await supabase.auth.signUp({ email, password });
  if (error) alert('Signup failed: ' + error.message);
  else alert('Account created! You can now sign in.');
}

async function handleLogout() {
  await supabase.auth.signOut();
  alert('Signed out');
  loadProfilePage();
}

async function loadProfilePage() {
  const profileContainer = document.getElementById('profileContainer');
  if (!profileContainer) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    renderAuthForm();
    return;
  }

  const { data: resumes, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching resumes:', error);
    profileContainer.innerHTML = '<p>Error loading resumes. Please try again later.</p>';
    return;
  }

  if (!resumes || resumes.length === 0) {
    profileContainer.innerHTML = `
      <h2>Your Saved Resumes</h2>
      <p>No saved resumes yet. Create and save one from the Resume Builder.</p>
      <button id="logoutBtnProfile" class="btn-outline" style="margin-top:1rem; background:#dc3545; color:white;">Sign Out</button>
    `;
    document.getElementById('logoutBtnProfile')?.addEventListener('click', () => handleLogout());
    return;
  }

  let html = '<h2>Your Saved Resumes</h2>';
  resumes.forEach((resume) => {
    html += `
      <div class="saved-resume-item">
        <div>
          <strong>${resume.first_name} ${resume.last_name}</strong> – ${resume.job_title}<br>
          <small>Saved: ${new Date(resume.created_at).toLocaleString()}</small>
        </div>
        <div>
          <button class="btn-outline load-resume" data-id="${resume.id}" style="margin-right: 0.5rem;">Load</button>
          <button class="btn-outline delete-resume" data-id="${resume.id}" style="background: #dc3545; color: white;">Delete</button>
        </div>
      </div>
    `;
  });
  html += `<button id="logoutBtnProfile" class="btn-outline" style="margin-top:1rem; background:#dc3545; color:white;">Sign Out</button>`;
  profileContainer.innerHTML = html;

  document.querySelectorAll('.load-resume').forEach(btn => {
    btn.addEventListener('click', async () => {
      const resumeId = btn.getAttribute('data-id');
      const resume = resumes.find(r => r.id === resumeId);
      if (resume) {
        firstName.value = resume.first_name;
        lastName.value = resume.last_name;
        jobTitle.value = resume.job_title;
        phone.value = resume.phone;
        emailField.value = resume.email;
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
        window.location.href = 'resume.html';
      }
    });
  });

  document.querySelectorAll('.delete-resume').forEach(btn => {
    btn.addEventListener('click', async () => {
      const resumeId = btn.getAttribute('data-id');
      if (confirm('Delete this resume permanently?')) {
        const { error } = await supabase.from('resumes').delete().eq('id', resumeId);
        if (error) alert('Delete failed: ' + error.message);
        else loadProfilePage();
      }
    });
  });

  document.getElementById('logoutBtnProfile')?.addEventListener('click', () => handleLogout());
}

if (document.getElementById('profileContainer')) {
  loadProfilePage();
}

// ==========================================
// HUSTLER NOMINATION
// ==========================================
const nominateBtn = document.getElementById('nominateBtn');
if (nominateBtn) {
  nominateBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const message = encodeURIComponent("I'd like to nominate someone for Hustler of the Month.");
    window.open(`https://wa.me/27794874559?text=${message}`, '_blank');
  });
}

console.log('9to5 University – fully loaded!');