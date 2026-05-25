// ==========================================
// SUPABASE INITIALIZATION (unchanged)
// ==========================================
const SUPABASE_URL = 'https://pfqpyzfqwsksepoohive.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBmcXB5emZxd3Nrc2Vwb29oaXZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQzNzM1MTMsImV4cCI6MjA4OTk0OTUxM30.NPbcOFUPS_2zYg-2MjH1ukHrHqN8AjXRDrP1OpU4nNs';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Dark mode, back to top, ribbon, stats, profile functions – keep from previous version
// (In your actual file, keep all the existing code for these features)

// ==========================================
// MULTI-STEP RESUME BUILDER (NEW)
// ==========================================
document.addEventListener('DOMContentLoaded', function() {
  // Only initialize if we are on the resume page (presence of .builder-container)
  const builderContainer = document.querySelector('.builder-container');
  if (!builderContainer) return;

  // ---------- DOM elements ----------
  const steps = document.querySelectorAll('.step');
  const stepContents = document.querySelectorAll('.step-content');
  const nextBtns = document.querySelectorAll('.next-btn');
  const prevBtns = document.querySelectorAll('.prev-btn');

  // Step navigation
  function showStep(stepNumber) {
    stepContents.forEach(content => content.classList.remove('active'));
    document.querySelector(`.step-content[data-step="${stepNumber}"]`).classList.add('active');
    steps.forEach(step => {
      const stepNum = parseInt(step.getAttribute('data-step'));
      if (stepNum === stepNumber) step.classList.add('active');
      else step.classList.remove('active');
    });
  }

  steps.forEach(step => {
    step.addEventListener('click', () => {
      const stepNum = parseInt(step.getAttribute('data-step'));
      showStep(stepNum);
    });
  });
  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentStep = document.querySelector('.step-content.active').getAttribute('data-step');
      showStep(parseInt(currentStep) + 1);
    });
  });
  prevBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentStep = document.querySelector('.step-content.active').getAttribute('data-step');
      showStep(parseInt(currentStep) - 1);
    });
  });

  // Dynamic Work Experience
  const workContainer = document.getElementById('workEntries');
  const addWorkBtn = document.getElementById('addWorkBtn');
  function addWorkEntry(data = {}) {
    const div = document.createElement('div');
    div.className = 'work-entry entry';
    div.innerHTML = `
      <div class="form-row"><div class="form-group"><label>Job Title</label><input type="text" class="job-title" value="${escapeHtml(data.title || '')}" placeholder="e.g., Frontend Developer"></div><div class="form-group"><label>Company</label><input type="text" class="company" value="${escapeHtml(data.company || '')}" placeholder="Company name"></div></div>
      <div class="form-row"><div class="form-group"><label>Start Date</label><input type="text" class="start-date" value="${escapeHtml(data.start || '')}" placeholder="MM/YYYY"></div><div class="form-group"><label>End Date</label><input type="text" class="end-date" value="${escapeHtml(data.end || '')}" placeholder="Present or MM/YYYY"></div></div>
      <div class="form-group"><label>Description</label><textarea class="work-desc" rows="2" placeholder="Key responsibilities and achievements...">${escapeHtml(data.desc || '')}</textarea></div>
      <button class="remove-entry btn-outline btn-sm">Remove</button>
    `;
    div.querySelector('.remove-entry').addEventListener('click', () => div.remove());
    workContainer.appendChild(div);
  }
  if (addWorkBtn) addWorkBtn.addEventListener('click', () => addWorkEntry());
  // Initialize with one empty entry if none exist
  if (workContainer && workContainer.children.length === 0) addWorkEntry();

  // Dynamic Education
  const eduContainer = document.getElementById('eduEntries');
  const addEduBtn = document.getElementById('addEduBtn');
  function addEduEntry(data = {}) {
    const div = document.createElement('div');
    div.className = 'edu-entry entry';
    div.innerHTML = `
      <div class="form-row"><div class="form-group"><label>Degree</label><input type="text" class="degree" value="${escapeHtml(data.degree || '')}" placeholder="e.g., BSc Computer Science"></div><div class="form-group"><label>Institution</label><input type="text" class="institution" value="${escapeHtml(data.institution || '')}" placeholder="University name"></div></div>
      <div class="form-row"><div class="form-group"><label>Start Year</label><input type="text" class="edu-start" value="${escapeHtml(data.start || '')}" placeholder="YYYY"></div><div class="form-group"><label>End Year</label><input type="text" class="edu-end" value="${escapeHtml(data.end || '')}" placeholder="YYYY"></div></div>
      <button class="remove-entry btn-outline btn-sm">Remove</button>
    `;
    div.querySelector('.remove-entry').addEventListener('click', () => div.remove());
    eduContainer.appendChild(div);
  }
  if (addEduBtn) addEduBtn.addEventListener('click', () => addEduEntry());
  if (eduContainer && eduContainer.children.length === 0) addEduEntry();

  // Template switching & preview
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
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  const saveResumeBtn = document.getElementById('saveResumeBtn');

  // Helper: collect work entries
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

  // Template rendering functions (simplified but professional)
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
  // Classic and Executive templates (similar structure, different styling)
  function renderClassic(data) { /* similar but classic style */ return renderModern(data).replace('background:#014656', 'background:#2c3e50'); }
  function renderExecutive(data) { /* executive style with gold accents */ return renderModern(data).replace('#014656', '#1a1a2e').replace('#00a2ad', '#f6a801'); }

  function updatePreview() {
    const work = getWorkEntries();
    const edu = getEduEntries();
    const selectedTemplate = previewTemplateSelect.value;
    const data = {
      fullName: fullName.value,
      jobTitle: jobTitle.value,
      email: email.value,
      phone: phone.value,
      address: address.value,
      summary: summary.value,
      skills: skills.value,
      languages: languages.value,
      work, edu
    };
    let html = '';
    if (selectedTemplate === 'modern') html = renderModern(data);
    else if (selectedTemplate === 'classic') html = renderClassic(data);
    else html = renderExecutive(data);
    resumePreview.innerHTML = html;
  }

  // Sync template selects
  function syncTemplates() {
    if (templateSelect) previewTemplateSelect.value = templateSelect.value;
    updatePreview();
  }
  if (templateSelect) templateSelect.addEventListener('change', () => { previewTemplateSelect.value = templateSelect.value; updatePreview(); });
  if (previewTemplateSelect) previewTemplateSelect.addEventListener('change', () => { if(templateSelect) templateSelect.value = previewTemplateSelect.value; updatePreview(); });

  // Attach input listeners to all form fields
  const allInputs = [fullName, jobTitle, email, phone, address, summary, skills, languages];
  allInputs.forEach(inp => inp?.addEventListener('input', updatePreview));
  // Also listen for dynamic changes – we'll call updatePreview after adding/removing entries
  function observeDynamicEntries() {
    const observer = new MutationObserver(() => updatePreview());
    if (workContainer) observer.observe(workContainer, { childList: true, subtree: true, attributes: true });
    if (eduContainer) observer.observe(eduContainer, { childList: true, subtree: true, attributes: true });
  }
  observeDynamicEntries();
  updatePreview();

  // PDF Download using html2pdf
  async function downloadPDF() {
    const element = resumePreview;
    if (!element) return;
    try {
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
  if (downloadPdfBtn) downloadPdfBtn.addEventListener('click', downloadPDF);

  // Save to Supabase (build data object)
  async function saveResume() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Please sign in on the Profile page first.');
      return;
    }
    const work = getWorkEntries();
    const edu = getEduEntries();
    const resumeData = {
      user_id: user.id,
      full_name: fullName.value,
      job_title: jobTitle.value,
      email: email.value,
      phone: phone.value,
      address: address.value,
      summary: summary.value,
      skills: skills.value,
      languages: languages.value,
      work_experience: JSON.stringify(work),
      education: JSON.stringify(edu),
      template: previewTemplateSelect.value,
      created_at: new Date().toISOString()
    };
    // Note: we need to adjust the resumes table columns to match this structure, or map to existing columns.
    // For simplicity, we'll store the data in a new table 'resumes_v2' or adapt existing.
    // Here we assume you have a table 'resumes' with columns: user_id, full_name, job_title, etc. Adjust accordingly.
    const { error } = await supabase.from('resumes').insert([{
      user_id: resumeData.user_id,
      first_name: resumeData.full_name.split(' ')[0] || '',
      last_name: resumeData.full_name.split(' ').slice(1).join(' ') || '',
      job_title: resumeData.job_title,
      phone: resumeData.phone,
      email: resumeData.email,
      address: resumeData.address,
      summary: resumeData.summary,
      skills: resumeData.skills,
      languages: resumeData.languages,
      experience: JSON.stringify(resumeData.work_experience),
      education: JSON.stringify(resumeData.education),
      template: resumeData.template,
      created_at: resumeData.created_at
    }]);
    if (error) alert('Save failed: ' + error.message);
    else alert('Resume saved to your profile!');
  }
  if (saveResumeBtn) saveResumeBtn.addEventListener('click', saveResume);
});

// Helper escapeHtml (already defined elsewhere – ensure it exists)
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>]/g, function(m) {
    if (m === '&') return '&amp;';
    if (m === '<') return '&lt;';
    if (m === '>') return '&gt;';
    return m;
  });
}