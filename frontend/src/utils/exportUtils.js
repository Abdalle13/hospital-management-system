import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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

  autoTable(doc, {
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

export const exportInvoiceReceipt = (invoice) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.setTextColor(16, 185, 129);
  doc.text('SmartClinic', 14, 20);
  doc.setFontSize(11);
  doc.setTextColor(120, 120, 120);
  doc.text('Payment Receipt', 14, 27);

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.text(`Invoice #: ${invoice.invoiceNumber}`, 140, 20);
  doc.text(`Date: ${formatDate(invoice.createdAt)}`, 140, 26);
  doc.text(`Status: ${invoice.paymentStatus}`, 140, 32);

  doc.setDrawColor(230, 230, 230);
  doc.line(14, 38, 196, 38);

  doc.setFontSize(11);
  doc.text(`Patient: ${invoice.patient?.name || 'N/A'}`, 14, 48);
  doc.text(`Doctor: ${invoice.doctor?.name || 'N/A'}${invoice.doctor?.specialization ? ` (${invoice.doctor.specialization})` : ''}`, 14, 55);

  const rows = (invoice.services || []).map((s) => [s.name, formatCurrency(s.amount)]);

  autoTable(doc, {
    head: [['Service', 'Amount']],
    body: rows,
    startY: 63,
    theme: 'grid',
    styles: { fontSize: 10 },
    headStyles: { fillColor: [16, 185, 129] },
    columnStyles: { 1: { halign: 'right' } },
  });

  const finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(12);
  doc.text(`Total: ${formatCurrency(invoice.totalAmount)}`, 140, finalY);
  if (invoice.paymentStatus !== 'Unpaid') {
    doc.text(`Paid: ${formatCurrency(invoice.paidAmount)}`, 140, finalY + 7);
    if (invoice.paymentMethod) doc.text(`Method: ${invoice.paymentMethod}`, 140, finalY + 14);
  }

  doc.setFontSize(9);
  doc.setTextColor(150, 150, 150);
  doc.text('Thank you for choosing SmartClinic.', 14, 280);

  doc.save(`${invoice.invoiceNumber}.pdf`);
};
