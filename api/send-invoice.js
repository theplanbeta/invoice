const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    studentEmail,
    studentName,
    invoiceNumber,
    pdfBase64
  } = req.body;

  // Validate required fields
  if (!studentEmail || !studentName || !invoiceNumber || !pdfBase64) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Create Outlook transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.OUTLOOK_EMAIL || 'info@planbeta.in',
        pass: process.env.OUTLOOK_PASSWORD || 'Pbpw@2023'
      },
      tls: {
        ciphers: 'SSLv3'
      }
    });

    // Convert base64 to buffer
    const pdfBuffer = Buffer.from(pdfBase64, 'base64');

    // Email options
    const mailOptions = {
      from: `"Plan Beta School of German" <${process.env.OUTLOOK_EMAIL || 'info@planbeta.in'}>`,
      to: studentEmail,
      bcc: process.env.OUTLOOK_EMAIL || 'info@planbeta.in', // Send copy to yourself
      subject: `Invoice ${invoiceNumber} - Plan Beta School of German`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #d2302c; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Plan Beta School of German</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Excellence in German Language Education</p>
          </div>

          <div style="padding: 30px; background-color: #f9f9f9;">
            <h2 style="color: #333; margin-top: 0;">Dear ${studentName},</h2>

            <p style="color: #555; line-height: 1.6;">
              Thank you for choosing Plan Beta School of German for your German language learning journey.
            </p>

            <p style="color: #555; line-height: 1.6;">
              Please find attached your invoice <strong>${invoiceNumber}</strong> for your course registration.
            </p>

            <div style="background-color: #fee2e2; border-left: 4px solid #d2302c; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #8b0000; font-weight: bold;">⚠ Important Payment Information:</p>
              <p style="margin: 10px 0 0 0; color: #555; font-size: 14px;">
                Payment is due today. Please review the attached invoice for complete payment terms and our refund policy.
              </p>
            </div>

            <h3 style="color: #d2302c; margin-top: 25px;">Payment Methods:</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li><strong>Bank Transfer:</strong> PLAN BETA - A/C: 50200087416170 - IFSC: HDFC0009459</li>
              <li><strong>UPI:</strong> 7736638706@ybl</li>
            </ul>

            <p style="color: #555; line-height: 1.6; margin-top: 20px;">
              If you have any questions, please don't hesitate to contact us.
            </p>

            <p style="color: #555; line-height: 1.6;">
              Best regards,<br/>
              <strong>Plan Beta School of German</strong>
            </p>
          </div>

          <div style="background-color: #333; padding: 20px; text-align: center; color: white; font-size: 12px;">
            <p style="margin: 0;">KRA A-23, Chattamby Swamy Nagar, Kannammoola, Thiruvananthapuram, Kerala 695011</p>
            <p style="margin: 10px 0 0 0;">
              Email: info@planbeta.in | Phone: +91 8547081550 | GST: 32AJVPS3359N1ZB
            </p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: `PlanBeta_Invoice_${invoiceNumber}_${studentName.replace(/\s+/g, '_')}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      success: true,
      message: 'Invoice email sent successfully'
    });

  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({
      error: 'Failed to send email',
      details: error.message
    });
  }
}
