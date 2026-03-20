#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read the JSON data
const siteDataPath = path.join(__dirname, 'content', 'site-data.json');
const templatePath = path.join(__dirname, '_template.html');
const outputPath = path.join(__dirname, 'index.html');

// Read files
const siteData = JSON.parse(fs.readFileSync(siteDataPath, 'utf-8'));
const template = fs.readFileSync(templatePath, 'utf-8');

// Helper function to escape HTML
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Helper function to convert newline-separated bullets to HTML list
function bulletsToDom(bulletsText) {
  const bullets = bulletsText.split('\n').filter(b => b.trim());
  return bullets.map(b => `<li>${escapeHtml(b.trim())}</li>`).join('\n                            ');
}

// Build hero stats HTML
function buildHeroStats() {
  return siteData.hero.stats.map(stat => `
                    <div class="stat-item">
                        <h3>${escapeHtml(stat.number)}</h3>
                        <p>${escapeHtml(stat.label)}</p>
                    </div>`).join('\n');
}

// Build about cards HTML
function buildAboutCards() {
  return siteData.about.cards.map(card => `
                <div class="about-card reveal">
                    <div class="about-card-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                    </div>
                    <h3>${escapeHtml(card.title)}</h3>
                    <p>${escapeHtml(card.description)}</p>
                </div>`).join('\n');
}

// Build education items HTML
function buildEducationItems() {
  return siteData.education.education_items.map(item => `
                    <div class="edu-item">
                        <h4>${escapeHtml(item.degree)}</h4>
                        <p>${escapeHtml(item.institution)}${item.year ? ' • ' + escapeHtml(item.year) : ''}</p>
                        ${item.detail ? `<p class="edu-detail">${escapeHtml(item.detail)}</p>` : ''}
                    </div>`).join('\n');
}

// Build community items HTML
function buildCommunityItems() {
  return siteData.education.community_items.map(item => `
                    <div class="edu-item">
                        <h4>${escapeHtml(item.title)}</h4>
                        <p>${escapeHtml(item.organization)}</p>
                    </div>`).join('\n');
}

// Build experience timeline HTML
function buildExperience() {
  return siteData.experience.map(role => {
    const tags = role.tags.split(',').map(t => `<span class="timeline-tag">${escapeHtml(t.trim())}</span>`).join('\n                            ');
    const bullets = bulletsToDom(role.description);
    return `
                <div class="timeline-item reveal">
                    <div class="timeline-dot"></div>
                    <div class="timeline-card">
                        <span class="timeline-date">${escapeHtml(role.date)}</span>
                        <h3 class="timeline-role">${escapeHtml(role.title)}</h3>
                        <div class="timeline-company">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>
                            ${escapeHtml(role.company)}
                        </div>
                        <ul class="timeline-bullets">
                            ${bullets}
                        </ul>
                        <div class="timeline-tags">
                            ${tags}
                        </div>
                    </div>
                </div>`;
  }).join('\n');
}

// Build projects HTML
function buildProjects() {
  return siteData.projects.map((project, idx) => {
    const tags = project.tags.split(',').map(t => `<span class="project-tag">${escapeHtml(t.trim())}</span>`).join('\n                    ');
    const isActive = idx === 0 ? ' active' : '';
    return `
                <div class="project-card${isActive}" data-project="${idx}">
                    <div class="project-header">
                        <div class="project-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                        </div>
                        <span class="project-category">${escapeHtml(project.category)}</span>
                    </div>
                    <h3 class="project-name">${escapeHtml(project.name)}</h3>
                    <p class="project-section-label">CHALLENGE</p>
                    <p class="project-section-text">${escapeHtml(project.challenge)}</p>
                    <p class="project-section-label">APPROACH</p>
                    <p class="project-section-text">${escapeHtml(project.approach)}</p>
                    <p class="project-section-label">OUTCOME</p>
                    <p class="project-section-text">${escapeHtml(project.outcome)}</p>
                    <hr class="project-divider">
                    <div class="project-tags">
                        ${tags}
                    </div>
                </div>`;
  }).join('\n');
}

// Build skills HTML
function buildSkills() {
  return siteData.skills.map(skill => {
    const tags = skill.tags.split(',').map(t => `<span class="skill-tag">${escapeHtml(t.trim())}</span>`).join('\n                        ');
    return `
                <div class="skill-card reveal">
                    <h3>${escapeHtml(skill.name)}</h3>
                    <div class="skill-tags">
                        ${tags}
                    </div>
                </div>`;
  }).join('\n');
}

// Build testimonials HTML
function buildTestimonials() {
  return siteData.testimonials.map(testimonial => `
                <div class="testimonial-card reveal">
                    <div class="testimonial-quote-icon">&ldquo;</div>
                    <p class="testimonial-text">${escapeHtml(testimonial.quote)}</p>
                    <div class="testimonial-author">
                        <div class="testimonial-avatar">
                            ${escapeHtml(testimonial.initials)}
                        </div>
                        <div class="testimonial-author-info">
                            <h4>${escapeHtml(testimonial.author_name)}</h4>
                            <p>${escapeHtml(testimonial.author_title)}</p>
                            <span class="testimonial-relationship">${escapeHtml(testimonial.relationship)}</span>
                            <div class="testimonial-linkedin-badge">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                                LinkedIn Recommendation
                            </div>
                        </div>
                    </div>
                </div>`).join('\n');
}

// Perform all replacements
let html = template;

// Hero section
html = html.replace('{{hero.tagline}}', escapeHtml(siteData.hero.tagline));
html = html.replace('{{hero.name}}', escapeHtml(siteData.hero.name));
html = html.replace('{{hero.title}}', escapeHtml(siteData.hero.title));
html = html.replace('{{hero.bio}}', escapeHtml(siteData.hero.bio));
html = html.replace('{{hero.stats}}', buildHeroStats());

// About section
html = html.replace('{{about.heading}}', escapeHtml(siteData.about.heading));
html = html.replace('{{about.heading_accent}}', escapeHtml(siteData.about.heading_accent));
html = html.replace('{{about.subtitle}}', escapeHtml(siteData.about.subtitle));
html = html.replace('{{about.cards}}', buildAboutCards());

// Education section
html = html.replace('{{education.items}}', buildEducationItems());
html = html.replace('{{education.community}}', buildCommunityItems());

// Experience section
html = html.replace('{{experience.timeline}}', buildExperience());

// Projects section
html = html.replace('{{projects.list}}', buildProjects());

// Skills section
html = html.replace('{{skills.cards}}', buildSkills());

// Testimonials section
html = html.replace('{{testimonials.list}}', buildTestimonials());

// Contact section
html = html.replace('{{contact.heading}}', escapeHtml(siteData.contact.heading));
html = html.replace('{{contact.subtitle}}', escapeHtml(siteData.contact.subtitle));
html = html.replace('{{contact.email}}', escapeHtml(siteData.contact.email));
html = html.replace('{{contact.location}}', escapeHtml(siteData.contact.location));

// General settings
html = html.replace('{{general.site_title}}', escapeHtml(siteData.general.site_title));
html = html.replace('{{general.meta_description}}', escapeHtml(siteData.general.meta_description));
html = html.replace('{{general.linkedin_url}}', escapeHtml(siteData.general.linkedin_url));

// Write output
fs.writeFileSync(outputPath, html, 'utf-8');
console.log(`✓ Built index.html from site-data.json`);
