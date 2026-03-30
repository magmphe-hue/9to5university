// ==================== CONFIG ====================
const SUPABASE_URL = 'https://pfqpyzfqwsksepoohive.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcXB5emZxd3Nrc2Vwb29oaXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzM1MTMsImV4cCI6MjA4OTk0OTUxM30.NPbcOFUPS_2zYg-2MjH1ukHrHqN8AjXRDrP1OpU4nNs'; // move to env in production

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==================== GLOBAL STATE ====================
let currentUser = null;

// ==================== NAVIGATION ====================
window.switchPage = function (pageId) {
  const sections = document.querySelectorAll('.page-section');
  sections.forEach(s => s.classList.remove('active-page'));

  const target = document.getElementById(`${pageId}-page`);

  if (!target) {
    console.error('❌ Page not found:', pageId);
    return;
  }

  target.classList.add('active-page');

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageId);
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (pageId === 'resume') initResumeBuilder();
  if (pageId === 'profile') renderProfilePage();
};

// GLOBAL CLICK HANDLER
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-page]');
  if (!el) return;

  const page = el.dataset.page;
  if (!page) return;

  e.preventDefault();
  switchPage(page);
});

// ==================== AUTH ====================
async function getUser() {
  try {
    const { data } = await supabase.auth.getUser();
    currentUser = data?.user || null;
    return currentUser;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return alert(error.message);

  switchPage('profile');
}

async function signup() {
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const full_name = document.getElementById('signupName').value;

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return alert(error.message);

  // FIXED: UPSERT PROFILE
  await supabase.from('profiles').upsert({
    id: data.user.id,
    full_name
  });

  alert('Check your email to confirm.');
}

async function logout() {
  await supabase.auth.signOut();
  switchPage('home');
}

// ==================== PROFILE ====================
async function renderProfilePage() {
  const container = document.getElementById('profileContainer');
  const user = await getUser();

  if (!user) {
    container.innerHTML = `
      <h2>Account</h2>
      <input id="loginEmail" placeholder="Email">
      <input id="loginPassword" type="password" placeholder="Password">
      <button class="btn-primary" id="loginBtn">Login</button>
      <hr>
      <input id="signupEmail" placeholder="Email">
      <input id="signupPassword" type="password" placeholder="Password">
      <input id="signupName" placeholder="Full Name">
      <button class="btn-primary" id="signupBtn">Sign Up</button>
    `;

    document.getElementById('loginBtn').onclick = login;
    document.getElementById('signupBtn').onclick = signup;
    return;
  }

  container.innerHTML = `
    <h2>Welcome ${user.email}</h2>
    <button class="btn-outline" id="logoutBtn">Logout</button>
  `;

  document.getElementById('logoutBtn').onclick = logout;
}

// ==================== RESUME ====================
function initResumeBuilder() {
  const inputs = document.querySelectorAll('#resume-page input, #resume-page textarea');

  inputs.forEach(input => {
    input.oninput = updatePreview;
  });

  document.getElementById('downloadPdfBtn').onclick = downloadPDF;
  document.getElementById('saveResumeBtn').onclick = saveResume;

  updatePreview();
}

function updatePreview() {
  const name = document.getElementById('firstName').value || '';
  document.getElementById('cvPreview').innerHTML = `<h1>${name}</h1>`;
}

// ==================== SAVE RESUME ====================
async function saveResume() {
  const user = await getUser();

  if (!user) {
    alert('Login first');
    return switchPage('profile');
  }

  const data = {
    name: document.getElementById('firstName').value,
    user_id: user.id,
    data: {}
  };

  const { error } = await supabase.from('resumes').insert(data);

  if (error) {
    console.error(error);
    return alert('Save failed');
  }

  alert('Saved!');
}

// ==================== PDF ====================
async function downloadPDF() {
  const el = document.getElementById('cvPreview');

  const canvas = await html2canvas(el);
  const img = canvas.toDataURL();

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  pdf.addImage(img, 'PNG', 10, 10);
  pdf.save('cv.pdf');
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', async () => {
  await getUser();
  switchPage('home');
});