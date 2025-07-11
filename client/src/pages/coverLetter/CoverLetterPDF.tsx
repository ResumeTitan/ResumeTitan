import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { CoverLetterType } from 'types/types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Times-Roman',
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  info: {
    marginBottom: 2,
  },
  body: {
    marginTop: 16,
    lineHeight: 1.5,
  },
  paragraph: {
    marginBottom: 12,
  }
});

interface CoverLetterPDFProps {
  coverLetter: CoverLetterType;
}

const CoverLetterPDF: React.FC<CoverLetterPDFProps> = ({ coverLetter }) => (
  <Document>
    <Page size="LETTER" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.name}>{coverLetter.name}</Text>
        <Text style={styles.info}>{coverLetter.city}, {coverLetter.state}</Text>
        <Text style={styles.info}>{new Date(coverLetter.date).toDateString()}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.info}>{coverLetter.jobTitle}</Text>
        <Text style={styles.info}>{coverLetter.company}</Text>
      </View>
      <View style={styles.body}>
        {coverLetter.letter
          .split(/\r?\n/) // Split on all line breaks for paragraphs
          .map((paragraph: string, pIdx: number) => (
            <Text key={pIdx} style={styles.paragraph}>
              {paragraph.replace(/\r?\n/g, ' ')}
            </Text>
          ))}
      </View>
    </Page>
  </Document>
);

export default CoverLetterPDF; 