"use client";

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';
import ReportFilters from '@/components/ReportFilters';
import ReportTable from '@/components/ReportTable';
import ReportSidebar from '@/components/ReportSidebar'; // Import the sidebar here
import CreditCardFilters from '@/components/CreditCardFilters';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


const ViewReportPageClient = ({ initialCustomCategories, initialCreditCardCategories }) => {
  const searchParams = useSearchParams();
  const reportType = searchParams.get('type');

  const [customCategories] = useState(initialCustomCategories);
  const [creditCardCategories] = useState(initialCreditCardCategories);
  
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchTransactions = useCallback(async (filters = {}) => {
    if (!reportType) return;
    setIsLoading(true);
    setError('');
    try {
      const params = new URLSearchParams({ type: reportType, ...filters });
      const res = await fetch(`/api/transactions?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch transactions.');
      const data = await res.json();
      setTransactions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [reportType]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDeleteTransaction = async (transactionId) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      const res = await fetch(`/api/transactions/${transactionId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete.');
      setTransactions(current => current.filter(t => t._id !== transactionId));
      setSuccess(data.message);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(''), 3000);
    }
  };

  //to download in csv format
  const handleDownloadCSV = useCallback(() => {
    if (transactions.length === 0) {
      alert("There is no data to download.");
      return;
    }

    const headers = ['Date', 'Amount', 'Category', 'Subcategory', 'Comment'];
    
    const csvRows = transactions.map(t => {
      const date = new Date(t.date).toLocaleDateString('en-CA');
      const amount = t.amount.toFixed(2);
      const category = `"${(t.category || '').replace(/"/g, '""')}"`;
      const subcategory = `"${(t.subcategory || '').replace(/"/g, '""')}"`;
      const comment = `"${(t.comment || '').replace(/"/g, '""')}"`;
      return [date, amount, category, subcategory, comment].join(',');
    });

    const csvString = [headers.join(','), ...csvRows].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    const fileName = `report-${reportType}-${new Date().toISOString().split('T')[0]}.csv`;
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [transactions, reportType]);


  //pdf download 
  const handleDownloadPDF = useCallback(async () => {
    if (transactions.length === 0) {
      alert("There is no data to download.");
      return;
    }

    const doc = new jsPDF('portrait', 'mm', 'a4');
    const font = 'AAEAAAARAQAABAAQRFNJRx... (a long base64 string)'; 
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };
    
    const tableColumn = ["Date (DD/MM/YYYY)", "Amount", "Category", "Subcategory", "Comment"];
    const tableRows = transactions.map(t => [
      new Date(t.date).toLocaleDateString('en-GB'), // Use a more common DD/MM/YYYY format
      formatCurrency(t.amount).replace('₹', ''), // Format as currency, remove symbol for alignment
      t.category,
      t.subcategory || '-',
      t.comment || ''
    ]);
    const total = formatCurrency(transactions.reduce((sum, t) => sum + t.amount, 0)).replace('₹', 'Rs.');

    // --- 3. Custom Drawing and Styling ---
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 15;

    // A. DOCUMENT HEADER
    doc.setFillColor(41, 51, 65); // Dark Slate background
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    const reportTitle = `${reportType.charAt(0).toUpperCase() + reportType.slice(1).replace('-', ' ')} Report`;
    doc.text(reportTitle, margin, 22);

    // B. SUMMARY SECTION
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.setTextColor(100, 116, 139); // Gray text
    doc.text(`Generated On: ${new Date().toLocaleDateString('en-GB')}`, margin, 45);
    doc.text(`Total Transactions: ${transactions.length}`, margin, 50);

    //total amount display
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(22, 163, 74); // Green color
    doc.text('Total Amount:', pageWidth - margin, 45, { align: 'right' });
    doc.setFontSize(20);
    doc.text(total, pageWidth - margin+4, 54, { align: 'right' });

    // C. GENERATE THE TABLE
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 65,
      theme: 'grid',
      margin: { left: margin, right: margin },
      styles: {
        font: 'helvetica',
        fontSize: 12,
        cellPadding: 2.5,
        valign: 'middle',
      },
      headStyles: {
        fillColor: '#334155', // Medium Slate Header
        textColor: '#FFFFFF',
        fontStyle: 'bold',
      },
      // THIS IS THE FIX for column alignment and width
      columnStyles: {
        0: { halign: 'center', cellWidth: 'auto' }, // Date
        1: { halign: 'right', cellWidth: 'auto' },  // Amount
        2: { cellWidth: 'auto' },                   // Category
        3: { cellWidth: 'auto' },                   // Subcategory
        4: { cellWidth: 'auto' },               // Comment
      },
      didDrawPage: (data) => {
        // D. PAGE FOOTER
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text(`Page ${data.pageNumber} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        doc.text('ExpenseTracker - Confidential Report', margin, pageHeight - 10);
      }
    });

    // 4. Save the PDF
    const fileName = `report-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  }, [transactions, reportType]);


  const renderFilters = () => {
    if (reportType === 'expense' || reportType === 'income') {
      return <ReportFilters categories={customCategories} onFilterChange={fetchTransactions} />;
    }
    if (reportType === 'credit-card') {
      return <CreditCardFilters creditCards={creditCardCategories} onFilterChange={fetchTransactions} />;
    }
    return null;
  };

  return (
    <>
      <aside className="md:w-64 flex-shrink-0">
        <ReportSidebar />
      </aside>
      <div className="flex-1">
        {!reportType ? (
          <div className="text-center mt-20">
            <h2 className="text-2xl font-semibold">Select a Report Type</h2>
            <p className="text-gray-400">Please choose a report from the sidebar.</p>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-6 capitalize">{reportType.replace('-', ' ')} Report</h1>

            <div className="flex gap-4 mb-4">
            <button
              onClick={handleDownloadCSV}
              disabled={transactions.length === 0}
              className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="inline-block mr-2" size={16} />
              Download CSV
            </button>
            <button
            onClick={handleDownloadPDF}
            disabled={transactions.length === 0}
            className="mb-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            <Download className="inline-block mr-2" size={14} />
            PDF
            </button>
            </div>
            {success && <p className="text-center mb-4 text-green-500">{success}</p>}
            {error && <p className="text-center mb-4 text-red-500">{error}</p>}
            
            {renderFilters()}
            
            {isLoading ? (
              <p className="text-center mt-10">Loading transactions...</p>
            ) : (
              <ReportTable transactions={transactions} onDelete={handleDeleteTransaction} />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ViewReportPageClient;