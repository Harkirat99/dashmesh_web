import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 10,
  },
  companyName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  companyAddress: {
    fontSize: 10,
  },
  section: {
    marginBottom: 10,
    borderBottom: 1,
    paddingBottom: 5,
  },
  billInfo: {
    marginTop: 10,
    marginBottom: 10,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e6e6e6',
    border: '1 solid #000',
  },
  tableRow: {
    flexDirection: 'row',
    borderLeft: '1 solid #000',
    borderRight: '1 solid #000',
    borderBottom: '1 solid #000',
  },
  cell: {
    padding: 5,
    flex: 1,
    textAlign: 'center',
  },
  total: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 12,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    fontSize: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  website: {
    textAlign: 'center',
    fontSize: 10,
    marginTop: 10,
  }
});

const InvoicePDF = () => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.companyName}>Dashmesh Trading Company</Text>
        <Text style={styles.companyAddress}>Oop. New Grain Market Assandh</Text>
      </View>

      <View style={styles.section}>
        <Text><Text style={{ fontWeight: 'bold' }}>Bill To:</Text> Harmeet Singh</Text>
        <Text><Text style={{ fontWeight: 'bold' }}>Issue Date:</Text> 06-05-2025</Text>
      </View>

      {/* Table Header */}
      <View style={styles.tableHeader}>
        <Text style={styles.cell}>Date</Text>
        <Text style={styles.cell}>Name</Text>
        <Text style={styles.cell}>Credit</Text>
        <Text style={styles.cell}>Balance</Text>
      </View>

      {/* Table Row */}
      <View style={styles.tableRow}>
        <Text style={styles.cell}>6-05-2025</Text>
        <Text style={styles.cell}>Opening Balance: 5500</Text>
        <Text style={styles.cell}> </Text>
        <Text style={styles.cell}>5500</Text>
      </View>

      {/* Total Due */}
      <View style={styles.total}>
        <Text>Total Due Amount</Text>
        <Text>5,500</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text>Harmeet Singh</Text>
          <Text>9999999999</Text>
        </View>
        <View>
          <Text>Sandeep Singh</Text>
          <Text>8888888888</Text>
        </View>
      </View>

      <Text style={styles.website}>www.dashmeshtrading.co</Text>
    </Page>
  </Document>
);

export default InvoicePDF;
