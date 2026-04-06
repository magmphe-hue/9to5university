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
// RESUME BUILDER (unchanged, included for completeness)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
  const firstName = document.getElementById('firstName');
  if (!firstName) return;
  // All resume builder code remains as in previous version
  // (Keep the entire resume builder implementation from the previous answer)
  // For brevity, we assume it's present. In your actual file, keep the full resume builder code.
});

// ==========================================
// PROFILE PAGE WITH PICTURE UPLOAD
// ==========================================

// Helper: escape HTML
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// Upload avatar to Supabase Storage
async function uploadAvatar(file, userId) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `avatars/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  return publicUrl;
}

// Update profile avatar URL in profiles table
async function updateAvatarUrl(userId, avatarUrl) {
  const { error } = await supabase
    .from('profiles')
    .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
    .eq('id', userId);
  if (error) throw error;
}

// Load profile page with avatar and saved resumes
async function loadProfilePage() {
  const container = document.getElementById('profileContainer');
  if (!container) return;

  const { data: { user } } = await supabase.auth.getUser();

  // Not logged in – show auth form
  if (!user) {
    container.innerHTML = `
      <div class="auth-form">
        <h2>Sign In / Sign Up</h2>
        <input type="email" id="authEmail" placeholder="Email" required>
        <input type="password" id="authPassword" placeholder="Password" required>
        <button id="loginBtn" class="btn-primary">Sign In</button>
        <button id="signupBtn" class="btn-outline">Sign Up</button>
      </div>
    `;
    document.getElementById('loginBtn')?.addEventListener('click', async () => {
      const email = document.getElementById('authEmail').value;
      const pwd = document.getElementById('authPassword').value;
      const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
      if (error) alert(error.message);
      else {
        alert('Logged in!');
        loadProfilePage();
      }
    });
    document.getElementById('signupBtn')?.addEventListener('click', async () => {
      const email = document.getElementById('authEmail').value;
      const pwd = document.getElementById('authPassword').value;
      const { data, error } = await supabase.auth.signUp({ email, password: pwd });
      if (error) alert(error.message);
      else {
        // Create profile entry after signup
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([{ id: data.user.id, email: data.user.email, avatar_url: null, created_at: new Date().toISOString() }]);
          if (profileError) console.error('Profile creation error:', profileError);
        }
        alert('Account created! You can now sign in.');
      }
    });
    return;
  }

  // Fetch user profile and resumes
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('avatar_url')
    .eq('id', user.id)
    .single();

  if (profileError && profileError.code !== 'PGRST116') console.error(profileError);

  const { data: resumes, error: resumesError } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (resumesError) console.error(resumesError);

  const avatarUrl = profile?.avatar_url || 'https://via.placeholder.com/150?text=No+Avatar';

  container.innerHTML = `
    <div style="text-align: center; margin-bottom: 2rem;">
      <div class="avatar-container" style="position: relative; display: inline-block;">
        <img id="profileAvatar" src="${avatarUrl}" alt="Profile Picture" style="width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 3px solid var(--accent); cursor: pointer;">
        <input type="file" id="avatarUpload" accept="image/*" style="display: none;">
        <button id="uploadAvatarBtn" class="btn-secondary" style="margin-top: 0.5rem; padding: 0.3rem 1rem; font-size: 0.7rem;"><i class="fas fa-camera"></i> Change Photo</button>
      </div>
      <h2>${escapeHtml(user.email)}</h2>
      <p><strong>Member since:</strong> ${new Date(user.created_at).toLocaleDateString()}</p>
      <p><strong>Saved resumes:</strong> ${resumes?.length || 0}</p>
      <button id="logoutBtn" class="btn-outline" style="background:#dc3545; color:white; margin-top: 1rem;">Sign Out</button>
    </div>
    <hr>
    <h3>Your Resumes</h3>
    <div id="savedResumesList">
      ${(resumes || []).map(r => `
        <div class="saved-resume-item">
          <span><strong>${escapeHtml(r.first_name)} ${escapeHtml(r.last_name)}</strong> – ${escapeHtml(r.job_title)}</span>
          <div>
            <button class="btn-sm load-resume" data-id="${r.id}" style="margin-right: 0.5rem;">Load</button>
            <button class="btn-sm delete-resume" data-id="${r.id}" style="background:#dc3545;">Delete</button>
          </div>
        </div>
      `).join('') || '<p>No saved resumes. Create one from the Resume Builder.</p>'}
    </div>
  `;

  // Avatar upload logic
  const avatarImg = document.getElementById('profileAvatar');
  const fileInput = document.getElementById('avatarUpload');
  const uploadBtn = document.getElementById('uploadAvatarBtn');

  uploadBtn?.addEventListener('click', () => fileInput.click());
  fileInput?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be less than 2MB.');
      return;
    }
    try {
      uploadBtn.disabled = true;
      uploadBtn.textContent = 'Uploading...';
      const publicUrl = await uploadAvatar(file, user.id);
      await updateAvatarUrl(user.id, publicUrl);
      document.getElementById('profileAvatar').src = publicUrl;
      alert('Profile picture updated!');
    } catch (err) {
      console.error(err);
      alert('Upload failed: ' + err.message);
    } finally {
      uploadBtn.disabled = false;
      uploadBtn.innerHTML = '<i class="fas fa-camera"></i> Change Photo';
    }
  });

  // Sign out
  document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    await supabase.auth.signOut();
    loadProfilePage();
  });

  // Load and delete resume handlers
  document.querySelectorAll('.load-resume').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const resume = resumes.find(r => r.id === id);
      if (resume) {
        // Store resume data in localStorage and redirect to resume builder
        localStorage.setItem('loadResumeData', JSON.stringify(resume));
        window.location.href = 'resume.html';
      }
    });
  });

  document.querySelectorAll('.delete-resume').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.getAttribute('data-id');
      if (confirm('Delete this resume permanently?')) {
        await supabase.from('resumes').delete().eq('id', id);
        loadProfilePage();
      }
    });
  });
}

// On resume page, load from localStorage if needed
if (window.location.pathname.includes('resume.html')) {
  const resumeData = localStorage.getItem('loadResumeData');
  if (resumeData) {
    const resume = JSON.parse(resumeData);
    const firstName = document.getElementById('firstName');
    if (firstName) {
      firstName.value = resume.first_name;
      document.getElementById('lastName').value = resume.last_name;
      document.getElementById('jobTitle').value = resume.job_title;
      document.getElementById('phone').value = resume.phone;
      document.getElementById('email').value = resume.email;
      document.getElementById('address').value = resume.address;
      document.getElementById('summary').value = resume.summary;
      document.getElementById('experience').value = resume.experience;
      document.getElementById('education').value = resume.education;
      document.getElementById('skills').value = resume.skills;
      document.getElementById('languages').value = resume.languages;
      document.getElementById('awards').value = resume.awards;
      document.getElementById('references').value = resume.references;
      // Trigger preview update
      const event = new Event('input');
      firstName.dispatchEvent(event);
    }
    localStorage.removeItem('loadResumeData');
  }
}

// Initialize profile page
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
    window.open('https://wa.me/27794874559?text=I%20want%20to%20nominate%20someone%20for%20Hustler%20of%20the%20Month', '_blank');
  });
}

console.log('9to5 University – fully loaded with profile picture upload');