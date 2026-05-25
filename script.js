// ==========================================
// SUPABASE INITIALIZATION
// ==========================================
const SUPABASE_URL = 'https://pfqpyzfqwsksepoohive.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcXB5emZxd3Nrc2Vwb29oaXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzM1MTMsImV4cCI6MjA4OTk0OTUxM30.NPbcOFUPS_2zYg-2MjH1ukHrHqN8AjXRDrP1OpU4nNs';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// DARK MODE, BACK TO TOP, RIBBON (existing)
// ==========================================
const darkToggle = document.getElementById('darkModeToggle');
if (darkToggle) {
  darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  });
  if (localStorage.getItem('darkMode') === 'true') document.body.classList.add('dark-mode');
}
const backBtn = document.getElementById('backToTop');
if (backBtn) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) backBtn.classList.add('show');
    else backBtn.classList.remove('show');
  });
  backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
const ribbon = document.querySelector('.ribbon');
if (ribbon) {
  ribbon.addEventListener('click', () => {
    window.open('https://wa.me/27794874559?text=Hello%2C%20I%20want%20to%20advertise%20on%209to5%20University', '_blank');
  });
}

// ==========================================
// RESUME BUILDER (FULLY FUNCTIONAL)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
  const builderContainer = document.querySelector('.builder-container');
  if (!builderContainer) return;

  // DOM elements for step navigation
  const steps = document.querySelectorAll('.step');
  const stepContents = document.querySelectorAll('.step-content');
  
  // Function to show a specific step (1-indexed)
  function showStep(stepNumber) {
    // Hide all step contents
    stepContents.forEach(content => content.classList.remove('active'));
    // Show the selected step content
    const targetContent = document.querySelector(`.step-content[data-step="${stepNumber}"]`);
    if (targetContent) targetContent.classList.add('active');
    // Update step indicators
    steps.forEach(step => {
      const stepNum = parseInt(step.getAttribute('data-step'));
      if (stepNum === stepNumber) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
  }

  // Add click listeners to step tabs
  steps.forEach(step => {
    step.addEventListener('click', () => {
      const stepNum = parseInt(step.getAttribute('data-step'));
      if (!isNaN(stepNum)) showStep(stepNum);
    });
  });

  // Add listeners to all Next buttons
  const nextButtons = document.querySelectorAll('.next-btn');
  nextButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeContent = document.querySelector('.step-content.active');
      if (activeContent) {
        const currentStep = parseInt(activeContent.getAttribute('data-step'));
        const nextStep = currentStep + 1;
        if (nextStep <= stepContents.length) showStep(nextStep);
      }
    });
  });

  // Add listeners to all Previous buttons
  const prevButtons = document.querySelectorAll('.prev-btn');
  prevButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeContent = document.querySelector('.step-content.active');
      if (activeContent) {
        const currentStep = parseInt(activeContent.getAttribute('data-step'));
        const prevStep = currentStep - 1;
        if (prevStep >= 1) showStep(prevStep);
      }
    });
  });

  // Initially show step 1 (already active in HTML, but ensure)
  showStep(1);

  // ----- Dynamic Work Entries -----
  const workContainer = document.getElementById('workEntries');
  const addWorkBtn = document.getElementById('addWorkBtn');
  function addWorkEntry(data = {}) {
    const div = document.createElement('div');
    div.className = 'work-entry entry';
    div.innerHTML = `
      <div class="form-row">
        <div class="form-group"><label>Job Title</label><input type="text" class="job-title" value="${escapeHtml(data.title || '')}" placeholder="e.g., Frontend Developer"></div>
        <div class="form-group"><label>Company</label><input type="text" class="company" value="${escapeHtml(data.company || '')}" placeholder="Company name"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Start Date</label><input type="text" class="start-date" value="${escapeHtml(data.start || '')}" placeholder="MM/YYYY"></div>
        <div class="form-group"><label>End Date</label><input type="text" class="end-date" value="${escapeHtml(data.end || '')}" placeholder="Present or MM/YYYY"></div>
      </div>
      <div class="form-group"><label>Description</label><textarea class="work-desc" rows="2" placeholder="Key responsibilities...">${escapeHtml(data.desc || '')}</textarea></div>
      <button type="button" class="remove-entry btn-outline btn-sm">Remove</button>
    `;
    div.querySelector('.remove-entry').addEventListener('click', () => div.remove());
    workContainer.appendChild(div);
  }
  if (addWorkBtn) addWorkBtn.addEventListener('click', () => addWorkEntry());
  if (workContainer && workContainer.children.length === 0) addWorkEntry();

  // ----- Dynamic Education Entries -----
  const eduContainer = document.getElementById('eduEntries');
  const addEduBtn = document.getElementById('addEduBtn');
  function addEduEntry(data = {}) {
    const div = document.createElement('div');
    div.className = 'edu-entry entry';
    div.innerHTML = `
      <div class="form-row">
        <div class="form-group"><label>Degree</label><input type="text" class="degree" value="${escapeHtml(data.degree || '')}" placeholder="BSc Computer Science"></div>
        <div class="form-group"><label>Institution</label><input type="text" class="institution" value="${escapeHtml(data.institution || '')}" placeholder="University name"></div>
      </div>
      <div class="form-row">
        <div class="form-group"><label>Start Year</label><input type="text" class="edu-start" value="${escapeHtml(data.start || '')}" placeholder="YYYY"></div>
        <div class="form-group"><label>End Year</label><input type="text" class="edu-end" value="${escapeHtml(data.end || '')}" placeholder="YYYY"></div>
      </div>
      <button type="button" class="remove-entry btn-outline btn-sm">Remove</button>
    `;
    div.querySelector('.remove-entry').addEventListener('click', () => div.remove());
    eduContainer.appendChild(div);
  }
  if (addEduBtn) addEduBtn.addEventListener('click', () => addEduEntry());
  if (eduContainer && eduContainer.children.length === 0) addEduEntry();

  // ----- Collect data functions -----
  function getWorkEntries() {
    const entries = [];
    document.querySelectorAll('.work-entry').forEach(entry => {
      entries.push({
        title: entry.querySelector('.job-title')?.value || '',
        company: entry.querySelector('.company')?.value || '',
        start: entry.querySelector('.start-date')?.value || '',
        end: entry.querySelector('.end-date')?.value || '',
        desc: entry.querySelector('.work-desc')?.value || ''
      });
    });
    return entries;
  }
  function getEduEntries() {
    const entries = [];
    document.querySelectorAll('.edu-entry').forEach(entry => {
      entries.push({
        degree: entry.querySelector('.degree')?.value || '',
        institution: entry.querySelector('.institution')?.value || '',
        start: entry.querySelector('.edu-start')?.value || '',
        end: entry.querySelector('.edu-end')?.value || ''
      });
    });
    return entries;
  }

  // ----- Template rendering -----
  const fullName = document.getElementById('fullName');
  const jobTitle = document.getElementById('jobTitle');
  const email = document.getElementById('email');
  const phone = document.getElementById('phone');
  const address = document.getElementById('address');
  const summary = document.getElementById('summary');
  const skills = document.getElementById('skills');
  const languages = document.getElementById('languages');
  const templateSelect = document.getElementById('templateSelect');
  const previewTemplateSelect = document.getElementById('previewTemplateSelect');
  const resumePreview = document.getElementById('resumePreview');
  const downloadBtn = document.getElementById('downloadPdfBtn');
  const saveBtn = document.getElementById('saveResumeBtn');

  function renderModern(data) {
    return `
      <div class="resume-modern" style="font-family:'Chivo';max-width:800px;margin:0 auto;">
        <div style="background:#014656;color:white;padding:1.5rem;text-align:center;">
          <h1 style="margin:0;font-family:'Rubik Mono One';">${escapeHtml(data.fullName)}</h1>
          <p style="margin:0.5rem 0 0;">${escapeHtml(data.jobTitle)}</p>
        </div>
        <div style="padding:1.5rem;">
          <div style="display:flex;justify-content:space-between;flex-wrap:wrap;background:#f0f9fa;padding:0.6rem;border-radius:8px;margin-bottom:1rem;">
            <span><i class="fas fa-phone"></i> ${escapeHtml(data.phone)}</span>
            <span><i class="fas fa-envelope"></i> ${escapeHtml(data.email)}</span>
            <span><i class="fas fa-map-marker-alt"></i> ${escapeHtml(data.address)}</span>
          </div>
          <h2 style="border-bottom:2px solid #00a2ad;">Professional Summary</h2>
          <p>${escapeHtml(data.summary)}</p>
          <h2>Work Experience</h2>
          ${data.work.map(w => `<div><strong>${escapeHtml(w.title)}</strong> at ${escapeHtml(w.company)} (${escapeHtml(w.start)}–${escapeHtml(w.end)})<br>${escapeHtml(w.desc)}</div><br>`).join('')}
          <h2>Education</h2>
          ${data.edu.map(e => `<div><strong>${escapeHtml(e.degree)}</strong>, ${escapeHtml(e.institution)} (${escapeHtml(e.start)}–${escapeHtml(e.end)})</div>`).join('')}
          <h2>Skills</h2>
          <ul>${data.skills.split(',').map(s => `<li>${escapeHtml(s.trim())}</li>`).join('')}</ul>
          <h2>Languages</h2>
          <ul>${data.languages.split(',').map(l => `<li>${escapeHtml(l.trim())}</li>`).join('')}</ul>
        </div>
      </div>
    `;
  }
  function renderClassic(data) {
    return renderModern(data).replace('#014656', '#2c3e50').replace('#00a2ad', '#3498db');
  }
  function renderExecutive(data) {
    return renderModern(data).replace('#014656', '#1a1a2e').replace('#00a2ad', '#f6a801');
  }

  function updatePreview() {
    const work = getWorkEntries();
    const edu = getEduEntries();
    const selectedTemplate = previewTemplateSelect ? previewTemplateSelect.value : (templateSelect ? templateSelect.value : 'modern');
    const data = {
      fullName: fullName?.value || '',
      jobTitle: jobTitle?.value || '',
      email: email?.value || '',
      phone: phone?.value || '',
      address: address?.value || '',
      summary: summary?.value || '',
      skills: skills?.value || '',
      languages: languages?.value || '',
      work, edu
    };
    let html = '';
    if (selectedTemplate === 'modern') html = renderModern(data);
    else if (selectedTemplate === 'classic') html = renderClassic(data);
    else html = renderExecutive(data);
    if (resumePreview) resumePreview.innerHTML = html;
  }

  // Sync template selects and add listeners
  if (templateSelect) {
    templateSelect.addEventListener('change', () => {
      if (previewTemplateSelect) previewTemplateSelect.value = templateSelect.value;
      updatePreview();
    });
  }
  if (previewTemplateSelect) {
    previewTemplateSelect.addEventListener('change', () => {
      if (templateSelect) templateSelect.value = previewTemplateSelect.value;
      updatePreview();
    });
  }
  const allInputs = [fullName, jobTitle, email, phone, address, summary, skills, languages];
  allInputs.forEach(inp => inp?.addEventListener('input', updatePreview));
  // Observe dynamic entries
  const observer = new MutationObserver(() => updatePreview());
  if (workContainer) observer.observe(workContainer, { childList: true, subtree: true, attributes: true });
  if (eduContainer) observer.observe(eduContainer, { childList: true, subtree: true, attributes: true });
  updatePreview();

  // PDF Download
  async function downloadPDF() {
    if (!resumePreview) return;
    try {
      const element = resumePreview;
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5],
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, letterRendering: true },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error(err);
      alert('PDF generation failed. Try again.');
    }
  }
  if (downloadBtn) downloadBtn.addEventListener('click', downloadPDF);

  // Save to Supabase
  async function saveResume() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Please sign in on the Profile page first.');
      return;
    }
    const work = getWorkEntries();
    const edu = getEduEntries();
    const template = previewTemplateSelect ? previewTemplateSelect.value : (templateSelect ? templateSelect.value : 'modern');
    const resumeData = {
      user_id: user.id,
      first_name: fullName.value.split(' ')[0] || '',
      last_name: fullName.value.split(' ').slice(1).join(' ') || '',
      job_title: jobTitle.value,
      phone: phone.value,
      email: email.value,
      address: address.value,
      summary: summary.value,
      skills: skills.value,
      languages: languages.value,
      experience: JSON.stringify(work),
      education: JSON.stringify(edu),
      template: template,
      created_at: new Date().toISOString()
    };
    const { error } = await supabase.from('resumes').insert([resumeData]);
    if (error) alert('Save failed: ' + error.message);
    else alert('Resume saved to your profile!');
  }
  if (saveBtn) saveBtn.addEventListener('click', saveResume);
});

