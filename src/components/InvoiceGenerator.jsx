import React, { useState } from 'react';
import { FileText, Download, Plus, Trash2 } from 'lucide-react';

export default function InvoiceGenerator() {
  // Generate initial invoice number
  const generateInvoiceNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const time = String(now.getHours()).padStart(2, '0') + String(now.getMinutes()).padStart(2, '0');
    return `INV-${year}${month}${day}-${time}`;
  };

  const [formData, setFormData] = useState({
    invoiceNumber: generateInvoiceNumber(),
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date().toISOString().split('T')[0],
    studentName: '',
    studentAddress: '',
    studentEmail: '',
    studentPhone: '',
    items: [
      { level: 'A1', description: 'German Language Course', month: 'January', batch: 'Morning', amount: '134' }
    ],
    payableNow: '',
    remainingAmount: '',
    currency: 'EUR',
    additionalNotes: 'Payment due today. By making this payment, you acknowledge and accept our refund policy: Once the first class of the batch has commenced, all fees are non-refundable regardless of attendance. This policy exists because our small group batches begin with committed class sizes and instructor compensation is allocated accordingly from the course fees. This term is binding and non-negotiable upon payment. The remaining balance, if any, must be paid within 7 days from the first class date, irrespective of attendance.'
  });

  const levels = [
    { value: 'A1', label: 'A1 - Beginner', color: '#10b981', feeINR: 14000, feeEUR: 134 },
    { value: 'A2', label: 'A2 - Elementary', color: '#3b82f6', feeINR: 16000, feeEUR: 156 },
    { value: 'B1', label: 'B1 - Intermediate', color: '#f59e0b', feeINR: 18000, feeEUR: 172 },
    { value: 'B2', label: 'B2 - Upper Intermediate', color: '#8b5cf6', feeINR: 22000, feeEUR: 220 }
  ];

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If invoice date changes, also update due date to match
    if (name === 'date') {
      setFormData(prev => ({
        ...prev,
        date: value,
        dueDate: value
      }));
      return;
    }

    // If currency changes, update all course amounts
    if (name === 'currency') {
      const updatedItems = formData.items.map(item => {
        const selectedLevel = levels.find(l => l.value === item.level);
        if (selectedLevel) {
          const amount = value === 'EUR' ? selectedLevel.feeEUR : selectedLevel.feeINR;
          return { ...item, amount: amount };
        }
        return item;
      });

      setFormData(prev => ({
        ...prev,
        [name]: value,
        items: updatedItems
      }));

      // Recalculate remaining amount
      setTimeout(() => {
        const total = updatedItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
        const payableNow = parseFloat(formData.payableNow) || 0;
        const remaining = Math.max(0, total - payableNow);

        setFormData(prev => ({
          ...prev,
          remainingAmount: remaining.toFixed(2)
        }));
      }, 0);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    // Auto-fill amount when level changes
    if (field === 'level') {
      const selectedLevel = levels.find(l => l.value === value);
      if (selectedLevel) {
        const amount = formData.currency === 'EUR' ? selectedLevel.feeEUR : selectedLevel.feeINR;
        newItems[index]['amount'] = amount;
      }
    }

    setFormData(prev => ({
      ...prev,
      items: newItems
    }));

    // Recalculate remaining amount when course amounts change
    setTimeout(() => {
      const total = newItems.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
      const payableNow = parseFloat(formData.payableNow) || 0;
      const remaining = Math.max(0, total - payableNow);

      setFormData(prev => ({
        ...prev,
        remainingAmount: remaining.toFixed(2)
      }));
    }, 0);
  };

  const addItem = () => {
    const defaultAmount = formData.currency === 'EUR' ? 134 : 14000; // A1 default
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { level: 'A1', description: 'German Language Course', month: 'January', batch: 'Morning', amount: defaultAmount }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  };

  const calculateTotal = () => {
    return calculateSubtotal();
  };

  const calculateBalance = () => {
    const total = calculateTotal();
    const payableNow = parseFloat(formData.payableNow) || 0;
    return Math.max(0, total - payableNow);
  };

  const getCurrencySymbol = () => {
    return formData.currency === 'EUR' ? '€' : '₹';
  };

  const handlePayableNowChange = (e) => {
    const payableNow = e.target.value;
    const total = calculateTotal();
    const remaining = Math.max(0, total - parseFloat(payableNow || 0));

    setFormData(prev => ({
      ...prev,
      payableNow: payableNow,
      remainingAmount: remaining.toFixed(2)
    }));
  };

  const generatePDF = () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Header with gradient effect
    doc.setFillColor(220, 38, 38);
    doc.rect(0, 0, 210, 45, 'F');

    // School name
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont(undefined, 'bold');
    doc.text('PLAN BETA', 20, 22);

    doc.setFontSize(13);
    doc.setFont(undefined, 'normal');
    doc.text('School of German', 20, 31);
    doc.setFontSize(10);
    doc.text('Excellence in German Language Education', 20, 38);

    // Invoice title
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('INVOICE', 155, 22);

    // Invoice details box
    doc.setFillColor(243, 244, 246);
    doc.roundedRect(145, 26, 45, 14, 2, 2, 'F');
    doc.setFontSize(9);
    doc.setFont(undefined, 'normal');
    doc.text(`#${formData.invoiceNumber}`, 148, 32);
    doc.text(`Date: ${formData.date}`, 148, 37);

    // School contact info
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Plan Beta School of German', 20, 55);
    doc.setFont(undefined, 'normal');
    doc.setFontSize(9);
    doc.text('KRA A-23, Chattamby Swamy Nagar', 20, 61);
    doc.text('Kannammoola, Thiruvananthapuram', 20, 66);
    doc.text('Kerala 695011, India', 20, 71);
    doc.text('GST: 32AJVPS3359N1ZB', 20, 76);

    // Bill to section
    doc.setFont(undefined, 'bold');
    doc.setFontSize(11);
    doc.text('BILL TO:', 120, 55);

    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);
    doc.text(formData.studentName, 120, 62);

    if (formData.studentAddress) {
      doc.setFontSize(9);
      const addressLines = doc.splitTextToSize(formData.studentAddress, 80);
      let yPos = 68;
      addressLines.forEach(line => {
        doc.text(line, 120, yPos);
        yPos += 5;
      });

      if (formData.studentEmail) {
        yPos += 2;
        doc.text(`Email: ${formData.studentEmail}`, 120, yPos);
        yPos += 5;
      }
      if (formData.studentPhone) {
        doc.text(`Phone: ${formData.studentPhone}`, 120, yPos);
      }
    }

    // Payment terms
    if (formData.dueDate) {
      doc.setFont(undefined, 'bold');
      doc.text(`Due Date: ${formData.dueDate}`, 120, 90);
      doc.setFont(undefined, 'normal');
    }

    // Table header
    const tableTop = 100;
    doc.setFillColor(220, 38, 38);
    doc.rect(15, tableTop, 180, 10, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont(undefined, 'bold');
    doc.text('Description', 18, tableTop + 6.5);
    doc.text('Level', 75, tableTop + 6.5);
    doc.text('Month', 100, tableTop + 6.5);
    doc.text('Batch', 125, tableTop + 6.5);
    doc.text(`Amount (${formData.currency})`, 167, tableTop + 6.5);

    // Table content
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, 'normal');
    let yPos = tableTop + 16;

    formData.items.forEach((item, index) => {
      const levelColor = levels.find(l => l.value === item.level)?.color || '#000000';
      const amount = parseFloat(item.amount || 0).toFixed(2);

      // Alternating row colors
      if (index % 2 === 0) {
        doc.setFillColor(249, 250, 251);
        doc.rect(15, yPos - 5, 180, 10, 'F');
      }

      doc.setFontSize(9);
      doc.text(item.description, 18, yPos);

      // Level badge
      doc.setFillColor(parseInt(levelColor.slice(1, 3), 16),
                       parseInt(levelColor.slice(3, 5), 16),
                       parseInt(levelColor.slice(5, 7), 16));
      doc.roundedRect(75, yPos - 4, 15, 6, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont(undefined, 'bold');
      doc.text(item.level, 82.5, yPos, { align: 'center' });

      doc.setTextColor(0, 0, 0);
      doc.setFont(undefined, 'normal');
      doc.setFontSize(9);

      // Month
      if (item.month) {
        doc.text(item.month, 100, yPos);
      }

      // Batch
      if (item.batch) {
        doc.text(item.batch, 125, yPos);
      }

      doc.setFont(undefined, 'bold');
      doc.text(`${getCurrencySymbol()}${amount}`, 180, yPos, { align: 'right' });

      yPos += 12;
      doc.setFont(undefined, 'normal');
    });

    // Line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(15, yPos - 3, 195, yPos - 3);

    // Totals section
    yPos += 5;
    const total = calculateTotal().toFixed(2);
    const payableNow = parseFloat(formData.payableNow || 0).toFixed(2);
    const remaining = parseFloat(formData.remainingAmount || 0).toFixed(2);
    const currencySymbol = getCurrencySymbol();

    doc.setFont(undefined, 'normal');
    doc.setFontSize(10);

    // Total Amount
    yPos += 5;
    doc.setFillColor(220, 38, 38);
    doc.rect(140, yPos - 6, 55, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('TOTAL:', 145, yPos);
    doc.setFontSize(14);
    doc.text(`${currencySymbol}${total}`, 180, yPos, { align: 'right' });

    // Payable Now
    doc.setTextColor(0, 0, 0);
    yPos += 12;
    doc.setFontSize(11);
    doc.setFont(undefined, 'bold');
    doc.text('Payable Now:', 145, yPos);
    doc.setTextColor(22, 163, 74);
    doc.text(`${currencySymbol}${payableNow}`, 180, yPos, { align: 'right' });

    // Remaining Amount
    if (parseFloat(remaining) > 0) {
      doc.setTextColor(0, 0, 0);
      yPos += 8;
      doc.setFont(undefined, 'normal');
      doc.text('Remaining Amount:', 145, yPos);
      doc.setTextColor(239, 68, 68);
      doc.text(`${currencySymbol}${remaining}`, 180, yPos, { align: 'right' });
    }

    // Additional notes - Refund Policy
    doc.setTextColor(0, 0, 0);
    yPos += 15;
    doc.setFont(undefined, 'bold');
    doc.setFontSize(10);
    doc.text('PAYMENT TERMS & REFUND POLICY:', 18, yPos);

    doc.setFont(undefined, 'normal');
    doc.setFontSize(8);
    yPos += 6;

    const notes = doc.splitTextToSize(formData.additionalNotes, 175);
    notes.forEach(line => {
      if (yPos > 240) {
        return; // Stop if we're getting too close to footer
      }
      doc.text(line, 18, yPos);
      yPos += 4.5;
    });

    // Footer - now positioned absolutely at bottom
    const footerY = 267;
    doc.setFillColor(220, 38, 38);
    doc.rect(0, footerY, 210, 30, 'F');

    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFont(undefined, 'bold');
    doc.text('Plan Beta School of German', 105, footerY + 7, { align: 'center' });

    doc.setFontSize(8);
    doc.setFont(undefined, 'normal');
    doc.text('KRA A-23, Chattamby Swamy Nagar, Kannammoola, Thiruvananthapuram, Kerala 695011, India', 105, footerY + 13, { align: 'center' });
    doc.text('GST Number: 32AJVPS3359N1ZB', 105, footerY + 19, { align: 'center' });
    doc.text('Email: info@planbeta.in | Phone: +49 30 1234567', 105, footerY + 25, { align: 'center' });

    // Save the PDF
    const fileName = `PlanBeta_Invoice_${formData.invoiceNumber}_${formData.studentName.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);
  };

  const isFormValid = () => {
    return formData.invoiceNumber &&
           formData.studentName &&
           formData.items.every(item => item.amount) &&
           formData.payableNow;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">Plan Beta</h1>
                <p className="text-red-100 text-lg">School of German | Invoice Generator</p>
              </div>
              <FileText className="w-16 h-16 opacity-80" />
            </div>
          </div>

          <div className="p-8">
            {/* Invoice Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Invoice Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={handleChange}
                    placeholder="INV-2025-001"
                    className="w-full px-4 py-2 bg-red-50 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, invoiceNumber: generateInvoiceNumber() }))}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                    title="Generate new invoice number"
                  >
                    New
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Invoice Date *
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Currency *
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="EUR">EUR (€)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>

            {/* Student Details */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Student Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    placeholder="Max Mustermann"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Complete Address
                  </label>
                  <textarea
                    name="studentAddress"
                    value={formData.studentAddress}
                    onChange={handleChange}
                    placeholder="Musterstraße 123, 10115 Berlin"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="studentEmail"
                    value={formData.studentEmail}
                    onChange={handleChange}
                    placeholder="student@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="studentPhone"
                    value={formData.studentPhone}
                    onChange={handleChange}
                    placeholder="+49 123 456789"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Course Items */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Course Details</h2>
                <button
                  onClick={addItem}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Course
                </button>
              </div>

              {formData.items.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-6 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-700">Course {index + 1}</h3>
                    {formData.items.length > 1 && (
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Course description"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        German Level *
                      </label>
                      <select
                        value={item.level}
                        onChange={(e) => handleItemChange(index, 'level', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {levels.map(level => (
                          <option key={level.value} value={level.value}>
                            {level.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Month
                      </label>
                      <select
                        value={item.month}
                        onChange={(e) => handleItemChange(index, 'month', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        {months.map(month => (
                          <option key={month} value={month}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Batch
                      </label>
                      <select
                        value={item.batch}
                        onChange={(e) => handleItemChange(index, 'batch', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Morning">Morning</option>
                        <option value="Evening">Evening</option>
                      </select>
                    </div>

                    <div className="lg:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Course Amount ({formData.currency}) *
                      </label>
                      <input
                        type="number"
                        value={item.amount}
                        onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                        placeholder="500.00"
                        min="0"
                        step="0.01"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Details */}
            <div className="bg-red-50 rounded-lg p-6 mb-8 border-2 border-red-200">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Payment Details</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Total Course Fee
                  </label>
                  <div className="w-full px-4 py-3 bg-white border-2 border-red-300 rounded-lg text-xl font-bold text-red-900">
                    {getCurrencySymbol()}{calculateTotal().toFixed(2)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Payable Now ({formData.currency}) *
                  </label>
                  <input
                    type="number"
                    name="payableNow"
                    value={formData.payableNow}
                    onChange={handlePayableNowChange}
                    placeholder="250.00"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Remaining Amount ({formData.currency})
                  </label>
                  <input
                    type="number"
                    name="remainingAmount"
                    value={formData.remainingAmount}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-red-300 rounded-lg text-lg font-semibold"
                    readOnly
                  />
                  <p className="text-xs text-gray-600 mt-2 italic">
                    Remaining balance must be paid within 7 days of the first class date, regardless of student attendance.
                  </p>
                </div>
              </div>

              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-sm text-amber-900">
                  <span className="font-semibold">Note:</span> The remaining amount is automatically calculated based on the total course fee and amount payable now. This balance must be settled within 7 days from the first class date.
                </p>
              </div>
            </div>

            {/* Additional Notes */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Payment Terms & Refund Policy
              </label>
              <textarea
                name="additionalNotes"
                value={formData.additionalNotes}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-6 mb-8 border-2 border-red-200">
              <div className="space-y-3">
                <div className="flex justify-between text-xl">
                  <span className="font-bold text-red-900">TOTAL COURSE FEE:</span>
                  <span className="font-bold text-red-900">{getCurrencySymbol()}{calculateTotal().toFixed(2)}</span>
                </div>

                <div className="border-t-2 border-red-200 pt-3 flex justify-between text-lg">
                  <span className="font-semibold text-green-700">Payable Now:</span>
                  <span className="font-bold text-green-700">{getCurrencySymbol()}{(parseFloat(formData.payableNow) || 0).toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-lg">
                  <span className="font-semibold text-red-700">Remaining Amount:</span>
                  <span className="font-bold text-red-700">{getCurrencySymbol()}{(parseFloat(formData.remainingAmount) || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <div className="flex justify-end">
              <button
                onClick={generatePDF}
                disabled={!isFormValid()}
                className={`flex items-center gap-3 px-8 py-4 rounded-lg font-semibold text-white text-lg transition-all transform ${
                  isFormValid()
                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl hover:scale-105'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <Download className="w-6 h-6" />
                Generate PDF Invoice
              </button>
            </div>

            {!isFormValid() && (
              <p className="text-sm text-red-500 text-right mt-3">
                * Please fill in all required fields (Invoice #, Student Name, Course Amount, and Payable Now)
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white mt-8 rounded-b-2xl overflow-hidden">
            {/* Bank Details - Thin stripe */}
            <div className="bg-white/10 backdrop-blur px-8 py-3 border-b border-white/20">
              <div className="max-w-4xl mx-auto flex items-center justify-center gap-8 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-red-100">Account:</span>
                  <span className="font-bold">PLAN BETA</span>
                </div>
                <div className="h-4 w-px bg-white/30"></div>
                <div className="flex items-center gap-2">
                  <span className="text-red-100">A/C No:</span>
                  <span className="font-bold">50200087416170</span>
                </div>
                <div className="h-4 w-px bg-white/30"></div>
                <div className="flex items-center gap-2">
                  <span className="text-red-100">IFSC:</span>
                  <span className="font-bold">HDFC0009459</span>
                </div>
              </div>
            </div>

            {/* School Info */}
            <div className="px-8 py-4">
              <div className="max-w-4xl mx-auto text-center">
                <h3 className="text-lg font-bold mb-2">Plan Beta School of German</h3>
                <p className="text-xs text-red-100 mb-1 leading-relaxed">
                  KRA A-23, Chattamby Swamy Nagar, Kannammoola, Thiruvananthapuram, Kerala 695011, India
                </p>
                <p className="text-xs text-red-100">
                  <span className="font-semibold">GST:</span> 32AJVPS3359N1ZB |
                  <span className="ml-2">Email: info@planbeta.in | Phone: +49 30 1234567</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
