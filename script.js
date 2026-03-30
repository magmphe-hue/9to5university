// script.js – Fully functional with Supabase
const SUPABASE_URL = 'https://pfqpyzfqwsksepoohive.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcXB5emZxd3Nrc2Vwb29oaXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzM1MTMsImV4cCI6MjA4OTk0OTUxM30.NPbcOFUPS_2zYg-2MjH1ukHrHqN8AjXRDrP1OpU4nNs';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==================== GLOBAL PAGE SWITCHING ====================
window.switchPage = function(pageId) {
  document.querySelectorAll('.page-section').forEach(section => {
    section.classList.remove('active-page');
  });
  const target = document.getElementById(pageId + '-page');
  if (target) target.classList.add('active-page');
  else console.error('Section not found:', pageId + '-page');

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === pageId) link.classList.add('active');
  });
  window.scrollTo(0, 0);

  if (pageId === 'resume') {
    reloadResumeBuilder();
  }
  if (pageId === 'profile') renderProfilePage();
};

// Event delegation for all elements with data-page attribute
document.body.addEventListener('click', (e) => {
  let target = e.target.closest('[data-page]');
  if (target && target.dataset.page) {
    e.preventDefault();
    window.switchPage(target.dataset.page);
  }
});

// ==================== RESUME BUILDER ====================
let currentPhotoUrl = 'https://via.placeholder.com/120?text=Photo';

function parseExperience(text) {
  return text.split('\n').filter(l=>l.trim()).map(l=>{
    const p=l.split('|');
    return {position:p[0]||'',company:p[1]||'',location:p[2]||'',start:p[3]||'',end:p[4]||'',description:p[5]||''};
  });
}
function parseEducation(text) {
  return text.split('\n').filter(l=>l.trim()).map(l=>{
    const p=l.split('|');
    return {institution:p[0]||'',degree:p[1]||'',start:p[2]||'',end:p[3]||''};
  });
}
function parseAwards(text) {
  return text.split('\n').filter(l=>l.trim()).map(l=>{
    const p=l.split('|');
    return {title:p[0]||'',description:p[1]||'',year:p[2]||''};
  });
}
function parseReferences(text) {
  return text.split('\n').filter(l=>l.trim()).map(l=>{
    const p=l.split('|');
    return {name:p[0]||'',company:p[1]||'',phone:p[2]||'',email:p[3]||''};
  });
}

