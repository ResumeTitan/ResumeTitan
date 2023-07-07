import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    alignItems: 'center',
    fontFamily: 'Helvetica',
    paddingTop: 30,
    paddingBottom: 60,
    paddingHorizontal: 30,
  },
  section: {
    marginBottom: 10,
  },
  heading: {
    fontSize: 18,
    marginBottom: 10,
  },
  listItem: {
    marginBottom: 5,
  },
});

const ResumePDF = ({ resume }) => (
  <Document>
    <Page size="letter" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading}>Experience</Text>
        {resume.jobs.map((job, index) => (
          <Text key={index} style={styles.listItem}>
            {job.company}, {job.title} ({job.startDate} - {job.endDate})
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Skills</Text>
        {resume.skills.map((skill, index) => (
          <Text key={index} style={styles.listItem}>
            {skill}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Education</Text>
        {resume.schools.map((edu, index) => (
          <Text key={index} style={styles.listItem}>
            {edu.degree}, {edu.name} ({edu.year})
          </Text>
        ))}
      </View>
    </Page>
  </Document>
);

export default ResumePDF;