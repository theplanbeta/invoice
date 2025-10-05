import React, { useState } from 'react';
import { FileText, Download, Plus, Trash2 } from 'lucide-react';
import html2canvas from 'html2canvas';

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
    { value: 'A1 Hybrid', label: 'A1 Hybrid', color: '#06b6d4', feeINR: 10000, feeEUR: 100 },
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

  const sendEmailWithPDF = async (pdfBlob) => {
    if (!formData.studentEmail) {
      return; // Skip email if no email provided
    }

    try {
      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise((resolve) => {
        reader.onloadend = () => {
          const base64 = reader.result.split(',')[1];
          resolve(base64);
        };
        reader.readAsDataURL(pdfBlob);
      });

      const pdfBase64 = await base64Promise;

      // Send to API
      const response = await fetch('/api/send-invoice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentEmail: formData.studentEmail,
          studentName: formData.studentName,
          invoiceNumber: formData.invoiceNumber,
          pdfBase64: pdfBase64
        })
      });

      const result = await response.json();

      if (response.ok) {
        alert(`✅ Invoice sent successfully to ${formData.studentEmail}`);
      } else {
        console.error('Email error:', result);
        alert(`⚠️ PDF downloaded, but email failed to send. Please send manually to ${formData.studentEmail}`);
      }
    } catch (error) {
      console.error('Email sending error:', error);
      alert(`⚠️ PDF downloaded, but email failed to send. Please send manually to ${formData.studentEmail}`);
    }
  };

  const generatePDF = async () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Load new logo
    const logoImg = new Image();
    logoImg.src = '/blogo.png';

    await new Promise((resolve, reject) => {
      logoImg.onload = resolve;
      logoImg.onerror = reject;
    });

    // Elegant header with refined spacing - new brand color
    doc.setFillColor(210, 48, 44);
    doc.rect(0, 0, 210, 55, 'F');

    // Add circular B logo
    doc.addImage(logoImg, 'PNG', 15, 12, 30, 30);

    // School branding next to logo
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('times', 'bold');
    doc.text('PLAN BETA', 50, 24);

    doc.setFontSize(12);
    doc.setFont('times', 'italic');
    doc.text('School of German', 50, 33);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Excellence in German Language Education', 50, 40);

    // Invoice title - elegant positioning
    doc.setFontSize(22);
    doc.setFont('times', 'bold');
    doc.text('INVOICE', 155, 22);

    // Invoice details box - refined elegant styling
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(210, 48, 44);
    doc.setLineWidth(0.3);
    doc.roundedRect(148, 27, 47, 20, 2, 2, 'FD');

    doc.setFontSize(7);
    doc.setTextColor(120, 120, 120);
    doc.setFont('helvetica', 'normal');
    doc.text('INVOICE NUMBER', 151, 32);

    doc.setFontSize(11);
    doc.setTextColor(210, 48, 44);
    doc.setFont('helvetica', 'bold');
    doc.text(`#${formData.invoiceNumber}`, 151, 38);

    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${formData.date}`, 151, 44);

    // School contact info - refined elegant spacing
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont('times', 'bold');
    doc.text('Plan Beta School of German', 20, 66);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text('KRA A-23, Chattamby Swamy Nagar', 20, 74);
    doc.text('Kannammoola, Thiruvananthapuram', 20, 80);
    doc.text('Kerala 695011, India', 20, 86);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(0, 0, 0);
    doc.text('GST: 32AJVPS3359N1ZB', 20, 93);

    // Bill to section - elegant typography with red highlight
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(210, 48, 44);
    doc.text('BILL TO', 120, 66);

    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(formData.studentName, 120, 75);

    if (formData.studentAddress) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      const addressLines = doc.splitTextToSize(formData.studentAddress, 75);
      let yPos = 82;
      addressLines.forEach(line => {
        doc.text(line, 120, yPos);
        yPos += 5;
      });

      if (formData.studentEmail) {
        yPos += 2;
        doc.setFontSize(8);
        doc.text(`${formData.studentEmail}`, 120, yPos);
        yPos += 5;
      }
      if (formData.studentPhone) {
        doc.text(`${formData.studentPhone}`, 120, yPos);
      }
    }

    // Payment terms - enhanced with box
    if (formData.dueDate) {
      doc.setFillColor(254, 242, 242);
      doc.setDrawColor(210, 48, 44);
      doc.setLineWidth(0.3);
      doc.roundedRect(119, 100, 76, 8, 1.5, 1.5, 'FD');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(210, 48, 44);
      doc.setFontSize(9);
      doc.text(`Due Date: ${formData.dueDate}`, 122, 105);
      doc.setFont('helvetica', 'normal');
    }

    // Table header with elegant spacing
    const tableTop = 115;
    doc.setFillColor(210, 48, 44);
    doc.rect(15, tableTop, 180, 12, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('COURSE DESCRIPTION', 18, tableTop + 7.5);
    doc.text('LEVEL', 80, tableTop + 7.5);
    doc.text('MONTH', 110, tableTop + 7.5);
    doc.text('BATCH', 140, tableTop + 7.5);
    doc.text(`AMOUNT (${formData.currency})`, 189, tableTop + 7.5, { align: 'right' });

    // Table content with elegant refined styling
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    let yPos = tableTop + 21;

    formData.items.forEach((item, index) => {
      const levelColor = levels.find(l => l.value === item.level)?.color || '#000000';
      const amount = parseFloat(item.amount || 0).toFixed(2);

      // Elegant alternating row colors
      if (index % 2 === 0) {
        doc.setFillColor(250, 252, 254);
      } else {
        doc.setFillColor(255, 255, 255);
      }
      doc.rect(15, yPos - 7, 180, 14, 'F');

      // Refined subtle border
      doc.setDrawColor(235, 235, 235);
      doc.setLineWidth(0.1);
      doc.line(15, yPos + 7, 195, yPos + 7);

      doc.setFontSize(9.5);
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'normal');
      doc.text(item.description, 18, yPos);

      // Refined level badge
      doc.setFillColor(parseInt(levelColor.slice(1, 3), 16),
                       parseInt(levelColor.slice(3, 5), 16),
                       parseInt(levelColor.slice(5, 7), 16));
      doc.roundedRect(78, yPos - 4.5, 20, 8, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(item.level, 88, yPos, { align: 'center' });

      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);

      // Month - elegant
      if (item.month) {
        doc.text(item.month, 110, yPos);
      }

      // Batch - elegant
      if (item.batch) {
        doc.text(item.batch, 140, yPos);
      }

      // Amount - bold and prominent
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.text(`${getCurrencySymbol()}${amount}`, 189, yPos, { align: 'right' });

      yPos += 14;
      doc.setFont('helvetica', 'normal');
    });

    // Elegant table bottom border
    doc.setDrawColor(210, 48, 44);
    doc.setLineWidth(0.8);
    doc.line(15, yPos - 7, 195, yPos - 7);

    // Decorative red separator line before payment summary
    yPos += 8;
    doc.setDrawColor(210, 48, 44);
    doc.setLineWidth(0.3);
    doc.line(15, yPos, 195, yPos);

    // Payment Summary Section - Refined Elegant Box
    yPos += 8;
    const total = calculateTotal().toFixed(2);
    const payableNow = parseFloat(formData.payableNow || 0).toFixed(2);
    const remaining = parseFloat(formData.remainingAmount || 0).toFixed(2);
    const currencySymbol = getCurrencySymbol();

    // Elegant payment summary box with refined border
    const summaryBoxHeight = parseFloat(remaining) > 0 ? 42 : 32;
    doc.setDrawColor(210, 48, 44);
    doc.setLineWidth(0.4);
    doc.setFillColor(255, 252, 252);
    doc.roundedRect(128, yPos - 6, 67, summaryBoxHeight, 3, 3, 'FD');

    // Total Amount - refined typography
    yPos += 3;
    doc.setFillColor(210, 48, 44);
    doc.rect(130, yPos - 7, 63, 13, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL AMOUNT', 133, yPos - 1);
    doc.setFontSize(15);
    doc.setFont('times', 'bold');
    doc.text(`${currencySymbol}${total}`, 189, yPos, { align: 'right' });

    // Payable Now - elegant spacing
    doc.setTextColor(22, 163, 74);
    yPos += 14;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Payable Now', 133, yPos);
    doc.setFontSize(13);
    doc.setFont('times', 'bold');
    doc.text(`${currencySymbol}${payableNow}`, 189, yPos, { align: 'right' });

    // Remaining Amount - refined
    if (parseFloat(remaining) > 0) {
      doc.setTextColor(239, 68, 68);
      yPos += 12;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('Remaining Balance', 133, yPos);
      doc.setFontSize(13);
      doc.setFont('times', 'bold');
      doc.text(`${currencySymbol}${remaining}`, 189, yPos, { align: 'right' });
    }

    yPos += 14;

    // Bank Details Section - Refined Elegant Box (increased height for UPI)
    doc.setDrawColor(210, 210, 210);
    doc.setLineWidth(0.2);
    doc.setFillColor(250, 251, 253);
    doc.roundedRect(15, yPos, 180, 38, 2.5, 2.5, 'FD');

    doc.setTextColor(210, 48, 44);
    doc.setFontSize(10);
    doc.setFont('times', 'bold');
    doc.text('BANK DETAILS FOR PAYMENT', 20, yPos + 8);

    doc.setTextColor(60, 60, 60);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');

    // Three columns - elegant typography
    doc.text('Account Name', 20, yPos + 16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('PLAN BETA', 20, yPos + 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('Account Number', 75, yPos + 16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('50200087416170', 75, yPos + 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('IFSC Code', 135, yPos + 16);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('HDFC0009459', 135, yPos + 22);

    // UPI ID - centered at bottom with elegant styling
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text('UPI ID:', 20, yPos + 30);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(210, 48, 44);
    doc.text('7736638706@ybl', 38, yPos + 30);

    yPos += 46;

    // IMPORTANT: NO REFUND WARNING BOX - Prominent
    doc.setDrawColor(210, 48, 44);
    doc.setLineWidth(1);
    doc.setFillColor(254, 226, 226);
    doc.roundedRect(15, yPos, 180, 16, 2, 2, 'FD');

    doc.setTextColor(210, 48, 44);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('⚠ IMPORTANT: NO REFUND POLICY', 20, yPos + 6);

    doc.setTextColor(139, 0, 0);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text('Once classes begin, ALL FEES ARE 100% NON-REFUNDABLE regardless of attendance', 20, yPos + 12);

    yPos += 22;

    // Refund Policy Section - Enhanced with red left border
    doc.setTextColor(210, 48, 44);
    doc.setFont('times', 'bold');
    doc.setFontSize(11);
    doc.text('PAYMENT TERMS & REFUND POLICY', 25, yPos);

    // Red left border stripe for policy text
    doc.setDrawColor(210, 48, 44);
    doc.setLineWidth(3);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(50, 50, 50);
    yPos += 7;

    const startY = yPos;
    const notes = doc.splitTextToSize(formData.additionalNotes, 168);
    notes.forEach(line => {
      if (yPos > 220) {
        return; // Stop if we're getting too close to footer
      }
      // Highlight key phrases in bold red
      if (line.includes('non-refundable') || line.includes('regardless of attendance') ||
          line.includes('binding and non-negotiable')) {
        const parts = line.split(/(non-refundable|regardless of attendance|binding and non-negotiable)/gi);
        let xOffset = 25;
        parts.forEach(part => {
          if (/(non-refundable|regardless of attendance|binding and non-negotiable)/i.test(part)) {
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(210, 48, 44);
          } else {
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(50, 50, 50);
          }
          doc.text(part, xOffset, yPos);
          xOffset += doc.getTextWidth(part);
        });
      } else {
        doc.text(line, 25, yPos);
      }
      yPos += 4.8;
    });

    // Draw red left border stripe
    doc.line(18, startY - 4, 18, yPos - 2);

    yPos += 4;

    // Confirmation Statement Box
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(15, yPos, 180, 12, 1.5, 1.5, 'FD');

    doc.setTextColor(80, 80, 80);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'italic');
    doc.text('By signing/accepting this invoice, I confirm that I have read and understood the refund policy stated above.', 20, yPos + 8);

    // Footer - Elegant refined design
    const footerY = 263;
    doc.setFillColor(210, 48, 44);
    doc.rect(0, footerY, 210, 34, 'F');

    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.setFont('times', 'bold');
    doc.text('Plan Beta School of German', 105, footerY + 10, { align: 'center' });

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 245, 245);
    doc.text('KRA A-23, Chattamby Swamy Nagar, Kannammoola, Thiruvananthapuram, Kerala 695011, India', 105, footerY + 17, { align: 'center' });

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('GST: 32AJVPS3359N1ZB', 105, footerY + 24, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(255, 245, 245);
    doc.text('Email: info@planbeta.in | Phone: +91 8547081550', 105, footerY + 27, { align: 'center' });

    // Footer note about refund policy - elegantly framed
    doc.setFontSize(6.5);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(255, 255, 255);
    doc.text('All fees are subject to our no-refund policy once batch commences, even if no classes are attended.', 105, footerY + 31, { align: 'center' });
    doc.setFont('helvetica', 'bold');
    doc.text('By paying this invoice, you acknowledge and accept this condition.', 105, footerY + 34, { align: 'center' });

    // Save the PDF
    const fileName = `PlanBeta_Invoice_${formData.invoiceNumber}_${formData.studentName.replace(/\s+/g, '_')}.pdf`;
    doc.save(fileName);

    // Send email if student email is provided
    if (formData.studentEmail) {
      const pdfBlob = doc.output('blob');
      await sendEmailWithPDF(pdfBlob);
    }
  };

  const generateJPG = async () => {
    // Create invoice preview div for screenshot
    const invoicePreview = document.createElement('div');
    invoicePreview.style.position = 'absolute';
    invoicePreview.style.left = '-10000px';
    invoicePreview.style.width = '794px'; // A4 width in pixels at 96 DPI
    invoicePreview.style.backgroundColor = '#ffffff';
    invoicePreview.style.fontFamily = 'Arial, sans-serif';

    const currencySymbol = getCurrencySymbol();
    const total = calculateTotal().toFixed(2);
    const payableNow = parseFloat(formData.payableNow || 0).toFixed(2);
    const remaining = parseFloat(formData.remainingAmount || 0).toFixed(2);

    invoicePreview.innerHTML = `
      <div style="background: #d2302c; padding: 40px 30px; color: white; position: relative;">
        <div style="display: flex; align-items: flex-start; gap: 20px;">
          <img src="/blogo.png" style="width: 70px; height: 70px;" crossorigin="anonymous" />
          <div>
            <h1 style="margin: 0; font-size: 32px; font-weight: bold;">PLAN BETA</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px; font-style: italic;">School of German</p>
          </div>
        </div>
        <div style="position: absolute; top: 30px; right: 30px; background: white; padding: 15px; border-radius: 8px;">
          <div style="color: #787878; font-size: 10px;">INVOICE NUMBER</div>
          <div style="color: #d2302c; font-size: 16px; font-weight: bold; margin-top: 5px;">#${formData.invoiceNumber}</div>
          <div style="color: #646464; font-size: 11px; margin-top: 5px;">Date: ${formData.date}</div>
        </div>
      </div>

      <div style="padding: 30px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 25px;">
          <div>
            <h3 style="margin: 0; font-size: 13px;">Plan Beta School of German</h3>
            <p style="margin: 8px 0 0 0; font-size: 11px; line-height: 1.5; color: #505050;">
              KRA A-23, Chattamby Swamy Nagar<br/>
              Kannammoola, Thiruvananthapuram<br/>
              Kerala 695011, India<br/>
              <strong>GST: 32AJVPS3359N1ZB</strong>
            </p>
          </div>
          <div style="text-align: right;">
            <h3 style="margin: 0; font-size: 13px; color: #d2302c;">BILL TO</h3>
            <p style="margin: 8px 0 0 0; font-size: 13px; font-weight: bold;">${formData.studentName}</p>
            ${formData.studentAddress ? `<p style="margin: 5px 0 0 0; font-size: 10px; color: #505050;">${formData.studentAddress.replace(/\n/g, '<br/>')}</p>` : ''}
          </div>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <thead>
            <tr style="background: #d2302c; color: white;">
              <th style="padding: 10px; text-align: left; font-size: 10px;">DESCRIPTION</th>
              <th style="padding: 10px; text-align: left; font-size: 10px;">LEVEL</th>
              <th style="padding: 10px; text-align: left; font-size: 10px;">MONTH</th>
              <th style="padding: 10px; text-align: right; font-size: 10px;">AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            ${formData.items.map((item, idx) => {
              const lvlColor = levels.find(l => l.value === item.level)?.color || '#000';
              return `
                <tr style="background: ${idx % 2 === 0 ? '#fafcfe' : '#fff'}; border-bottom: 1px solid #eee;">
                  <td style="padding: 12px 10px; font-size: 11px;">${item.description}</td>
                  <td style="padding: 12px 10px;">
                    <span style="background-color: ${lvlColor}; color: #ffffff; padding: 5px 12px; border-radius: 4px; font-size: 11px; font-weight: bold; display: inline-block; min-width: 50px; text-align: center;">${item.level}</span>
                  </td>
                  <td style="padding: 12px 10px; font-size: 11px;">${item.month}</td>
                  <td style="padding: 12px 10px; text-align: right; font-weight: bold; font-size: 12px;">${currencySymbol}${parseFloat(item.amount).toFixed(2)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <div style="background: #fffcfc; border: 2px solid #d2302c; border-radius: 6px; padding: 15px; margin-left: auto; width: 280px;">
          <div style="background: #d2302c; color: white; padding: 10px; margin: -15px -15px 12px -15px;">
            <div style="font-size: 11px; font-weight: bold;">TOTAL AMOUNT</div>
            <div style="font-size: 18px; font-weight: bold; margin-top: 3px;">${currencySymbol}${total}</div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-weight: bold; color: #16a34a; font-size: 11px;">Payable Now</span>
            <span style="font-weight: bold; color: #16a34a; font-size: 14px;">${currencySymbol}${payableNow}</span>
          </div>
          ${parseFloat(remaining) > 0 ? `
            <div style="display: flex; justify-content: space-between;">
              <span style="font-weight: bold; color: #ef4444; font-size: 11px;">Remaining</span>
              <span style="font-weight: bold; color: #ef4444; font-size: 14px;">${currencySymbol}${remaining}</span>
            </div>
          ` : ''}
        </div>

        <div style="background: #fafbfd; border: 1px solid #d2d2d2; border-radius: 6px; padding: 15px; margin-top: 20px;">
          <h3 style="margin: 0 0 10px 0; font-size: 12px; color: #d2302c;">BANK DETAILS FOR PAYMENT</h3>
          <div style="font-size: 10px;">
            Account: <strong>PLAN BETA</strong> | A/C: <strong>50200087416170</strong> | IFSC: <strong>HDFC0009459</strong><br/>
            UPI ID: <strong style="color: #d2302c;">7736638706@ybl</strong>
          </div>
        </div>

        <div style="background: #fee2e2; border: 2px solid #d2302c; border-radius: 4px; padding: 15px; margin-top: 20px;">
          <div style="color: #d2302c; font-size: 13px; font-weight: bold; margin-bottom: 8px;">⚠ IMPORTANT: NO REFUND POLICY</div>
          <div style="color: #8b0000; font-size: 10px; font-weight: bold; margin-bottom: 8px;">Once classes begin, ALL FEES ARE 100% NON-REFUNDABLE regardless of attendance</div>
        </div>

        <div style="border-left: 4px solid #d2302c; padding-left: 15px; margin-top: 15px; margin-bottom: 15px;">
          <h3 style="margin: 0 0 8px 0; font-size: 12px; font-weight: bold; color: #d2302c;">PAYMENT TERMS & REFUND POLICY</h3>
          <p style="margin: 0; font-size: 9px; line-height: 1.6; color: #323232;">
            Payment due today. By making this payment, you acknowledge and accept our refund policy: Once the first class of the batch has commenced, all fees are <strong style="color: #d2302c;">non-refundable</strong> <strong style="color: #d2302c;">regardless of attendance</strong>. This policy exists because our small group batches begin with committed class sizes and instructor compensation is allocated accordingly from the course fees. This term is <strong style="color: #d2302c;">binding and non-negotiable</strong> upon payment. The remaining balance, if any, must be paid within 7 days from the first class date, irrespective of attendance.
          </p>
        </div>

        <div style="background: #f5f5f5; border: 1px solid #c8c8c8; border-radius: 4px; padding: 10px; font-size: 9px; font-style: italic; color: #505050;">
          By signing/accepting this invoice, I confirm that I have read and understood the refund policy stated above.
        </div>
      </div>

      <div style="background: #d2302c; color: white; padding: 20px; text-align: center;">
        <div style="font-size: 14px; font-weight: bold; margin-bottom: 8px;">Plan Beta School of German</div>
        <div style="font-size: 9px; line-height: 1.5; opacity: 0.95; margin-bottom: 5px;">
          KRA A-23, Chattamby Swamy Nagar, Kannammoola, Thiruvananthapuram, Kerala 695011, India<br/>
          <strong>GST: 32AJVPS3359N1ZB</strong>
        </div>
        <div style="font-size: 9px; margin-bottom: 8px;">Email: info@planbeta.in | Phone: +91 8547081550</div>
        <div style="font-size: 8px; font-style: italic; line-height: 1.4; opacity: 0.9;">
          All fees are subject to our no-refund policy once batch commences, even if no classes are attended.<br/>
          <strong>By paying this invoice, you acknowledge and accept this condition.</strong>
        </div>
      </div>
    `;

    document.body.appendChild(invoicePreview);

    try {
      const canvas = await html2canvas(invoicePreview, {
        scale: 3,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false
      });

      document.body.removeChild(invoicePreview);

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `PlanBeta_Invoice_${formData.invoiceNumber}_${formData.studentName.replace(/\s+/g, '_')}.jpg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }, 'image/jpeg', 0.92);
    } catch (error) {
      document.body.removeChild(invoicePreview);
      alert('Error generating JPG. Please try the PDF button instead.');
      console.error(error);
    }
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
          <div style={{backgroundColor: '#d2302c'}} className="p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img src="/blogo.png" alt="Plan Beta Logo" className="h-16 w-16" />
                <div>
                  <h1 className="text-4xl font-bold mb-1">Plan Beta</h1>
                  <p className="text-white text-opacity-90 text-sm">School of German | Invoice Generator</p>
                </div>
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
                    className="w-full px-4 py-2 bg-red-50 border border-red-300 rounded-lg focus:ring-2 focus:border-transparent font-semibold"
                    style={{focusRingColor: '#d2302c'}}
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, invoiceNumber: generateInvoiceNumber() }))}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-white px-2 py-1 rounded"
                    style={{backgroundColor: '#d2302c'}}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#b82824'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#d2302c'}
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
                  className="flex items-center gap-2 px-4 py-2 text-white rounded-lg transition-colors"
                  style={{backgroundColor: '#d2302c'}}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#b82824'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#d2302c'}
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

            {/* Generate Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4">
              <button
                onClick={generatePDF}
                disabled={!isFormValid()}
                className={`flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-semibold text-white text-lg transition-all transform ${
                  isFormValid()
                    ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 shadow-lg hover:shadow-xl hover:scale-105'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <Download className="w-6 h-6" />
                Generate PDF
              </button>

              <button
                onClick={generateJPG}
                disabled={!isFormValid()}
                className={`flex items-center justify-center gap-3 px-8 py-4 rounded-lg font-semibold text-white text-lg transition-all transform ${
                  isFormValid()
                    ? 'bg-gradient-to-r from-pink-600 to-red-600 hover:from-pink-700 hover:to-red-700 shadow-lg hover:shadow-xl hover:scale-105'
                    : 'bg-gray-300 cursor-not-allowed'
                }`}
              >
                <FileText className="w-6 h-6" />
                Generate JPG
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