const templates = {
  minimal: `<div class="cv-template cv-minimal"><div class="header"><div><h1>{{firstName}} {{lastName}}</h1><p>{{jobTitle}}</p></div><div><p>{{email}}</p><p>{{phone}}</p></div></div><p>{{summary}}</p><div class="main"><div class="left"><h3>Experience</h3>{{#experience}}<p><strong>{{position}}</strong> – {{company}}<br><small>{{start}}–{{end}}</small><br>{{description}}</p>{{/experience}}</div><div class="right"><h3>Skills</h3><ul>{{#skills}}<li>{{.}}</li>{{/skills}}</ul></div></div></div>`,
  sidebar: `<div class="cv-template cv-sidebar"><div class="left"><div class="photo"><img src="{{photoUrl}}"><input type="file" class="photoUpload"></div><p><strong>Contact</strong></p><p>{{phone}}</p><p>{{email}}</p><p>{{address}}</p><p><strong>Skills</strong></p><ul>{{#skills}}<li>{{.}}</li>{{/skills}}</ul><p><strong>Languages</strong></p><ul>{{#languages}}<li>{{.}}</li>{{/languages}}</ul></div><div class="right"><h1>{{firstName}} {{lastName}}</h1><p>{{jobTitle}}</p><p>{{summary}}</p><h3>Experience</h3>{{#experience}}<p><strong>{{position}}</strong> at {{company}} ({{start}}–{{end}})<br>{{description}}</p>{{/experience}}<h3>Education</h3>{{#education}}<p><strong>{{degree}}</strong>, {{institution}} ({{start}}–{{end}})</p>{{/education}}</div></div>`,
  elegant: `<div class="cv-template cv-elegant"><div class="left"><div class="photo"><img src="{{photoUrl}}"><input type="file" class="photoUpload"></div><h2>{{firstName}} {{lastName}}</h2><p>{{jobTitle}}</p><ul>{{#skills}}<li>{{.}}</li>{{/skills}}</ul></div><div class="right"><h3>About</h3><p>{{summary}}</p><h3>Experience</h3>{{#experience}}<p><strong>{{position}}</strong> at {{company}} ({{start}}–{{end}})<br>{{description}}</p>{{/experience}}<h3>Education</h3>{{#education}}<p>{{degree}}, {{institution}}</p>{{/education}}</div></div>`,
  centered: `<div class="cv-template cv-centered"><div class="photo"><img src="{{photoUrl}}"><input type="file" class="photoUpload"></div><h1>{{firstName}} {{lastName}}</h1><p>{{jobTitle}}</p><p>{{phone}} | {{email}} | {{address}}</p><p>{{summary}}</p><h3>Experience</h3>{{#experience}}<p><strong>{{position}}</strong> – {{company}} ({{start}}–{{end}})<br>{{description}}</p>{{/experience}}<h3>Skills</h3><ul>{{#skills}}<li>{{.}}</li>{{/skills}}</ul></div>`,
  modern: `<div class="cv-template cv-modern"><h1>{{firstName}} {{lastName}}</h1><p>{{jobTitle}} | {{email}} | {{phone}}</p><p>{{summary}}</p><div class="columns"><div><h3>Skills</h3><ul>{{#skills}}<li>{{.}}</li>{{/skills}}</ul></div><div><h3>Experience</h3>{{#experience}}<p><strong>{{position}}</strong> at {{company}}<br>{{description}}</p>{{/experience}}</div></div></div>`,
  card: `<div class="cv-template cv-card"><div class="photo"><img src="{{photoUrl}}"><input type="file" class="photoUpload"></div><h1>{{firstName}} {{lastName}}</h1><p>{{jobTitle}} | {{email}} | {{phone}}</p><p>{{summary}}</p><div class="main"><div><h3>Education</h3>{{#education}}<p>{{degree}} – {{institution}} ({{start}}–{{end}})</p>{{/education}}</div><div><h3>Experience</h3>{{#experience}}<p><strong>{{position}}</strong> at {{company}}<br>{{description}}</p>{{/experience}}</div></div></div>`,
  classic: `<div class="cv-template cv-classic"><div class="left"><div class="photo"><img src="{{photoUrl}}"><input type="file" class="photoUpload"></div><h2>{{firstName}} {{lastName}}</h2><p>{{jobTitle}}</p><p><strong>Contact</strong><br>{{email}}<br>{{phone}}<br>{{address}}</p></div><div><p>{{summary}}</p><h3>Experience</h3>{{#experience}}<p><strong>{{position}}</strong> at {{company}} ({{start}}–{{end}})<br>{{description}}</p>{{/experience}}<h3>Skills</h3><ul>{{#skills}}<li>{{.}}</li>{{/skills}}</ul></div></div>`
};

function renderTemplate(templateName, data) {
  let tpl = templates[templateName];
  if (!tpl) return '<p>Template not found</p>';
  tpl = tpl.replace(/{{#(\w+)}}([\s\S]*?){{\/\1}}/g, (match, key, inner) => {
    const items = data[key] || [];
    return items.map(item => {
      let sub = inner;
      Object.keys(item).forEach(k => { sub = sub.replace(new RegExp(`{{${k}}}`, 'g'), item[k] || ''); });
      return sub;
    }).join('');
  });
  Object.keys(data).forEach(key => {
    const val = typeof data[key] === 'string' ? data[key] : (Array.isArray(data[key]) ? data[key].join(', ') : '');
    tpl = tpl.replace(new RegExp(`{{${key}}}`, 'g'), val);
  });
  return tpl;
}

function updatePreview() {
  const skillsArr = document.getElementById('skills').value.split(',').map(s=>s.trim());
  const langsArr = document.getElementById('languages').value.split(',').map(l=>l.trim());
  const exp = parseExperience(document.getElementById('experience').value);
  const edu = parseEducation(document.getElementById('education').value);
  const aw = parseAwards(document.getElementById('awards').value);
  const ref = parseReferences(document.getElementById('references').value);
  const data = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    jobTitle: document.getElementById('jobTitle').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    address: document.getElementById('address').value,
    summary: document.getElementById('summary').value,
    skills: skillsArr,
    languages: langsArr,
    experience: exp,
    education: edu,
    awards: aw,
    references: ref,
    photoUrl: currentPhotoUrl
  };
  const tplName = document.getElementById('templateSelect').value;
  const html = renderTemplate(tplName, data);
  document.getElementById('cvPreview').innerHTML = html;
  document.querySelectorAll('.photoUpload').forEach(inp => {
    inp.removeEventListener('change', handlePhoto);
    inp.addEventListener('change', handlePhoto);
  });
}

function handlePhoto(e) {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => { currentPhotoUrl = ev.target.result; updatePreview(); };
  reader.readAsDataURL(file);
}

