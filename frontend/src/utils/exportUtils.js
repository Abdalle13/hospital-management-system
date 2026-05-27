import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatDate, formatCurrency } from './formatter';

export const exportToExcel = (data, filename, sheetName = 'Sheet1') => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${filename}.xlsx`);
};

export const exportInvoicesToPDF = (invoices) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('SmartClinic Revenue Report', 14, 22);
  
  doc.setFontSize(11);
  doc.text(`Generated on: ${formatDate(new Date())}`, 14, 30);

  const tableColumn = ["Invoice Number", "Patient", "Date", "Status", "Amount"];
  const tableRows = [];

  let totalRevenue = 0;

  invoices.forEach(inv => {
    const rowData = [
      inv.invoiceNumber,
      inv.patient?.name || 'N/A',
      formatDate(inv.createdAt),
      inv.paymentStatus,
      formatCurrency(inv.totalAmount)
    ];
    tableRows.push(rowData);
    if (inv.paymentStatus === 'Paid') {
      totalRevenue += inv.totalAmount;
    }
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [16, 185, 129] }, // Emerald 500
  });

  doc.setFontSize(12);
  doc.text(`Total Paid Revenue: ${formatCurrency(totalRevenue)}`, 14, doc.lastAutoTable.finalY + 10);

  doc.save('Revenue_Report.pdf');
};
