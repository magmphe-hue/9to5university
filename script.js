// Supabase configuration (same as before)
const SUPABASE_URL = 'https://pfqpyzfqwsksepoohive.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcXB5emZxd3Nrc2Vwb29oaXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzM1MTMsImV4cCI6MjA4OTk0OTUxM30.NPbcOFUPS_2zYg-2MjH1ukHrHqN8AjXRDrP1OpU4nNs';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ================= PAGE SWITCHING (unchanged) =================
window.switchPage = function(pageId) {
  document.querySelectorAll('.page-section').forEach(section => section.classList.remove('active-page'));
  const target = document.getElementById(pageId + '-page');
  if (target) target.classList.add('active-page');
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === pageId) link.classList.add('active');
  });
  window.scrollTo(0, 0);
  if (pageId === 'profile') renderProfilePage();
  if (pageId === 'resume') initResumeBuilder();
};
document.body.addEventListener('click', (e) => {
  let target = e.target.closest('[data-page]');
  if (target && target.dataset.page) {
    e.preventDefault();
    window.switchPage(target.dataset.page);
  }
});

// ================= NEW RESUME BUILDER LOGIC =================
let currentUser = null;

function updatePreview() {
  const name = document.getElementById('fullName')?.value || '';
  const title = document.getElementById('jobTitle')?.value || '';
  const email = document.getElementById('email')?.value || '';
  const phone = document.getElementById('phone')?.value || '';
  const summary = document.getElementById('summary')?.value || '';
  const skillsRaw = document.getElementById('skills')?.value || '';
  const skills = skillsRaw.split(',').map(s => s.trim()).filter(s => s);
  const expRaw = document.getElementById('experience')?.value || '';
  const expLines = expRaw.split('\n').filter(l => l.trim());

  document.getElementById('previewName').innerText = name || 'Not provided';
  document.getElementById('previewTitle').innerText = title || 'Not provided';
  document.getElementById('previewEmail').innerText = email;
  document.getElementById('previewPhone').innerText = phone;
  document.getElementById('previewSummary').innerText = summary;

  const skillsContainer = document.getElementById('previewSkills');
  skillsContainer.innerHTML = skills.map(s => `<span>${s}</span>`).join('');
  const expContainer = document.getElementById('previewExperience');
  expContainer.innerHTML = expLines.map(line => `<p>${line}</p>`).join('');
}

function initResumeBuilder() {
  const generateBtn = document.getElementById('generatePreviewBtn');
  const saveBtn = document.getElementById('saveResumeBtnNew');
  const downloadBtn = document.getElementById('downloadPdfBtnNew');
  const inputs = ['fullName', 'jobTitle', 'email', 'phone', 'summary', 'experience', 'skills'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.removeEventListener('input', updatePreview);
      el.addEventListener('input', updatePreview);
    }
  });
  if (generateBtn) {
    generateBtn.removeEventListener('click', updatePreview);
    generateBtn.addEventListener('click', updatePreview);
  }
  if (saveBtn) {
    saveBtn.removeEventListener('click', saveCurrentResume);
    saveBtn.addEventListener('click', saveCurrentResume);
  }
  if (downloadBtn) {
    downloadBtn.removeEventListener('click', downloadPDF);
    downloadBtn.addEventListener('click', downloadPDF);
  }
  updatePreview();
}

async function saveCurrentResume() {
  const user = await checkUser();
  if (!user) {
    alert('Please sign in to save your resume.');
    window.switchPage('profile');
    return;
  }
  const resumeData = {
    fullName: document.getElementById('fullName')?.value,
    jobTitle: document.getElementById('jobTitle')?.value,
    email: document.getElementById('email')?.value,
    phone: document.getElementById('phone')?.value,
    summary: document.getElementById('summary')?.value,
    experience: document.getElementById('experience')?.value,
    skills: document.getElementById('skills')?.value
  };
  const name = resumeData.fullName || 'Untitled';
  const { error } = await supabase.from('resumes').insert({
    user_id: user.id,
    name,
    data: resumeData
  });
  if (error) alert('Error saving resume: ' + error.message);
  else alert('Resume saved successfully!');
}

