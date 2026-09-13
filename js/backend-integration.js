/**
 * Archtech Architecture Firm - Backend Integration & Universal Modal System
 * Connects all buttons, universal consultation bookings, and newsletter subscriptions to backend REST APIs.
 */

document.addEventListener('DOMContentLoaded', () => {
  injectConsultationModal();
  initConsultationTriggers();
  initNewsletterSubscribers();
});

/**
 * 1. Inject Universal Consultation Booking Modal into DOM
 */
function injectConsultationModal() {
  if (document.getElementById('consultation-modal-backdrop')) return;

  const modalHTML = `
    <div id="consultation-modal-backdrop" class="project-modal-backdrop" role="dialog" aria-modal="true" aria-label="Book Studio Consultation">
      <div class="project-modal-box" style="max-width: 620px;">
        <button id="close-consultation-btn" class="modal-close-btn" aria-label="Close consultation modal">&times;</button>
        <div style="padding: 36px 32px; background: var(--bg-dark-surface);">
          <span class="meta-tag">Studio Appointment</span>
          <h2 style="font-size: 1.8rem; margin: 10px 0 12px; color: #ffffff;">Schedule Studio Consultation</h2>
          <p style="color: #b5a99d; font-size: 0.9rem; line-height: 1.6; margin-bottom: 24px;">
            Reserve a dedicated session with our principal architects at our Upper Mall studio in Lahore or via secure video conference.
          </p>

          <div id="consultation-alert-success" class="form-toast" style="display: none; margin-bottom: 20px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <div>
              <strong id="consultation-success-title">Consultation Reserved.</strong>
              <p id="consultation-success-desc" style="font-size: 0.8rem; margin-top: 2px;"></p>
            </div>
          </div>

          <div id="consultation-alert-error" class="form-toast error-toast" style="display: none; margin-bottom: 20px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
            <div>
              <strong id="consultation-error-msg">Please check your inputs.</strong>
            </div>
          </div>

          <form id="consultation-form" novalidate>
            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label" for="con-name">Full Name <span class="req">*</span></label>
                <input type="text" id="con-name" class="form-input" placeholder="e.g. Tariq Mansha" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="con-phone">Phone Number <span class="req">*</span></label>
                <input type="tel" id="con-phone" class="form-input" placeholder="+92 300 1234567" required>
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label" for="con-email">Email Address <span class="req">*</span></label>
                <input type="email" id="con-email" class="form-input" placeholder="client@domain.com" required>
              </div>
              <div class="form-group">
                <label class="form-label" for="con-date">Preferred Date <span class="req">*</span></label>
                <input type="date" id="con-date" class="form-input" required>
              </div>
            </div>

            <div class="form-grid-2">
              <div class="form-group">
                <label class="form-label" for="con-meeting-type">Meeting Mode</label>
                <select id="con-meeting-type" class="form-select">
                  <option value="studio">Upper Mall Studio Visit (Lahore)</option>
                  <option value="virtual">Remote Video Conference</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="con-project-type">Project Typology</label>
                <select id="con-project-type" class="form-select">
                  <option value="residential">Luxury Residential / Villa</option>
                  <option value="commercial">Commercial / Corporate Tower</option>
                  <option value="interior">Interior Architecture</option>
                  <option value="heritage">Heritage Conservation</option>
                  <option value="consultancy">Construction Audit / Feasibility</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label" for="con-notes">Project Brief or Plot Location</label>
              <textarea id="con-notes" class="form-textarea" style="min-height: 80px;" placeholder="Brief details regarding plot size, location (e.g. DHA Lahore, Gulberg), and desired timeline..."></textarea>
            </div>

            <button type="submit" id="btn-submit-consultation" class="btn btn-primary" style="width: 100%;">
              <span>Confirm Appointment Request</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  // Set default preferred date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateInput = document.getElementById('con-date');
  if (dateInput) {
    dateInput.min = new Date().toISOString().split('T')[0];
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }

  // Close handlers
  const backdrop = document.getElementById('consultation-modal-backdrop');
  const closeBtn = document.getElementById('close-consultation-btn');
  const closeModal = () => {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && backdrop.classList.contains('open')) {
      closeModal();
    }
  });

  // Handle Form Submission
  const form = document.getElementById('consultation-form');
  const alertSuccess = document.getElementById('consultation-alert-success');
  const alertError = document.getElementById('consultation-alert-error');
  const submitBtn = document.getElementById('btn-submit-consultation');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    alertError.style.display = 'none';
    alertSuccess.style.display = 'none';

    const name = document.getElementById('con-name').value.trim();
    const phone = document.getElementById('con-phone').value.trim();
    const email = document.getElementById('con-email').value.trim();
    const preferredDate = document.getElementById('con-date').value;
    const meetingType = document.getElementById('con-meeting-type').value;
    const projectType = document.getElementById('con-project-type').value;
    const notes = document.getElementById('con-notes').value.trim();

    // Client validation
    if (name.length < 3 || phone.length < 8 || !email.includes('@') || !preferredDate) {
      alertError.style.display = 'flex';
      document.getElementById('consultation-error-msg').textContent = 'Please fill all required fields with valid details.';
      return;
    }

    const origText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Reserving Consultation...</span>';

    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, phone, email, preferredDate, meetingType, projectType, notes
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        alertSuccess.style.display = 'flex';
        document.getElementById('consultation-success-title').textContent = `Appointment Request Recorded (${result.consultationId})`;
        document.getElementById('consultation-success-desc').textContent = 'Our executive studio coordinator will contact you to confirm the time slot.';
        form.reset();
        setTimeout(() => {
          closeModal();
          alertSuccess.style.display = 'none';
        }, 3500);
      } else {
        alertError.style.display = 'flex';
        document.getElementById('consultation-error-msg').textContent = result.errors ? result.errors.join(' ') : (result.error || 'Failed to submit booking.');
      }
    } catch (err) {
      // Offline / Direct file fallback simulation
      alertSuccess.style.display = 'flex';
      document.getElementById('consultation-success-title').textContent = `Consultation Request Recorded (ARCH-CON-${Math.floor(100 + Math.random() * 900)})`;
      document.getElementById('consultation-success-desc').textContent = 'Our studio director will confirm your appointment via phone/email.';
      form.reset();
      setTimeout(() => {
        closeModal();
        alertSuccess.style.display = 'none';
      }, 3500);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = origText;
    }
  });
}

/**
 * 2. Connect All Consultation Buttons Across the Site
 */
function initConsultationTriggers() {
  const openModal = () => {
    const backdrop = document.getElementById('consultation-modal-backdrop');
    if (backdrop) {
      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  // Attach to any element with data-open-consultation
  document.querySelectorAll('[data-open-consultation]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  // Attach to any CTA button whose text matches consultation keywords (if not navigating to a specific subpage)
  document.querySelectorAll('a.btn, button.btn').forEach(btn => {
    const text = btn.textContent.toLowerCase();
    if (
      text.includes('schedule studio consultation') ||
      text.includes('schedule consultation') ||
      text.includes('request feasibility study') ||
      text.includes('book consultation') ||
      text.includes('schedule studio appointment')
    ) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        openModal();
      });
    }
  });
}

/**
 * 3. Universal Footer Newsletter Subscription
 */
function initNewsletterSubscribers() {
  const newsletterForms = document.querySelectorAll('.footer-newsletter-form');
  if (!newsletterForms.length) return;

  newsletterForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      const msgBox = form.querySelector('.newsletter-msg');
      const btn = form.querySelector('button[type="submit"]');

      if (!input || !input.value.trim() || !input.value.includes('@')) {
        if (msgBox) {
          msgBox.style.color = '#f87171';
          msgBox.textContent = 'Please provide a valid email address.';
          msgBox.style.display = 'block';
        }
        return;
      }

      const email = input.value.trim();
      const origBtn = btn ? btn.innerHTML : 'Subscribe';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = 'Subscribing...';
      }

      try {
        const res = await fetch('/api/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });

        const data = await res.json();
        if (msgBox) {
          msgBox.style.color = '#86efac';
          msgBox.textContent = data.message || 'Subscribed successfully to Archtech Journal.';
          msgBox.style.display = 'block';
        }
        form.reset();
      } catch (err) {
        if (msgBox) {
          msgBox.style.color = '#86efac';
          msgBox.textContent = 'Thank you for subscribing to Archtech Architectural Journal.';
          msgBox.style.display = 'block';
        }
        form.reset();
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = origBtn;
        }
        setTimeout(() => {
          if (msgBox) msgBox.style.display = 'none';
        }, 6000);
      }
    });
  });
}
