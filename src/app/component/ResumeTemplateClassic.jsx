"use client";

function normalizeSkills(skills) {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills.map((s) => String(s).trim()).filter(Boolean);
  if (typeof skills === "string") return skills.split(",").map((s) => s.trim()).filter(Boolean);
  return [];
}

function fmtDateRange(start, end) {
  const s = start ? String(start) : "";
  const e = end ? String(end) : "";
  if (!s && !e) return "";
  if (s && e) return `${s} - ${e}`;
  return s || e;
}

export default function ResumeTemplateClassic({ data, compact = false }) {
  const personal = data?.personalInfo || {};
  const education = Array.isArray(data?.education) ? data.education : [];
  const experience = Array.isArray(data?.experience) ? data.experience : [];
  const skills = normalizeSkills(data?.skills);

  const eduItems = compact ? education.slice(0, 2) : education;
  const expItems = compact ? experience.slice(0, 2) : experience;
  const skillItems = compact ? skills.slice(0, 10) : skills;

  return (
    <div className={`classic-a4 ${compact ? "classic-compact" : ""}`}>
      <div className="classic-topbar" />

      <header className="classic-header">
        <h1 className="classic-name">{personal.fullName || "YOUR NAME"}</h1>
        <p className="classic-title">{data?.title || "YOUR PROFESSIONAL TITLE"}</p>
      </header>

      <div className="classic-body">
        <aside className="classic-left">
          <section className="classic-section">
            <h3 className="classic-section-heading">CONTACT</h3>
            <div className="classic-contact">
              <div className="classic-contact-item">
                <span className="classic-contact-label">Phone</span>
                <span className="classic-contact-value">{personal.phone || "123-456-7890"}</span>
              </div>
              <div className="classic-contact-item">
                <span className="classic-contact-label">Email</span>
                <span className="classic-contact-value">{personal.email || "youremail@gmail.com"}</span>
              </div>
              <div className="classic-contact-item">
                <span className="classic-contact-label">Address</span>
                <span className="classic-contact-value">{personal.address || "City, State"}</span>
              </div>
            </div>
          </section>

         

          <section className="classic-section">
            <h3 className="classic-section-heading">SKILLS</h3>
            <div className="classic-skills-tags">
              {(skillItems.length ? skillItems : ["Relevant Skill", "Relevant Skill", "Relevant Skill"]).map((s, idx) => (
                <span key={idx} className="classic-skill-tag">{s}</span>
              ))}
            </div>
          </section>
        </aside>

        <main className="classic-right">
        <section className="classic-section">
            <h3 className="classic-section-heading">EDUCATION</h3>
            <div className="classic-edu">
              {eduItems.length ? (
                eduItems.map((e, idx) => (
                  <div key={idx} className="classic-edu-item">
                    <div className="classic-edu-degree">{e.degree || "YOUR DEGREE / MAJOR"}</div>
                    <div className="classic-edu-school">{e.school || "University Name"}</div>
                    <div className="classic-edu-dates">{fmtDateRange(e.startDate, e.endDate) || "2012–2014"}</div>
                    {e.description ? (
                      <p className="classic-paragraph">{String(e.description)}</p>
                    ) : <ul className="classic-bullets">
                    <li>Beginning with a powerful action verb, write up to six responsibilities and/or accomplishments.</li>
                    <li>Highlight your most relevant qualifications for the job by listing them first.</li>
                    <li>Keep descriptions short but add details that show why you're a great candidate.</li>
                  </ul>}
                  </div>
                ))
              ) : (
                <div className="classic-edu-item">
                  <div className="classic-edu-degree">YOUR DEGREE / MAJOR</div>
                  <div className="classic-edu-school">University Name</div>
                  <div className="classic-edu-dates">2012–2014</div>
                  <ul className="classic-bullets">
                    <li>Beginning with a powerful action verb, write up to six responsibilities and/or accomplishments.</li>
                    <li>Highlight your most relevant qualifications for the job by listing them first.</li>
                    <li>Keep descriptions short but add details that show why you're a great candidate.</li>
                  </ul>
                </div>
              )}
            </div>
          </section>

          <section className="classic-section">
            <h3 className="classic-section-heading">PROFESSIONAL EXPERIENCE</h3>
            <div className="classic-exp">
              {expItems.length ? (
                expItems.map((x, idx) => (
                  <div key={idx} className="classic-exp-item">
                    <div className="classic-exp-role">{x.role || "WRITE YOUR JOB TITLE HERE"}</div>
                    <div className="classic-exp-meta">
                      <span className="classic-exp-company">{x.company || "Company Name"}</span>
                      <span className="classic-exp-sep">|</span>
                      <span className="classic-exp-dates">{fmtDateRange(x.startDate, x.endDate) || "Beginning Date–End Date"}</span>
                    </div>
                    {x.description ? (
                      <p className="classic-paragraph">{String(x.description)}</p>
                    ) : (
                      <ul className="classic-bullets">
                        <li>Beginning with a powerful action verb, write up to six responsibilities and/or accomplishments.</li>
                        <li>Highlight your most relevant qualifications for the job by listing them first.</li>
                        <li>Keep descriptions short but add details that show why you're a great candidate.</li>
                      </ul>
                    )}
                  </div>
                ))
              ) : (
                <div className="classic-exp-item">
                  <div className="classic-exp-role">WRITE YOUR JOB TITLE HERE</div>
                  <div className="classic-exp-meta">
                    <span className="classic-exp-company">Company Name</span>
                    <span className="classic-exp-sep">|</span>
                    <span className="classic-exp-dates">Beginning Date–End Date</span>
                  </div>
                  <ul className="classic-bullets">
                    <li>Beginning with a powerful action verb, write up to six responsibilities and/or accomplishments.</li>
                    <li>Highlight your most relevant qualifications for the job by listing them first.</li>
                    <li>Keep descriptions short but add details that show why you're a great candidate.</li>
                  </ul>
                </div>
              )}
            </div>
          </section>
        </main>
      </div>

      <div className="classic-bottombar" />
    </div>
  );
}

