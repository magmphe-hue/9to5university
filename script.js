// ==========================================
// SUPABASE INITIALIZATION
// ==========================================
const SUPABASE_URL = 'https://pfqpyzfqwsksepoohive.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcXB5emZxd3Nrc2Vwb29oaXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzM1MTMsImV4cCI6MjA4OTk0OTUxM30.NPbcOFUPS_2zYg-2MjH1ukHrHqN8AjXRDrP1OpU4nNs';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// DARK MODE TOGGLE
// ==========================================
const darkToggle = document.getElementById('darkModeToggle');
if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  });
  if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark-mode');
}

// ==========================================
// BACK TO TOP BUTTON
// ==========================================
const backBtn = document.getElementById('backToTop');
if (backBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) backBtn.classList.add('show');
    else backBtn.classList.remove('show');
  });
  backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ==========================================
// RIBBON CLICK – WhatsApp Chat with Admin
// ==========================================
const ribbon = document.querySelector('.ribbon');
if (ribbon) {
  ribbon.addEventListener('click', () => {
    window.open('https://wa.me/27794874559?text=Hello%2C%20I%20want%20to%20advertise%20on%209to5%20University', '_blank');
  });
}

// ==========================================
// ANIMATED STATS (HOME PAGE)
// ==========================================
function animateStats() {
  document.querySelectorAll('.stat-number[data-target]').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    let current = 0;
    const increment = target / 30;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.innerText = target;
        clearInterval(timer);
      } else {
        el.innerText = Math.floor(current);
      }
    }, 30);
  });
}
if (document.querySelector('.stat-number')) animateStats();

// ==========================================
// RESUME BUILDER – FIXED PREVIEW & DOWNLOAD
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
const cvPreview = document.getElementById('cvPreview');
const downloadBtn = document.getElementById('downloadPdfBtn');
const saveBtn = document.getElementById('saveResumeBtn');

// Helper parsers
function parseExperience(t) {
  return t.split('\n').filter(l => l.trim()).map(l => {
    const p = l.split('|').map(v => v.trim());
    return { position: p[0] || '', company: p[1] || '', location: p[2] || '', start: p[3] || '', end: p[4] || '', description: p[5] || '' };
  });
}
function parseEducation(t) {
  return t.split('\n').filter(l => l.trim()).map(l => {
    const p = l.split('|').map(v => v.trim());
    return { institution: p[0] || '', degree: p[1] || '', start: p[2] || '', end: p[3] || '' };
  });
}
function parseAwards(t) {
  return t.split('\n').filter(l => l.trim()).map(l => {
    const p = l.split('|').map(v => v.trim());
    return { title: p[0] || '', description: p[1] || '', year: p[2] || '' };
  });
}
function parseReferences(t) {
  return t.split('\n').filter(l => l.trim()).map(l => {
    const p = l.split('|').map(v => v.trim());
    return { name: p[0] || '', company: p[1] || '', phone: p[2] || '', email: p[3] || '' };
  });
}
function getSkillsArray() { return skills.value.split(',').map(s => s.trim()).filter(s => s); }
function getLanguagesArray() { return languages.value.split(',').map(l => l.trim()).filter(l => l); }

// Professional Resume Template
function professionalTemplate(d) {
  return `
    <div class="resume-a4" style="font-family:'Chivo',sans-serif;padding:1rem;background:white;width:210mm;margin:0 auto;">
      <div style="text-align:center;margin-bottom:1rem;">
        <h1 style="font-family:'Rubik Mono One',monospace;font-size:1.8rem;color:#014656;">${d.firstName} ${d.lastName}</h1>
        <p style="font-size:1rem;color:#00a2ad;">${d.jobTitle}</p>
      </div>
      <div style="display:flex;flex-wrap:wrap;justify-content:space-between;background:#f0f9fa;padding:0.6rem;border-radius:8px;margin-bottom:1rem;">
        <span><i class="fas fa-phone"></i> ${d.phone}</span>
        <span><i class="fas fa-envelope"></i> ${d.email}</span>
        <span><i class="fas fa-map-marker-alt"></i> ${d.address}</span>
      </div>
      <div style="display:flex;gap:1.5rem;flex-wrap:wrap;">
        <div style="flex:1.5;">
          <h2 style="font-family:'Rubik Mono One',monospace;font-size:1.2rem;border-bottom:2px solid #00a2ad;">Professional Summary</h2>
          <p>${d.summary}</p>
          <h2 style="font-family:'Rubik Mono One',monospace;font-size:1.2rem;border-bottom:2px solid #00a2ad;">Work Experience</h2>
          ${d.experience.map(exp => `
            <div style="margin-bottom:0.75rem;">
              <strong>${exp.position}</strong> at ${exp.company} (${exp.start}–${exp.end})<br>
              <em>${exp.location}</em><br>${exp.description}
            </div>
          `).join('')}
          <h2 style="font-family:'Rubik Mono One',monospace;font-size:1.2rem;border-bottom:2px solid #00a2ad;">Education</h2>
          ${d.education.map(edu => `<div><strong>${edu.degree}</strong> – ${edu.institution} (${edu.start}–${edu.end})</div>`).join('')}
        </div>
        <div style="flex:1;">
          <h2 style="font-family:'Rubik Mono One',monospace;font-size:1.2rem;border-bottom:2px solid #00a2ad;">Skills</h2>
          <ul>${d.skills.map(s => `<li>${s}</li>`).join('')}</ul>
          <h2 style="font-family:'Rubik Mono One',monospace;font-size:1.2rem;border-bottom:2px solid #00a2ad;">Languages</h2>
          <ul>${d.languages.map(l => `<li>${l}</li>`).join('')}</ul>
          ${d.awards.length ? `<h2 style="font-family:'Rubik Mono One',monospace;font-size:1.2rem;border-bottom:2px solid #00a2ad;">Awards</h2><ul>${d.awards.map(aw => `<li><strong>${aw.title}</strong> (${aw.year}) – ${aw.description}</li>`).join('')}</ul>` : ''}
          ${d.references.length ? `<h2 style="font-family:'Rubik Mono One',monospace;font-size:1.2rem;border-bottom:2px solid #00a2ad;">References</h2><ul>${d.references.map(ref => `<li>${ref.name}, ${ref.company}<br>${ref.phone} | ${ref.email}</li>`).join('')}</ul>` : ''}
        </div>
      </div>
    </div>
  `;
}

