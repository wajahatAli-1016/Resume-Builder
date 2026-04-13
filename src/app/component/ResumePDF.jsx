import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts (optional - for better appearance)
Font.register({
  family: 'Helvetica',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/opensans/v36/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-mu0SC55I.woff2' }
  ]
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  topBar: {
    height: 10,
    backgroundColor: '#0f172a',
  },
  bottomBar: {
    height: 10,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingTop: 26,
    paddingBottom: 16,
    paddingHorizontal: 42,
    alignItems: 'center',
    textAlign: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: 700,
    letterSpacing: 4,
    color: '#0f172a',
  },
  title: {
    marginTop: 10,
    fontSize: 10,
    letterSpacing: 2.5,
    color: '#475569',
    textTransform: 'uppercase',
  },
  body: {
    flexDirection: 'row',
    paddingHorizontal: 42,
    paddingBottom: 20,
    gap: 22,
    flex: 1,
  },
  left: {
    width: 220,
    paddingRight: 10,
  },
  right: {
    flex: 1,
    paddingLeft: 10,
  },
  section: {
    marginTop: 12,
  },
  sectionHeading: {
    fontSize: 9,
    letterSpacing: 2.8,
    color: '#334155',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  contactLabel: {
    fontSize: 8,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: '#64748b',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 10,
    color: '#0f172a',
    marginBottom: 8,
  },
  eduDegree: {
    fontSize: 10,
    fontWeight: 700,
    color: '#0f172a',
  },
  eduSchool: {
    marginTop: 2,
    fontSize: 10,
    color: '#334155',
  },
  eduDates: {
    marginTop: 2,
    fontSize: 9,
    color: '#64748b',
  },
  paragraph: {
    fontSize: 10,
    color: '#334155',
    lineHeight: 1.5,
  },
  bullets: {
    marginTop: 6,
    paddingLeft: 10,
    gap: 4,
  },
  bullet: {
    fontSize: 10,
    color: '#334155',
    lineHeight: 1.35,
  },
  expRole: {
    fontSize: 10,
    fontWeight: 800,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: '#0f172a',
  },
  expMeta: {
    marginTop: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  expMetaText: {
    fontSize: 9,
    color: '#64748b',
  },
  skillsList: {
    paddingLeft: 10,
    gap: 4,
  },
  skill: {
    fontSize: 10,
    color: '#334155',
    lineHeight: 1.25,
  },
});

function normalizeSkills(skills) {
  if (!skills) return [];
  if (Array.isArray(skills)) return skills.map((s) => String(s).trim()).filter(Boolean);
  if (typeof skills === 'string') return skills.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
}

function fmtDateRange(start, end) {
  const s = start ? String(start) : '';
  const e = end ? String(end) : '';
  if (!s && !e) return '';
  if (s && e) return `${s} - ${e}`;
  return s || e;
}

const ResumePDF = ({ formData }) => {
  const personal = formData?.personalInfo || {};
  const education = Array.isArray(formData?.education) ? formData.education : [];
  const experience = Array.isArray(formData?.experience) ? formData.experience : [];
  const skillList = normalizeSkills(formData?.skills);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar} />

        <View style={styles.header}>
          <Text style={styles.name}>{personal.fullName || 'YOUR NAME'}</Text>
          <Text style={styles.title}>{formData?.title || 'YOUR PROFESSIONAL TITLE'}</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.left}>
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>CONTACT</Text>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>{personal.phone || '123-456-7890'}</Text>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{personal.email || 'youremail@gmail.com'}</Text>
              <Text style={styles.contactLabel}>Address</Text>
              <Text style={styles.contactValue}>{personal.address || 'City, State'}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeading}>EDUCATION</Text>
              {(education.length ? education.slice(0, 3) : [{ degree: '', school: '', startDate: '', endDate: '' }]).map(
                (e, idx) => (
                  <View key={idx} style={{ marginBottom: 10 }}>
                    <Text style={styles.eduDegree}>{e.degree || 'YOUR DEGREE / MAJOR'}</Text>
                    <Text style={styles.eduSchool}>{e.school || 'University Name'}</Text>
                    <Text style={styles.eduDates}>{fmtDateRange(e.startDate, e.endDate) || '2012–2014'}</Text>
                  </View>
                )
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeading}>SKILLS</Text>
              <View style={styles.skillsList}>
                {(skillList.length ? skillList.slice(0, 14) : ['Relevant Skill', 'Relevant Skill', 'Relevant Skill']).map(
                  (s, idx) => (
                    <Text key={idx} style={styles.skill}>
                      • {s}
                    </Text>
                  )
                )}
              </View>
            </View>
          </View>

          <View style={styles.right}>
            <View style={styles.section}>
              <Text style={styles.sectionHeading}>PROFILE</Text>
              <Text style={styles.paragraph}>
                {formData?.summary ||
                  'Write a powerful performance summary here. Highlight your most valuable skills, qualifications, achievements, credentials, and the distinguishing information as it relates to and supports your career objective.'}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionHeading}>PROFESSIONAL EXPERIENCE</Text>
              {(experience.length ? experience.slice(0, 4) : [{}]).map((x, idx) => (
                <View key={idx} style={{ marginBottom: 12 }}>
                  <Text style={styles.expRole}>{x.role || 'WRITE YOUR JOB TITLE HERE'}</Text>
                  <View style={styles.expMeta}>
                    <Text style={styles.expMetaText}>{x.company || 'Company Name'}</Text>
                    <Text style={styles.expMetaText}>|</Text>
                    <Text style={styles.expMetaText}>{fmtDateRange(x.startDate, x.endDate) || 'Beginning Date–End Date'}</Text>
                  </View>
                  {x.description ? (
                    <Text style={[styles.paragraph, { marginTop: 6 }]}>{String(x.description)}</Text>
                  ) : (
                    <View style={styles.bullets}>
                      <Text style={styles.bullet}>• Beginning with a powerful action verb, write up to six responsibilities and/or accomplishments.</Text>
                      <Text style={styles.bullet}>• Highlight your most relevant qualifications for the job by listing them first.</Text>
                      <Text style={styles.bullet}>• Keep descriptions short but add details that show why you're a great candidate.</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.bottomBar} />
      </Page>
    </Document>
  );
};

export default ResumePDF;