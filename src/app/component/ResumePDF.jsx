import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { COLORS } from '@/app/styles/design-tokens';
import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT } from '@/app/styles/typography';

// Register fonts (optional - for better appearance)
Font.register({
  family: FONT_FAMILY.sans,
  fonts: [
    { src: 'https://fonts.gstatic.com/s/opensans/v36/memvYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-mu0SC55I.woff2' }
  ]
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    backgroundColor: COLORS.white,
    fontFamily: FONT_FAMILY.sans,
  },
  topBar: {
    height: 10,
    backgroundColor: COLORS.slate900,
  },
  bottomBar: {
    height: 10,
    backgroundColor: COLORS.slate900,
  },
  header: {
    paddingTop: 26,
    paddingBottom: 16,
    paddingHorizontal: 42,
    alignItems: 'center',
    textAlign: 'center',
  },
  name: {
    fontSize: FONT_SIZE.xl,
    fontWeight: FONT_WEIGHT.bold,
    letterSpacing: 4,
    color: COLORS.slate900,
  },
  title: {
    marginTop: 10,
    fontSize: FONT_SIZE.md,
    letterSpacing: 2.5,
    color: COLORS.slate600Alt,
    textTransform: 'uppercase',
  },
  body: {
    flexDirection: 'row',
    paddingHorizontal: 42,
    paddingBottom: 20,
    paddingTop: 40,
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
    fontSize: FONT_SIZE.sm,
    letterSpacing: 2.8,
    color: COLORS.slate700,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  contactLabel: {
    fontSize: FONT_SIZE.xs,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
    color: COLORS.slate500Alt,
    marginBottom: 2,
  },
  contactValue: {
    fontSize: FONT_SIZE.md,
    color: COLORS.slate900,
    marginBottom: 8,
  },
  eduDegree: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.bold,
    color: COLORS.slate900,
  },
  eduSchool: {
    marginTop: 2,
    fontSize: FONT_SIZE.md,
    color: COLORS.slate700,
  },
  eduDates: {
    marginTop: 2,
    fontSize: FONT_SIZE.sm,
    color: COLORS.slate500Alt,
  },
  paragraph: {
    fontSize: FONT_SIZE.md,
    color: COLORS.slate700,
    lineHeight: 1.5,
  },
  eduDescription: {
    marginTop: 6,
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.normal,
    color: COLORS.slate700,
    lineHeight: 1.4,
  },
  bullets: {
    marginTop: 6,
    paddingLeft: 10,
    gap: 4,
  },
  bullet: {
    fontSize: FONT_SIZE.md,
    color: COLORS.slate700,
    lineHeight: 1.35,
  },
  expRole: {
    fontSize: FONT_SIZE.md,
    fontWeight: FONT_WEIGHT.extraBold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: COLORS.slate900,
  },
  expMeta: {
    marginTop: 3,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  expMetaText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.slate500Alt,
  },
  skillsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skill: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 999,
    backgroundColor: '#f8fafc',
    fontSize: FONT_SIZE.xs,
    lineHeight: 1.2,
    color: COLORS.slate700,
    marginRight: 6,
    marginBottom: 6,
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
              <Text style={styles.sectionHeading}>SKILLS</Text>
              <View style={styles.skillsList}>
                {(skillList.length ? skillList.slice(0, 14) : ['Relevant Skill', 'Relevant Skill', 'Relevant Skill']).map(
                  (s, idx) => (
                    <Text key={idx} style={styles.skill}>
                      {s}
                    </Text>
                  )
                )}
              </View>
            </View>
          </View>

          <View style={styles.right}>
          <View style={styles.section}>
              <Text style={styles.sectionHeading}>EDUCATION</Text>
              {(education.length ? education.slice(0, 3) : [{ degree: '', school: '', startDate: '', endDate: '' }]).map(
                (e, idx) => (
                  <View key={idx} style={{ marginBottom: 10 }}>
                    <Text style={styles.eduDegree}>{e.degree || 'YOUR DEGREE / MAJOR'}</Text>
                    <Text style={styles.eduSchool}>{e.school || 'University Name'}</Text>
                    <Text style={styles.eduDates}>{fmtDateRange(e.startDate, e.endDate) || '2012–2014'}</Text>
                    {e.description ? (
                    <Text style={styles.eduDescription}>{String(e.description)}</Text>
                  ) : (
                    <View style={styles.bullets}>
                      <Text style={styles.bullet}>• Beginning with a powerful action verb, write up to six responsibilities and/or accomplishments.</Text>
                      <Text style={styles.bullet}>• Highlight your most relevant qualifications for the job by listing them first.</Text>
                      <Text style={styles.bullet}>• Keep descriptions short but add details that show why you're a great candidate.</Text>
                    </View>
                  )}
                  </View>
                )
              )}
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