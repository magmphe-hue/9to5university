// ==================== SUPABASE SETUP ====================
const SUPABASE_URL = 'https://pfqpyzfqwsksepoohive.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE'; // keep same or rotate later

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==================== GLOBAL PAGE SWITCHING ====================
window.switchPage = function(pageId) {
  document.querySelectorAll('.page-section').forEach(section => {
    section.classList.remove('active-page');
  });

  const target = document.getElementById(pageId + '-page');
  if (target) target.classList.add('active-page');

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === pageId) link.classList.add('active');
  });

  window.scrollTo(0, 0);

  if (pageId === 'resume') reloadResumeBuilder();
  if (pageId === 'profile') renderProfilePage();
};

document.body.addEventListener('click', (e) => {
  let target = e.target.closest('[data-page]');
  if (target && target.dataset.page) {
    e.preventDefault();
    window.switchPage(target.dataset.page);
  }
});

// ==================== REFERRAL SYSTEM ====================
function generateReferralCode() {
  return 'ref_' + Math.random().toString(36).substring(2, 10);
}

function getReferralFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('ref');
}

// ==================== AUTH ====================
let currentUser = null;

async function checkUser() {
  const { data: { user } } = await supabase.auth.getUser();
  currentUser = user;
  return user;
}

// LOGIN
async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) alert(error.message);
  else window.switchPage('profile');
}

// SIGNUP WITH REFERRAL TRACKING
async function signup() {
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const full_name = document.getElementById('signupName').value;

  const { error, data } = await supabase.auth.signUp({ email, password });

  if (error) {
    alert(error.message);
    return;
  }

  if (data.user) {
    const referral_code = generateReferralCode();

    // CREATE PROFILE
    await supabase.from('profiles').insert({
      id: data.user.id,
      full_name,
      referral_code
    });

    // HANDLE REFERRAL
    const refCode = getReferralFromURL();

    if (refCode) {
      const { data: referrer } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', refCode)
        .single();

      if (referrer) {
        await supabase.from('referrals').insert({
          referrer_id: referrer.id,
          referred_user_id: data.user.id,
          amount: 500,
          status: 'pending'
        });
      }
    }
  }

  alert('Sign-up successful!');
  window.switchPage('profile');
}

// LOGOUT
async function logout() {
  await supabase.auth.signOut();
  window.switchPage('profile');
}

// ==================== PROFILE PAGE ====================
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

  // LOAD PROFILE
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // LOAD REFERRALS
  const { data: referrals } = await supabase
    .from('referrals')
    .select('*')
    .eq('referrer_id', user.id);

  const totalEarnings = referrals?.reduce((sum, r) => sum + r.amount, 0) || 0;

  const referralLink = `${window.location.origin}?ref=${profile.referral_code}`;

  container.innerHTML = `
    <h2>Welcome, ${profile?.full_name || user.email}</h2>

    <button class="btn-outline" id="logoutBtn">Sign Out</button>

    <div style="margin-top:2rem;">
      <h3>💰 Your Earnings</h3>
      <p><strong>R${totalEarnings}</strong></p>
      <p>${referrals?.length || 0} referrals</p>
    </div>

    <div style="margin-top:2rem;">
      <h3>🔗 Your Referral Link</h3>
      <input type="text" value="${referralLink}" readonly style="width:100%; padding:10px;">
      <button class="btn-primary" onclick="navigator.clipboard.writeText('${referralLink}')">
        Copy Link
      </button>
    </div>
  `;

  document.getElementById('logoutBtn')?.addEventListener('click', logout);
}

// ==================== RESUME BUILDER (UNCHANGED CORE) ====================
let currentPhotoUrl = 'https://via.placeholder.com/120?text=Photo';

function updatePreview() {
  const data = {
    firstName: document.getElementById('firstName').value,
    lastName: document.getElementById('lastName').value,
    jobTitle: document.getElementById('jobTitle').value
  };

  document.getElementById('cvPreview').innerHTML = `
    <div>
      <h1>${data.firstName} ${data.lastName}</h1>
      <p>${data.jobTitle}</p>
    </div>
  `;
}

function reloadResumeBuilder() {
  const inputs = ['firstName','lastName','jobTitle'];

  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', updatePreview);
  });

  updatePreview();
}

// ==================== SAVE RESUME ====================
async function saveCurrentResume() {
  const user = await checkUser();

  if (!user) {
    alert('Login first');
    return;
  }

  await supabase.from('resumes').insert({
    user_id: user.id,
    name: 'Resume',
    data: {}
  });

  alert('Saved!');
}

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', async () => {
  await checkUser();

  if (document.getElementById('resume-page')?.classList.contains('active-page')) {
    reloadResumeBuilder();
  }
});