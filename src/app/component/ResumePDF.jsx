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
    padding: 40,
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica'
  },
  header: {
    marginBottom: 30,
    padding: 24,
    backgroundColor: '#1e293b'
  },
  name: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#ffffff'
  },
  contactInfo: {
    fontSize: 11,
    color: '#e2e8f0',
    marginBottom: 4
  },
  section: {
    marginBottom: 20,
    backgroundColor: 'transparent',
    padding: 0
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1e293b'
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#000000'
  },
  itemSubtitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333333'
  },
  dateRange: {
    fontSize: 10,
    color: '#666666',
    marginBottom: 6
  },
  description: {
    fontSize: 10,
    color: '#444444',
    marginBottom: 12,
    lineHeight: 1.5
  },
  twoColumnContainer: {
    flexDirection: 'row'
  },
  leftColumn: {
    flex: 0.45,
  },
  rightColumn: {
    flex: 0.55,
    borderLeftWidth: 2,
    borderLeftColor: '#e2e8f0',
    paddingLeft: 20
  },
  personalInfoItem: {
    fontSize: 10,
    color: '#333333',
    marginBottom: 6,
    lineHeight: 1.4
  }
});

const ResumePDF = ({ formData }) => {
  const skillList = formData.skills
    ? formData.skills.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>
            {formData.personalInfo?.fullName || 'Full Name'}
          </Text>
          <Text style={styles.contactInfo}>
            {formData.personalInfo?.email || 'email@example.com'} • {formData.personalInfo?.phone || '(555) 555-5555'}
          </Text>
          <Text style={styles.contactInfo}>
            {formData.personalInfo?.address || 'Your address here'}
          </Text>
        </View>

        {/* Two Column Layout */}
        <View style={styles.twoColumnContainer}>
          {/* Left Column: Personal Information and Skills */}
          <View style={styles.leftColumn}>
            {/* Personal Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>
              <Text style={styles.personalInfoItem}>
                <Text style={{ fontWeight: 'bold' }}>Name: </Text>
                {formData.personalInfo?.fullName || 'Not provided'}
              </Text>
              <Text style={styles.personalInfoItem}>
                <Text style={{ fontWeight: 'bold' }}>Email: </Text>
                {formData.personalInfo?.email || 'Not provided'}
              </Text>
              <Text style={styles.personalInfoItem}>
                <Text style={{ fontWeight: 'bold' }}>Phone: </Text>
                {formData.personalInfo?.phone || 'Not provided'}
              </Text>
              <Text style={styles.personalInfoItem}>
                <Text style={{ fontWeight: 'bold' }}>Address: </Text>
                {formData.personalInfo?.address || 'Not provided'}
              </Text>
            </View>

            {/* Skills Section */}
            {skillList.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Skills</Text>
                <Text style={styles.description}>{skillList.join(', ')}</Text>
              </View>
            )}
          </View>

          {/* Right Column: Education and Experience */}
          <View style={styles.rightColumn}>
            {/* Education Section */}
            {formData.education && formData.education.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Education</Text>
                {formData.education.map((item, index) => (
                  <View key={index} style={{ marginBottom: 10 }}>
                    <Text style={styles.itemTitle}>{item.degree || 'Degree'}</Text>
                    <Text style={styles.itemSubtitle}>{item.school || 'School'}</Text>
                    {(item.startDate || item.endDate) && (
                      <Text style={styles.dateRange}>
                        {item.startDate || 'Start'} - {item.endDate || 'End'}
                      </Text>
                    )}
                    {item.description && (
                      <Text style={styles.description}>{item.description}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Experience Section */}
            {formData.experience && formData.experience.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Work Experience</Text>
                {formData.experience.map((item, index) => (
                  <View key={index} style={{ marginBottom: 10 }}>
                    <Text style={styles.itemTitle}>{item.role || 'Role'}</Text>
                    <Text style={styles.itemSubtitle}>{item.company || 'Company'}</Text>
                    {(item.startDate || item.endDate) && (
                      <Text style={styles.dateRange}>
                        {item.startDate || 'Start'} - {item.endDate || 'Present'}
                      </Text>
                    )}
                    {item.description && (
                      <Text style={styles.description}>{item.description}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default ResumePDF;