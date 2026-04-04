// ==========================================
// SUPABASE INITIALIZATION
// ==========================================
const SUPABASE_URL = 'https://pfqpyzfqwsksepoohive.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcXB5emZxd3Nrc2Vwb29oaXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzM1MTMsImV4cCI6MjA4OTk0OTUxM30.NPbcOFUPS_2zYg-2MjH1ukHrHqN8AjXRDrP1OpU4nNs';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// PAGE NAVIGATION (for multi-page site)
// ==========================================
document.querySelectorAll('[data-page]').forEach(el => {
  el.addEventListener('click', (e) => {
    e.preventDefault();
    const pageId = el.getAttribute('data-page');
    if (!pageId) return;
    window.location.href = `${pageId}.html`;
  });
});

// ==========================================
// RESUME BUILDER DOM ELEMENTS
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

// Helper functions
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

// ==================== PROFESSIONAL RESUME TEMPLATE (A4 OPTIMIZED) ====================
function professionalTemplate(d) {
  return `
    <div class="resume-a4" style="font-family: 'Montserrat', sans-serif; padding: 0.5rem 1rem;">
      <!-- Header with name and title -->
      <div style="text-align: center; margin-bottom: 1rem;">
        <h1 style="font-size: 2rem; margin: 0; color: #014656;">${d.firstName} ${d.lastName}</h1>
        <p style="font-size: 1.2rem; color: #00a2ad; font-weight: 500; margin: 0.25rem 0;">${d.jobTitle}</p>
      </div>

      <!-- Contact Bar -->
      <div class="contact-info" style="display: flex; flex-wrap: wrap; justify-content: space-between; background: #f0f9fa; padding: 0.6rem; border-radius: 8px; margin-bottom: 1rem;">
        <span><i class="fas fa-phone-alt"></i> ${d.phone}</span>
        <span><i class="fas fa-envelope"></i> ${d.email}</span>
        <span><i class="fas fa-map-marker-alt"></i> ${d.address}</span>
      </div>

      <!-- Two column layout -->
      <div class="two-column" style="display: flex; gap: 1.5rem;">
        <!-- Left column: Summary, Experience, Education -->
        <div class="left-col" style="flex: 1.5;">
          <!-- Summary -->
          <h2 style="font-size: 1.2rem; border-bottom: 2px solid #00a2ad; padding-bottom: 0.25rem; margin: 0.5rem 0 0.5rem;">Professional Summary</h2>
          <p style="margin-bottom: 1rem;">${d.summary}</p>

          <!-- Experience -->
          <h2 style="font-size: 1.2rem; border-bottom: 2px solid #00a2ad; padding-bottom: 0.25rem; margin: 0.5rem 0 0.5rem;">Work Experience</h2>
          ${d.experience.map(exp => `
            <div style="margin-bottom: 0.75rem;">
              <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                <strong>${exp.position}</strong>
                <span style="color: #666;">${exp.start} – ${exp.end}</span>
              </div>
              <div><em>${exp.company}, ${exp.location}</em></div>
              <p style="margin-top: 0.25rem;">${exp.description}</p>
            </div>
          `).join('')}

          <!-- Education -->
          <h2 style="font-size: 1.2rem; border-bottom: 2px solid #00a2ad; padding-bottom: 0.25rem; margin: 0.5rem 0 0.5rem;">Education</h2>
          ${d.education.map(edu => `
            <div style="margin-bottom: 0.5rem;">
              <div><strong>${edu.degree}</strong> – ${edu.institution}</div>
              <div style="color: #666;">${edu.start} – ${edu.end}</div>
            </div>
          `).join('')}
        </div>

        <!-- Right column: Skills, Languages, Awards, References -->
        <div class="right-col" style="flex: 1;">
          <!-- Skills -->
          <h2 style="font-size: 1.2rem; border-bottom: 2px solid #00a2ad; padding-bottom: 0.25rem; margin: 0.5rem 0 0.5rem;">Skills</h2>
          <ul style="margin-bottom: 1rem;">
            ${d.skills.map(s => `<li>${s}</li>`).join('')}
          </ul>

          <!-- Languages -->
          <h2 style="font-size: 1.2rem; border-bottom: 2px solid #00a2ad; padding-bottom: 0.25rem; margin: 0.5rem 0 0.5rem;">Languages</h2>
          <ul style="margin-bottom: 1rem;">
            ${d.languages.map(l => `<li>${l}</li>`).join('')}
          </ul>

          <!-- Awards -->
          ${d.awards.length ? `
            <h2 style="font-size: 1.2rem; border-bottom: 2px solid #00a2ad; padding-bottom: 0.25rem; margin: 0.5rem 0 0.5rem;">Awards</h2>
            <ul style="margin-bottom: 1rem;">
              ${d.awards.map(aw => `<li><strong>${aw.title}</strong> (${aw.year}) – ${aw.description}</li>`).join('')}
            </ul>
          ` : ''}

          <!-- References -->
          ${d.references.length ? `
            <h2 style="font-size: 1.2rem; border-bottom: 2px solid #00a2ad; padding-bottom: 0.25rem; margin: 0.5rem 0 0.5rem;">References</h2>
            <ul style="margin-bottom: 1rem;">
              ${d.references.map(ref => `<li>${ref.name}, ${ref.company}<br>${ref.phone} | ${ref.email}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      </div>
    </div>
  `;
}

// Update CV preview
function updateCVPreview() {
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
  cvPreview.innerHTML = professionalTemplate(data);
}

// PDF download
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

// Save resume to Supabase
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
  if (templateSelect) templateSelect.addEventListener('change', updateCVPreview);
  if (downloadPdfBtn) downloadPdfBtn.addEventListener('click', downloadPDF);
  if (saveResumeBtn) saveResumeBtn.addEventListener('click', saveResumeToSupabase);
  updateCVPreview();
}

// ==========================================
// PROFILE PAGE FUNCTIONS (unchanged)
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
  document.getElementById('loginBtn')?.addEventListener('click', () => handleLogin());
  document.getElementById('signupBtn')?.addEventListener('click', () => handleSignup());
  document.getElementById('logoutBtn')?.addEventListener('click', () => handleLogout());
}

async function handleLogin() {
  const email = document.getElementById('authEmail')?.value;
  const password = document.getElementById('authPassword')?.value;
  if (!email || !password) return;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert('Login failed: ' + error.message);
  else {
    alert('Logged in successfully!');
    loadProfilePage();
  }
}

async function handleSignup() {
  const email = document.getElementById('authEmail')?.value;
  const password = document.getElementById('authPassword')?.value;
  if (!email || !password) return;
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

// Initialize profile page if on profile.html
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

console.log('9to5 University – fully loaded with professional resume builder!');