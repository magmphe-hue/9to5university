// ================= GLOBAL ERROR LOGGER =================
window.addEventListener("error", (e) => {
  console.error("🔥 Global Error:", e.message);
});

// ================= SUPABASE INIT =================
const SUPABASE_URL = 'https://pfqpyzfqwsksepoohive.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcXB5emZxd3Nrc2Vwb29oaXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzM1MTMsImV4cCI6MjA4OTk0OTUxM30.NPbcOFUPS_2zYg-2MjH1ukHrHqN8AjXRDrP1OpU4nNs';

let supabase = null;
let currentUser = null;
let currentPhotoUrl = 'https://via.placeholder.com/120?text=Photo';

// ================= APP INIT =================
document.addEventListener('DOMContentLoaded', async () => {
  try {
    if (!window.supabase) throw new Error("Supabase not loaded");

    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    await checkUser();
    initNavigation();

    console.log("✅ App initialized");
  } catch (err) {
    console.error("Init failed:", err);
    alert("App failed to load.");
  }
});

// ================= NAVIGATION =================
function initNavigation() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-page]');
    if (!link) return;

    e.preventDefault();
    const pageId = link.dataset.page;
    if (!pageId) return;

    switchPage(pageId);
  });
}

window.switchPage = function(pageId) {
  const target = document.getElementById(pageId + '-page');

  if (!target) {
    alert("Page not found: " + pageId);
    return;
  }

  document.querySelectorAll('.page-section')
    .forEach(sec => sec.classList.remove('active-page'));

  target.classList.add('active-page');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (pageId === 'resume') reloadResumeBuilder();
  if (pageId === 'profile') renderProfilePage();
};

// ================= AUTH =================
async function checkUser() {
  try {
    const { data } = await supabase.auth.getUser();
    currentUser = data.user;
  } catch (err) {
    console.error("Auth error:", err);
  }
}

async function login() {
  const email = document.getElementById('loginEmail')?.value;
  const password = document.getElementById('loginPassword')?.value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return alert(error.message);

  alert("Login successful");
  switchPage('profile');
}

async function signup() {
  const email = document.getElementById('signupEmail')?.value;
  const password = document.getElementById('signupPassword')?.value;
  const full_name = document.getElementById('signupName')?.value;

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return alert(error.message);

  await supabase.from('profiles').upsert({
    id: data.user.id,
    full_name
  });

  alert("Account created. Check your email.");
}

async function logout() {
  await supabase.auth.signOut();
  location.reload();
}

// ================= PROFILE =================
async function renderProfilePage() {
  const container = document.getElementById('profileContainer');
  if (!container) return;

  if (!currentUser) {
    container.innerHTML = `
      <h2>Access Your Profile</h2>
      <input id="loginEmail" placeholder="Email">
      <input id="loginPassword" type="password" placeholder="Password">
      <button onclick="login()">Login</button>

      <h3>Create Account</h3>
      <input id="signupEmail" placeholder="Email">
      <input id="signupPassword" type="password">
      <input id="signupName" placeholder="Full Name">
      <button onclick="signup()">Sign Up</button>
    `;
    return;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', currentUser.id)
    .single();

  container.innerHTML = `
    <h2>Welcome ${profile?.full_name || currentUser.email}</h2>
    <button onclick="logout()">Logout</button>
  `;
}

// ================= RESUME BUILDER =================
function reloadResumeBuilder() {
  const inputs = document.querySelectorAll('#resume-page input, #resume-page textarea, #resume-page select');

  inputs.forEach(input => {
    input.removeEventListener('input', updatePreview);
    input.addEventListener('input', updatePreview);
  });

  document.getElementById('downloadPdfBtn')?.addEventListener('click', downloadPDF);
  document.getElementById('saveResumeBtn')?.addEventListener('click', saveCurrentResume);

  updatePreview();
}

function updatePreview() {
  const preview = document.getElementById('cvPreview');
  if (!preview) return;

  const firstName = document.getElementById('firstName')?.value || '';
  const lastName = document.getElementById('lastName')?.value || '';

  preview.innerHTML = `
    <div>
      <h1>${firstName} ${lastName}</h1>
      <p>Resume Preview</p>
    </div>
  `;
}

// ================= PHOTO UPLOAD =================
function handlePhoto(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (ev) => {
    currentPhotoUrl = ev.target.result;
    updatePreview();
  };
  reader.readAsDataURL(file);
}

// ================= PDF =================
async function downloadPDF() {
  const element = document.querySelector('#cvPreview');

  if (!element) {
    alert("No preview found");
    return;
  }

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL('image/png');

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  pdf.addImage(imgData, 'PNG', 10, 10, 180, 0);
  pdf.save('resume.pdf');
}

// ================= SAVE RESUME =================
async function saveCurrentResume() {
  if (!currentUser) {
    alert('Please sign in first');
    switchPage('profile');
    return;
  }

  const data = {
    firstName: document.getElementById('firstName')?.value
  };

  const { error } = await supabase.from('resumes').insert({
    user_id: currentUser.id,
    data
  });

  if (error) return alert(error.message);

  alert("Resume saved!");
}