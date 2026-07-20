import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 24 },
  title: { fontSize: 20, fontWeight: 700 },
  muted: { color: "#666666" },
  section: { marginBottom: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  table: { marginTop: 8, borderTop: "1 solid #dddddd" },
  tableRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottom: "1 solid #eeeeee",
  },
  totals: { marginTop: 16, alignItems: "flex-end" },
  totalRow: { flexDirection: "row", gap: 8, marginBottom: 2 },
  bold: { fontWeight: 700 },
});

type InvoiceItem = { description: string; quantity: number; unitPrice: number };

export function InvoicePDF({
  invoice,
}: {
  invoice: {
    number: string;
    amount: number;
    currency: string;
    status: string;
    dueDate: Date | null;
    createdAt: Date;
    items: InvoiceItem[];
    clientName: string;
    clientEmail: string;
  };
}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>AutomateWithJohn</Text>
            <Text style={styles.muted}>Invoice {invoice.number}</Text>
          </View>
          <View>
            <Text style={styles.muted}>Issued {invoice.createdAt.toLocaleDateString()}</Text>
            {invoice.dueDate ? (
              <Text style={styles.muted}>Due {invoice.dueDate.toLocaleDateString()}</Text>
            ) : null}
            <Text style={styles.muted}>Status: {invoice.status}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.bold}>Billed to</Text>
          <Text>{invoice.clientName}</Text>
          <Text style={styles.muted}>{invoice.clientEmail}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.bold]}>
            <Text>Description</Text>
            <Text>Amount</Text>
          </View>
          {invoice.items.map((item, i) => (
            <View key={i} style={styles.tableRow}>
              <Text>
                {item.description} × {item.quantity}
              </Text>
              <Text>
                {invoice.currency} {(item.quantity * item.unitPrice).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.bold}>Total</Text>
            <Text style={styles.bold}>
              {invoice.currency} {invoice.amount.toFixed(2)}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