async function downloadPDF() {
  const element = document.getElementById('resumePreviewCard');
  if (!element) {
    alert('No resume preview to download.');
    return;
  }
  try {
    const canvas = await html2canvas(element, { scale: 3, backgroundColor: '#ffffff', logging: false });
    const imgData = canvas.toDataURL('image/png');
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgWidth = pdfWidth - 20;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
    pdf.save('resume_9to5.pdf');
  } catch(err) {
    console.error(err);
    alert('PDF generation failed. Please try again.');
  }
}

// ================= AUTH & PROFILE (unchanged from previous full version) =================
async function checkUser() {
  const { data: { user } } = await supabase.auth.getUser();
  currentUser = user;
  return user;
}

async function renderProfilePage() {
  const container = document.getElementById('profileContainer');
  const user = await checkUser();
  if (!user) {
    container.innerHTML = `
      <h2>Access Your Profile</h2>
      <div style="display:flex; gap:2rem; flex-wrap:wrap;">
        <div class="auth-form">
          <h3>Sign In</h3>
          <input type="email" id="loginEmail" placeholder="Email">
          <input type="password" id="loginPassword" placeholder="Password">
          <button class="btn-primary" id="loginBtn">Sign In</button>
        </div>
        <div class="auth-form">
          <h3>Create Account</h3>
          <input type="email" id="signupEmail" placeholder="Email">
          <input type="password" id="signupPassword" placeholder="Password">
          <input type="text" id="signupName" placeholder="Full Name">
          <button class="btn-primary" id="signupBtn">Sign Up</button>
        </div>
      </div>
    `;
    document.getElementById('loginBtn')?.addEventListener('click', login);
    document.getElementById('signupBtn')?.addEventListener('click', signup);
    return;
  }
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const { data: resumes } = await supabase.from('resumes').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
  container.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap; gap: 1rem;">
      <h2>Welcome, ${profile?.full_name || user.email}</h2>
      <button class="btn-outline" id="logoutBtn">Sign Out</button>
    </div>
    <div style="margin-bottom: 2rem;">
      <h3>Edit Profile</h3>
      <input type="text" id="editName" placeholder="Full Name" value="${profile?.full_name || ''}">
      <input type="text" id="editPhone" placeholder="Phone" value="${profile?.phone || ''}">
      <button class="btn-primary" id="updateProfileBtn">Update Profile</button>
    </div>
    <div>
      <h3>Saved Resumes</h3>
      ${resumes?.length ? resumes.map(res => `<div class="saved-resume-item"><span><strong>${res.name}</strong> (${new Date(res.created_at).toLocaleDateString()})</span><button class="btn-outline" data-id="${res.id}" onclick="loadResume('${res.id}')">Load</button></div>`).join('') : '<p>No saved resumes yet.</p>'}
    </div>
  `;
  document.getElementById('logoutBtn')?.addEventListener('click', () => supabase.auth.signOut().then(() => renderProfilePage()));
  document.getElementById('updateProfileBtn')?.addEventListener('click', async () => {
    const full_name = document.getElementById('editName').value;
    const phone = document.getElementById('editPhone').value;
    await supabase.from('profiles').update({ full_name, phone }).eq('id', user.id);
    alert('Profile updated!');
    renderProfilePage();
  });
}

async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) alert(error.message);
  else window.switchPage('profile');
}

async function signup() {
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const full_name = document.getElementById('signupName').value;
  const { error, data } = await supabase.auth.signUp({ email, password });
  if (error) alert(error.message);
  else {
    if (data.user) await supabase.from('profiles').update({ full_name }).eq('id', data.user.id);
    alert('Sign-up successful! Please check your email to confirm.');
    window.switchPage('profile');
  }
}

window.loadResume = async function(resumeId) {
  const { data: resume } = await supabase.from('resumes').select('data').eq('id', resumeId).single();
  if (resume && resume.data) {
    const d = resume.data;
    document.getElementById('fullName').value = d.fullName || '';
    document.getElementById('jobTitle').value = d.jobTitle || '';
    document.getElementById('email').value = d.email || '';
    document.getElementById('phone').value = d.phone || '';
    document.getElementById('summary').value = d.summary || '';
    document.getElementById('experience').value = d.experience || '';
    document.getElementById('skills').value = d.skills || '';
    updatePreview();
    window.switchPage('resume');
    alert('Resume loaded!');
  }
};

document.addEventListener('DOMContentLoaded', () => {
  initResumeBuilder();
  if (document.querySelector('.page-section.active-page')?.id === 'profile-page') renderProfilePage();
});