// Helper escapeHtml
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}

// ==========================================
// PROFILE PAGE (LOAD SAVED RESUME)
// ==========================================
if (window.location.pathname.includes('resume.html')) {
  const loadData = localStorage.getItem('loadResumeData');
  if (loadData) {
    const resume = JSON.parse(loadData);
    setTimeout(() => {
      const fullName = document.getElementById('fullName');
      if (fullName) {
        fullName.value = `${resume.first_name} ${resume.last_name}`.trim();
        document.getElementById('jobTitle').value = resume.job_title || '';
        document.getElementById('email').value = resume.email || '';
        document.getElementById('phone').value = resume.phone || '';
        document.getElementById('address').value = resume.address || '';
        document.getElementById('summary').value = resume.summary || '';
        document.getElementById('skills').value = resume.skills || '';
        document.getElementById('languages').value = resume.languages || '';
        if (resume.template && document.getElementById('templateSelect')) {
          document.getElementById('templateSelect').value = resume.template;
          if (document.getElementById('previewTemplateSelect')) {
            document.getElementById('previewTemplateSelect').value = resume.template;
          }
        }
        // Load work entries
        const workContainer = document.getElementById('workEntries');
        if (workContainer && resume.experience) {
          workContainer.innerHTML = '';
          const workExp = JSON.parse(resume.experience);
          workExp.forEach(w => {
            const div = document.createElement('div');
            div.className = 'work-entry entry';
            div.innerHTML = `
              <div class="form-row"><div class="form-group"><label>Job Title</label><input type="text" class="job-title" value="${escapeHtml(w.title)}"></div><div class="form-group"><label>Company</label><input type="text" class="company" value="${escapeHtml(w.company)}"></div></div>
              <div class="form-row"><div class="form-group"><label>Start Date</label><input type="text" class="start-date" value="${escapeHtml(w.start)}"></div><div class="form-group"><label>End Date</label><input type="text" class="end-date" value="${escapeHtml(w.end)}"></div></div>
              <div class="form-group"><label>Description</label><textarea class="work-desc" rows="2">${escapeHtml(w.desc)}</textarea></div>
              <button class="remove-entry btn-outline btn-sm">Remove</button>
            `;
            div.querySelector('.remove-entry').addEventListener('click', () => div.remove());
            workContainer.appendChild(div);
          });
        }
        // Load education entries
        const eduContainer = document.getElementById('eduEntries');
        if (eduContainer && resume.education) {
          eduContainer.innerHTML = '';
          const eduExp = JSON.parse(resume.education);
          eduExp.forEach(e => {
            const div = document.createElement('div');
            div.className = 'edu-entry entry';
            div.innerHTML = `
              <div class="form-row"><div class="form-group"><label>Degree</label><input type="text" class="degree" value="${escapeHtml(e.degree)}"></div><div class="form-group"><label>Institution</label><input type="text" class="institution" value="${escapeHtml(e.institution)}"></div></div>
              <div class="form-row"><div class="form-group"><label>Start Year</label><input type="text" class="edu-start" value="${escapeHtml(e.start)}"></div><div class="form-group"><label>End Year</label><input type="text" class="edu-end" value="${escapeHtml(e.end)}"></div></div>
              <button class="remove-entry btn-outline btn-sm">Remove</button>
            `;
            div.querySelector('.remove-entry').addEventListener('click', () => div.remove());
            eduContainer.appendChild(div);
          });
        }
        // Trigger preview update
        const event = new Event('input');
        document.getElementById('fullName').dispatchEvent(event);
      }
      localStorage.removeItem('loadResumeData');
    }, 100);
  }
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