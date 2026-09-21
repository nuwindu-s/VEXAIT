import nodemailer from 'nodemailer';

/**
 * Creates and configures the nodemailer transporter.
 * Supports Gmail (default) or custom SMTP credentials via environment variables.
 */
export const getTransporter = () => {
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || 'vexa.it2026@gmail.com';
  const pass = process.env.SMTP_PASS || process.env.EMAIL_PASS || process.env.GMAIL_APP_PASSWORD;
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const secure = process.env.SMTP_SECURE === 'false' ? false : port === 465;

  if (!pass) {
    console.warn(
      '⚠️ [EmailService] SMTP password (SMTP_PASS / EMAIL_PASS / GMAIL_APP_PASSWORD) not configured in .env. Email notifications will be simulated.'
    );
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

/**
 * Sends a notification email to the VEXA IT Admin when a new inquiry is submitted.
 *
 * @param {Object} inquiry
 * @param {string} inquiry.name
 * @param {string} inquiry.email
 * @param {string} inquiry.phone
 * @param {string} inquiry.company
 * @param {string} inquiry.service
 * @param {string} inquiry.details
 * @param {Date|string} [inquiry.createdAt]
 * @param {string} [inquiry.ipAddress]
 */
export const sendInquiryNotification = async (inquiry) => {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_TO || 'vexa.it2026@gmail.com';
  const senderUser = process.env.SMTP_USER || process.env.EMAIL_USER || 'vexa.it2026@gmail.com';

  const transporter = getTransporter();

  const formattedDate = inquiry.createdAt
    ? new Date(inquiry.createdAt).toLocaleString('en-US', {
        timeZone: 'Asia/Colombo',
        dateStyle: 'full',
        timeStyle: 'medium',
      })
    : new Date().toLocaleString('en-US', { timeZone: 'Asia/Colombo' });

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Project Inquiry - VEXA IT</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f1f5f9;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        color: #0f172a;
      }
      .container {
        max-width: 620px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid #e2e8f0;
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);
      }
      .header {
        background: linear-gradient(135deg, #0A192F 0%, #1E3A8A 100%);
        padding: 36px 30px;
        text-align: left;
        color: #ffffff;
      }
      .header h1 {
        margin: 0;
        font-size: 22px;
        font-weight: 800;
        letter-spacing: -0.5px;
      }
      .badge {
        display: inline-block;
        background: rgba(0, 210, 255, 0.15);
        border: 1px solid rgba(0, 210, 255, 0.4);
        color: #00D2FF;
        padding: 4px 10px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
        border-radius: 9999px;
        margin-bottom: 12px;
        letter-spacing: 0.5px;
      }
      .content {
        padding: 32px 30px;
      }
      .field-card {
        background: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 24px;
      }
      .field-grid {
        display: table;
        width: 100%;
      }
      .field-row {
        display: table-row;
      }
      .field-label {
        display: table-cell;
        padding: 8px 12px 8px 0;
        font-size: 12px;
        font-weight: 700;
        color: #64748b;
        text-transform: uppercase;
        width: 35%;
        border-bottom: 1px solid #f1f5f9;
      }
      .field-value {
        display: table-cell;
        padding: 8px 0;
        font-size: 14px;
        font-weight: 600;
        color: #0f172a;
        border-bottom: 1px solid #f1f5f9;
      }
      .project-details-box {
        background: #f0f9ff;
        border-left: 4px solid #0284c7;
        border-radius: 8px;
        padding: 18px 20px;
        margin: 20px 0;
      }
      .project-details-box h3 {
        margin: 0 0 10px 0;
        font-size: 13px;
        color: #0369a1;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .project-details-box p {
        margin: 0;
        font-size: 14px;
        line-height: 1.6;
        color: #0c4a6e;
        white-space: pre-wrap;
      }
      .action-bar {
        text-align: center;
        margin-top: 30px;
        padding-top: 24px;
        border-top: 1px solid #e2e8f0;
      }
      .btn {
        display: inline-block;
        background: #2563eb;
        color: #ffffff !important;
        text-decoration: none;
        padding: 12px 28px;
        font-size: 14px;
        font-weight: 700;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.25);
      }
      .footer {
        background: #f8fafc;
        padding: 20px 30px;
        text-align: center;
        border-top: 1px solid #e2e8f0;
        font-size: 12px;
        color: #94a3b8;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <div class="badge">Direct Website Inquiry</div>
        <h1>New Client Proposal Request</h1>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #94a3b8;">
          Received on ${formattedDate} (Sri Lanka Time)
        </p>
      </div>
      
      <div class="content">
        <p style="font-size: 14px; color: #475569; margin-top: 0;">
          A prospective client has submitted a proposal inquiry through the <strong>VEXA IT</strong> website form.
        </p>

        <div class="field-card">
          <div class="field-grid">
            <div class="field-row">
              <div class="field-label">Client Name:</div>
              <div class="field-value">${inquiry.name}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Email Address:</div>
              <div class="field-value"><a href="mailto:${inquiry.email}" style="color: #2563eb; text-decoration: none;">${inquiry.email}</a></div>
            </div>
            <div class="field-row">
              <div class="field-label">Phone Number:</div>
              <div class="field-value">${inquiry.phone || 'Not provided'}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Company / Org:</div>
              <div class="field-value">${inquiry.company || 'Not provided'}</div>
            </div>
            <div class="field-row">
              <div class="field-label">Requested Service:</div>
              <div class="field-value" style="color: #0284c7; font-weight: 700;">${inquiry.service || 'Web Development'}</div>
            </div>
          </div>
        </div>

        <div class="project-details-box">
          <h3>Project Details & Requirements</h3>
          <p>${inquiry.details}</p>
        </div>

        <div class="action-bar">
          <a href="mailto:${inquiry.email}?subject=Re:%20VEXA%20IT%20Inquiry%20-%20${encodeURIComponent(inquiry.service || 'Proposal')}" class="btn">
            Reply to ${inquiry.name}
          </a>
        </div>
      </div>

      <div class="footer">
        <p style="margin: 0;">This email was automatically generated by VEXA IT Web Portal.</p>
        <p style="margin: 4px 0 0 0;">Recipient: <strong>${adminEmail}</strong></p>
      </div>
    </div>
  </body>
  </html>
  `;

  const textContent = `
New Project Inquiry Received - VEXA IT
---------------------------------------
Date: ${formattedDate}
Name: ${inquiry.name}
Email: ${inquiry.email}
Phone: ${inquiry.phone || 'Not specified'}
Company: ${inquiry.company || 'Not specified'}
Service: ${inquiry.service}

Project Details:
${inquiry.details}

Reply to: ${inquiry.email}
  `.trim();

  if (!transporter) {
    console.log(`📨 [Email Simulated] To: ${adminEmail} | Subject: New Inquiry from ${inquiry.name} (${inquiry.email})`);
    return {
      success: false,
      simulated: true,
      message: 'SMTP credentials not configured. Please add SMTP_USER and SMTP_PASS (Gmail App Password) to your .env file.',
    };
  }

  try {
    const info = await transporter.sendMail({
      from: `"VEXA IT System" <${senderUser}>`,
      to: adminEmail,
      replyTo: `"${inquiry.name}" <${inquiry.email}>`,
      subject: `⚡ New Project Inquiry from ${inquiry.name} (${inquiry.service || 'VEXA IT'})`,
      text: textContent,
      html: htmlContent,
    });

    console.log(`✅ [EmailService] Inquiry email successfully sent to ${adminEmail} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ [EmailService] Failed to send email to admin:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Sends an automated confirmation receipt to the client.
 */
export const sendClientConfirmation = async (inquiry) => {
  const senderUser = process.env.SMTP_USER || process.env.EMAIL_USER || 'vexa.it2026@gmail.com';
  const transporter = getTransporter();

  if (!transporter || !inquiry.email) return;

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>Inquiry Received - VEXA IT</title>
  </head>
  <body style="margin: 0; padding: 0; font-family: sans-serif; background-color: #f8fafc; color: #0f172a;">
    <div style="max-width: 580px; margin: 30px auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden;">
      <div style="background: #0A192F; padding: 28px; text-align: center; color: #ffffff;">
        <h2 style="margin: 0; font-size: 20px; font-weight: bold; color: #00D2FF;">VEXA IT</h2>
        <p style="margin: 6px 0 0 0; font-size: 13px; color: #94a3b8;">Transforming Ideas Into Intelligent Digital Realities</p>
      </div>
      <div style="padding: 28px 24px;">
        <h3 style="margin-top: 0; font-size: 18px; color: #0f172a;">Hello ${inquiry.name},</h3>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          Thank you for reaching out to <strong>VEXA IT</strong>. We have received your inquiry regarding <strong>${inquiry.service || 'our services'}</strong>.
        </p>
        <p style="font-size: 14px; line-height: 1.6; color: #475569;">
          Our senior technology consulting team is reviewing your project requirements and will contact you within <strong>24 business hours</strong> to schedule an introductory discovery session.
        </p>
        <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin: 20px 0; font-size: 13px; color: #334155;">
          <strong>Your submitted details:</strong><br/>
          <strong>Service:</strong> ${inquiry.service || 'Web Development'}<br/>
          <strong>Notes:</strong> ${inquiry.details}
        </div>
        <p style="font-size: 13px; color: #64748b;">
          If you have urgent questions, feel free to reply directly to this email or connect with our engineering team on WhatsApp: <a href="https://wa.me/94712696668" style="color: #2563eb;">+94 71 269 6668</a>.
        </p>
      </div>
      <div style="background: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
        © ${new Date().getFullYear()} VEXA IT (Pvt) Ltd. All rights reserved. • Colombo, Sri Lanka
      </div>
    </div>
  </body>
  </html>
  `;

  try {
    await transporter.sendMail({
      from: `"VEXA IT Team" <${senderUser}>`,
      to: inquiry.email,
      subject: `We've received your inquiry - VEXA IT`,
      html: htmlContent,
    });
    console.log(`✅ [EmailService] Confirmation email dispatched to client: ${inquiry.email}`);
  } catch (err) {
    console.warn(`⚠️ [EmailService] Could not send client confirmation:`, err.message);
  }
};
