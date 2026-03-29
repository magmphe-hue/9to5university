// ==================== SUPABASE ====================
const SUPABASE_URL = 'https://pfqpyzfqwsksepoohive.supabase.co';
const SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcXB5emZxd3Nrc2Vwb29oaXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzM1MTMsImV4cCI6MjA4OTk0OTUxM30.NPbcOFUPS_2zYg-2MjH1ukHrHqN8AjXRDrP1OpU4nNs;

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;

// ==================== PAGE SWITCHING ====================
window.switchPage = function(pageId) {
  document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active-page'));

  const target = document.getElementById(pageId + '-page');
  if (!target) return console.error("Page not found:", pageId);

  target.classList.add('active-page');

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageId);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (pageId === 'resume') reloadResumeBuilder();
  if (pageId === 'profile') renderProfilePage();
};

// ==================== GLOBAL CLICK FIX ====================
document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-page]');
  if (!btn) return;

  e.preventDefault();
  const page = btn.dataset.page;
  if (page) switchPage(page);
});

// ==================== RESUME BUILDER ====================
let currentPhotoUrl = 'https://via.placeholder.com/120?text=Photo';

function parseList(text, keys) {
  return text.split('\n').filter(Boolean).map(line => {
    const parts = line.split('|');
    let obj = {};
    keys.forEach((k, i) => obj[k] = parts[i] || '');
    return obj;
  });
}

function updatePreview() {
  const data = {
    firstName: val('firstName'),
    lastName: val('lastName'),
    jobTitle: val('jobTitle'),
    phone: val('phone'),
    email: val('email'),
    address: val('address'),
    summary: val('summary'),
    skills: val('skills').split(',').map(s => s.trim()),
    languages: val('languages').split(',').map(l => l.trim()),
    experience: parseList(val('experience'), ['position','company','location','start','end','description']),
    education: parseList(val('education'), ['institution','degree','start','end']),
    awards: parseList(val('awards'), ['title','description','year']),
    references: parseList(val('references'), ['name','company','phone','email']),
    photoUrl: currentPhotoUrl
  };

  const tpl = document.getElementById('templateSelect').value;
  document.getElementById('cvPreview').innerHTML = renderTemplate(tpl, data);

  bindPhotoUpload();
}

function val(id){ return document.getElementById(id)?.value || ''; }

// ==================== PHOTO ====================
function bindPhotoUpload() {
  document.querySelectorAll('.photoUpload').forEach(inp => {
    inp.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = ev => {
        currentPhotoUrl = ev.target.result;
        updatePreview();
      };
      reader.readAsDataURL(file);
    };
  });
}

// ==================== PDF ====================
async function downloadPDF() {
  const el = document.querySelector('#cvPreview .cv-template');
  if (!el) return alert("No CV to download");

  await new Promise(r => setTimeout(r, 300));

  const canvas = await html2canvas(el, { scale: 2 });
  const img = canvas.toDataURL('image/png');

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  const width = pdf.internal.pageSize.getWidth() - 20;
  const height = canvas.height * width / canvas.width;

  pdf.addImage(img, 'PNG', 10, 10, width, height);
  pdf.save('resume.pdf');
}

// ==================== INIT BUILDER ====================
function reloadResumeBuilder() {
  const inputs = document.querySelectorAll('#resume-page input, #resume-page textarea');

  inputs.forEach(i => {
    i.oninput = updatePreview;
  });

  document.getElementById('templateSelect').onchange = updatePreview;
  document.getElementById('downloadPdfBtn').onclick = downloadPDF;
  document.getElementById('saveResumeBtn').onclick = saveResume;

  updatePreview();
}

// ==================== AUTH ====================
supabase.auth.onAuthStateChange((event, session) => {
  currentUser = session?.user || null;
});

async function renderProfilePage() {
  const container = document.getElementById('profileContainer');

  const { data } = await supabase.auth.getUser();
  const user = data.user;

  if (!user) {
    container.innerHTML = `
      <input id="loginEmail" placeholder="Email">
      <input id="loginPassword" type="password">
      <button id="loginBtn">Login</button>
      <button id="signupBtn">Signup</button>
    `;

    document.getElementById('loginBtn').onclick = login;
    document.getElementById('signupBtn').onclick = signup;
    return;
  }

  const { data: resumes } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', user.id);

  container.innerHTML = `
    <h2>${user.email}</h2>
    <button id="logoutBtn">Logout</button>
    <h3>Resumes</h3>
    ${resumes.map(r => `<button onclick="loadResume('${r.id}')">${r.name}</button>`).join('')}
  `;

  document.getElementById('logoutBtn').onclick = logout;
}

async function login() {
  const email = val('loginEmail');
  const password = val('loginPassword');

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) alert(error.message);
  else switchPage('profile');
}

async function signup() {
  const email = val('signupEmail');
  const password = val('signupPassword');
  const name = val('signupName');

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return alert(error.message);

  await supabase.from('profiles').insert({
    id: data.user.id,
    full_name: name
  });

  alert("Signup success");
}

async function logout() {
  await supabase.auth.signOut();
  switchPage('profile');
}

// ==================== SAVE RESUME ====================
async function saveResume() {
  if (!currentUser) {
    alert("Login first");
    return switchPage('profile');
  }

  const data = {
    name: val('firstName') + " " + val('lastName'),
    user_id: currentUser.id,
    data: {
      firstName: val('firstName'),
      lastName: val('lastName')
    }
  };

  const { error } = await supabase.from('resumes').insert(data);

  if (error) alert(error.message);
  else alert("Saved!");
}

// ==================== LOAD ====================
window.loadResume = async (id) => {
  const { data } = await supabase.from('resumes').select('*').eq('id', id).single();

  if (!data) return;

  Object.keys(data.data).forEach(k => {
    const el = document.getElementById(k);
    if (el) el.value = data.data[k];
  });

  updatePreview();
  switchPage('resume');
};

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', () => {
  console.log("App initialized ✅");

  document.getElementById('nominateBtn')?.addEventListener('click', () => {
    alert("Send nominations to email.");
  });
});