function updatePreview() {
  if (!cvPreview) return;
  const data = {
    firstName: firstName?.value || '',
    lastName: lastName?.value || '',
    jobTitle: jobTitle?.value || '',
    phone: phone?.value || '',
    email: emailField?.value || '',
    address: address?.value || '',
    summary: summary?.value || '',
    experience: parseExperience(experience?.value || ''),
    education: parseEducation(education?.value || ''),
    skills: getSkillsArray(),
    languages: getLanguagesArray(),
    awards: parseAwards(awards?.value || ''),
    references: parseReferences(references?.value || '')
  };
  cvPreview.innerHTML = professionalTemplate(data);
}

async function downloadPDF() {
  if (!cvPreview) return alert('Preview not ready');
  try {
    const element = cvPreview;
    // Force a short delay to ensure all fonts/styles are applied
    await new Promise(resolve => setTimeout(resolve, 100));
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: false
    });
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
    alert('PDF generation failed. Please try again.');
  }
}

async function saveResume() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert('Please sign in on the Profile page first.');
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
    created_at: new Date().toISOString()
  };
  const { error } = await supabase.from('resumes').insert([resumeData]);
  if (error) alert('Save failed: ' + error.message);
  else alert('Resume saved to your profile!');
}

if (firstName) {
  const inputs = [firstName, lastName, jobTitle, phone, emailField, address, summary, experience, education, skills, languages, awards, references];
  inputs.forEach(inp => inp?.addEventListener('input', updatePreview));
  if (downloadBtn) downloadBtn.addEventListener('click', downloadPDF);
  if (saveBtn) saveBtn.addEventListener('click', saveResume);
  updatePreview();
}

// ==========================================
// PROFILE PAGE (AUTH & SAVED RESUMES)
// ==========================================
async function loadProfilePage() {
  const container = document.getElementById('profileContainer');
  if (!container) return;
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    container.innerHTML = `<div class="auth-form"><h2>Sign In / Sign Up</h2><input type="email" id="authEmail" placeholder="Email" required><input type="password" id="authPassword" placeholder="Password" required><button id="loginBtn" class="btn-primary">Sign In</button><button id="signupBtn" class="btn-outline">Sign Up</button></div>`;
    document.getElementById('loginBtn')?.addEventListener('click', async () => {
      const email = document.getElementById('authEmail').value, pwd = document.getElementById('authPassword').value;
      const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
      alert(error ? error.message : 'Logged in!');
      if (!error) loadProfilePage();
    });
    document.getElementById('signupBtn')?.addEventListener('click', async () => {
      const email = document.getElementById('authEmail').value, pwd = document.getElementById('authPassword').value;
      const { error } = await supabase.auth.signUp({ email, password: pwd });
      alert(error ? error.message : 'Account created! You can now sign in.');
    });
    return;
  }
  const { data: resumes, error } = await supabase.from('resumes').select('*').eq('user_id', user.id);
  if (error) console.error(error);
  container.innerHTML = `<h2>Your Profile</h2><p><strong>Email:</strong> ${user.email}</p><p><strong>Account created:</strong> ${new Date(user.created_at).toLocaleDateString()}</p><p><strong>Saved resumes:</strong> ${resumes?.length || 0}</p><button id="logoutBtn" class="btn-outline" style="background:#dc3545;color:white;">Sign Out</button><hr><h3>Your Resumes</h3><div id="savedResumesList">${(resumes || []).map(r => `<div class="saved-resume-item"><span><strong>${r.first_name} ${r.last_name}</strong> – ${r.job_title}</span><button class="btn-sm load-resume" data-id="${r.id}">Load</button><button class="btn-sm delete-resume" data-id="${r.id}" style="background:#dc3545;">Delete</button></div>`).join('') || '<p>No saved resumes.</p>'}</div>`;
  document.getElementById('logoutBtn')?.addEventListener('click', async () => { await supabase.auth.signOut(); loadProfilePage(); });
  document.querySelectorAll('.load-resume').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      const resume = resumes.find(r => r.id === id);
      if (resume && firstName) {
        firstName.value = resume.first_name; lastName.value = resume.last_name; jobTitle.value = resume.job_title;
        phone.value = resume.phone; emailField.value = resume.email; address.value = resume.address;
        summary.value = resume.summary; experience.value = resume.experience; education.value = resume.education;
        skills.value = resume.skills; languages.value = resume.languages; awards.value = resume.awards; references.value = resume.references;
        updatePreview();
        window.location.href = 'resume.html';
      }
    });
  });
  document.querySelectorAll('.delete-resume').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Delete this resume?')) { await supabase.from('resumes').delete().eq('id', id); loadProfilePage(); }
    });
  });
}
if (document.getElementById('profileContainer')) loadProfilePage();

// ==========================================
// HUSTLER NOMINATION
// ==========================================
document.getElementById('nominateBtn')?.addEventListener('click', (e) => {
  e.preventDefault();
  window.open('https://wa.me/27794874559?text=I%20want%20to%20nominate%20someone%20for%20Hustler%20of%20the%20Month', '_blank');
});

console.log('9to5 University – fully loaded with fixed resume builder!');