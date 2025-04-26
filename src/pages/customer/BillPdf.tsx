// components/PDFDocument.tsx
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
  } from "@react-pdf/renderer";
  import React from "react";
  
  interface LedgerItem {
    name: string;
    quantity: number;
  }
  
  interface LedgerEntry {
    date: string;
    type: "order" | "transaction" | string;
    items?: LedgerItem[];
    amount?: number;
    totalPrice?: number;
    balance: number;
  }
  
  interface Ledger {
    records: LedgerEntry[];
  }
  
  const styles = StyleSheet.create({
    page: { padding: 30 },
    section: { marginBottom: 10 },
    table: { width: "auto", marginTop: 10 },
    row: { flexDirection: "row" },
    cell: {
      flex: 1,
      padding: 4,
      fontSize: 10,
      border: "1 solid #ccc",
    },
    header: { fontWeight: "bold", backgroundColor: "#eee" },
  });
  
  export const BillPdf: React.FC<{ ledger: Ledger }> = ({ ledger }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={{ fontSize: 16, marginBottom: 10 }}>Customer Ledger</Text>
        <View style={styles.table}>
          <View style={[styles.row, styles.header]}>
            <Text style={styles.cell}>Date</Text>
            <Text style={styles.cell}>Type</Text>
            <Text style={styles.cell}>Description</Text>
            <Text style={styles.cell}>Amount</Text>
            <Text style={styles.cell}>Balance</Text>
          </View>
          {ledger?.records.map((entry, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.cell}>
                {new Date(entry.date).toLocaleDateString()}
              </Text>
              <Text style={styles.cell}>{entry.type}</Text>
              <Text style={styles.cell}>
                {entry.type === "order" && entry.items
                  ? entry.items.map((item) => `${item.name}×${item.quantity}`).join(", ")
                  : "-"}
              </Text>
              <Text style={styles.cell}>
                {entry.type === "transaction" ? "-" : "+"}
                {entry.type === "transaction" ? entry.amount : entry.totalPrice}
              </Text>
              <Text style={styles.cell}>{entry.balance}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
  