async function downloadPDF() {
  const element = document.querySelector('#cvPreview .cv-template');
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

function reloadResumeBuilder() {
  const templateSelect = document.getElementById('templateSelect');
  if (templateSelect) {
    templateSelect.removeEventListener('change', updatePreview);
    templateSelect.addEventListener('change', updatePreview);
  }
  const saveBtn = document.getElementById('saveResumeBtn');
  if (saveBtn) {
    saveBtn.removeEventListener('click', saveCurrentResume);
    saveBtn.addEventListener('click', saveCurrentResume);
  }
  const downloadBtn = document.getElementById('downloadPdfBtn');
  if (downloadBtn) {
    downloadBtn.removeEventListener('click', downloadPDF);
    downloadBtn.addEventListener('click', downloadPDF);
  }
  const inputs = ['firstName','lastName','jobTitle','phone','email','address','summary','experience','education','skills','languages','awards','references'];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.removeEventListener('input', updatePreview);
      el.addEventListener('input', updatePreview);
    }
  });
  updatePreview();
}

// ==================== AUTH & PROFILE ====================
let currentUser = null;

async function checkUser() {
  if (!supabase || !supabase.auth) return null;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    currentUser = user;
    return user;
  } catch (err) {
    console.error('Supabase error:', err);
    return null;
  }
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

  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    const { data: resumes } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

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
        ${resumes?.length ? resumes.map(res => `
          <div class="saved-resume-item">
            <span><strong>${res.name || 'Resume'}</strong> (${new Date(res.created_at).toLocaleDateString()})</span>
            <button class="btn-outline" data-id="${res.id}" onclick="loadResume('${res.id}')">Load</button>
          </div>
        `).join('') : '<p>No saved resumes yet. Create and save one from the Resume Builder.</p>'}
      </div>
    `;
    document.getElementById('logoutBtn')?.addEventListener('click', logout);
    document.getElementById('updateProfileBtn')?.addEventListener('click', async () => {
      const full_name = document.getElementById('editName').value;
      const phone = document.getElementById('editPhone').value;
      await supabase.from('profiles').update({ full_name, phone }).eq('id', user.id);
      alert('Profile updated!');
      renderProfilePage();
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = '<p>Error loading profile. Please try again later.</p>';
  }
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
    if (data.user) {
      await supabase.from('profiles').update({ full_name }).eq('id', data.user.id);
    }
    alert('Sign-up successful! Please check your email to confirm your account.');
    window.switchPage('profile');
  }
}

async function logout() {
  await supabase.auth.signOut();
  window.switchPage('profile');
}

// ==================== RESUME SAVING & LOADING ====================
async function saveCurrentResume() {
  const user = await checkUser();
  if (!user) {
    alert('Please sign in to save your resume.');
    window.switchPage('profile');
    return;
  }
  const resumeData = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    jobTitle: document.getElementById('jobTitle').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    address: document.getElementById('address').value,
    summary: document.getElementById('summary').value,
    experience: document.getElementById('experience').value,
    education: document.getElementById('education').value,
    skills: document.getElementById('skills').value,
    languages: document.getElementById('languages').value,
    awards: document.getElementById('awards').value,
    references: document.getElementById('references').value,
    template: document.getElementById('templateSelect').value
  };
  const name = `${resumeData.firstName} ${resumeData.lastName}`.trim() || 'Untitled';
  const { error } = await supabase
    .from('resumes')
    .insert({ user_id: user.id, name, data: resumeData });
  if (error) alert('Error saving resume: ' + error.message);
  else alert('Resume saved successfully!');
}

window.loadResume = async function(resumeId) {
  const { data: resume } = await supabase
    .from('resumes')
    .select('data')
    .eq('id', resumeId)
    .single();
  if (resume && resume.data) {
    const d = resume.data;
    document.getElementById('firstName').value = d.firstName || '';
    document.getElementById('lastName').value = d.lastName || '';
    document.getElementById('jobTitle').value = d.jobTitle || '';
    document.getElementById('phone').value = d.phone || '';
    document.getElementById('email').value = d.email || '';
    document.getElementById('address').value = d.address || '';
    document.getElementById('summary').value = d.summary || '';
    document.getElementById('experience').value = d.experience || '';
    document.getElementById('education').value = d.education || '';
    document.getElementById('skills').value = d.skills || '';
    document.getElementById('languages').value = d.languages || '';
    document.getElementById('awards').value = d.awards || '';
    document.getElementById('references').value = d.references || '';
    if (d.template) document.getElementById('templateSelect').value = d.template;
    updatePreview();
    window.switchPage('resume');
    alert('Resume loaded!');
  }
};

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', async () => {
  await checkUser();
  if (document.getElementById('resume-page').classList.contains('active-page')) {
    reloadResumeBuilder();
  }
  const nominateBtn = document.getElementById('nominateBtn');
  if (nominateBtn) {
    nominateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert('Send nominations to mphelamlangeni@gmail.com with story and contact.');
    });
  }
});