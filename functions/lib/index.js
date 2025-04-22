/**
 * TruePass Email Functions
 *
 * This module contains Firebase Cloud Functions for sending emails
 * using SendGrid as the email service provider.
 */
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ('get' in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.sendTicketConfirmationEmail = void 0;
const https_1 = require('firebase-functions/v2/https');
const logger = __importStar(require('firebase-functions/logger'));
const sgMail = __importStar(require('@sendgrid/mail'));
// Initialize SendGrid with API key from environment variables
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
// Check if API key is available
if (!SENDGRID_API_KEY) {
  logger.error('SendGrid API key is not set. Emails will not be sent.');
} else {
  sgMail.setApiKey(SENDGRID_API_KEY);
  logger.info('SendGrid initialized successfully');
}
// Email sender address from environment variables
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@truepass.com';
const FROM_NAME = process.env.FROM_NAME || 'TruePass';
/**
 * Cloud Function to send ticket confirmation emails
 * This function is called from the client-side EmailService
 */
exports.sendTicketConfirmationEmail = (0, https_1.onCall)(async request => {
  try {
    // Get ticket data from request
    const { ticketData } = request.data;
    if (!ticketData || !ticketData.buyerEmail) {
      throw new https_1.HttpsError(
        'invalid-argument',
        'Missing required ticket data or buyer email'
      );
    }
    logger.info('Sending ticket confirmation email', {
      to: ticketData.buyerEmail,
      event: ticketData.eventName,
    });
    // Create email content
    const msg = {
      to: ticketData.buyerEmail,
      from: {
        email: FROM_EMAIL,
        name: FROM_NAME,
      },
      subject: `Your TruePass Ticket Confirmation - ${ticketData.eventName}`,
      html: generateTicketEmailHtml(ticketData),
    };
    // Send email
    await sgMail.send(msg);
    logger.info('Email sent successfully', {
      to: ticketData.buyerEmail,
      event: ticketData.eventName,
    });
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    logger.error('Error sending email', error);
    throw new https_1.HttpsError('internal', 'Failed to send confirmation email');
  }
});
/**
 * Generate HTML content for ticket confirmation email
 * @param {TicketEmailData} ticketData - Ticket data to include in the email
 * @return {string} HTML content for the email
 */
function generateTicketEmailHtml(ticketData) {
  const purchaseDate = new Date(ticketData.timestamp).toLocaleString();
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>TruePass Ticket Confirmation</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          margin: 0;
          padding: 0;
          background-color: #f9f9f9;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #eee;
        }
        .logo {
          max-width: 150px;
          height: auto;
        }
        .ticket-details {
          margin: 30px 0;
          background-color: #f5f5f5;
          padding: 20px;
          border-radius: 8px;
        }
        .ticket-details h3 {
          margin-top: 0;
          color: #6a1b9a;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 10px;
          border-bottom: 1px dashed #ddd;
          padding-bottom: 10px;
        }
        .detail-label {
          font-weight: bold;
          color: #555;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          color: #777;
          font-size: 12px;
        }
        .button {
          display: inline-block;
          background-color: #6a1b9a;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          margin-top: 20px;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>TruePass</h1>
          <p>Your ticket has been confirmed!</p>
        </div>

        <p>Dear Customer,</p>

        <p>Thank you for your purchase! Your ticket for <strong>${ticketData.eventName}</strong> has been confirmed.</p>

        <div class="ticket-details">
          <h3>Ticket Details</h3>

          <div class="detail-row">
            <span class="detail-label">Event:</span>
            <span>${ticketData.eventName}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Seat:</span>
            <span>${ticketData.seatNumber}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Price:</span>
            <span>${ticketData.price}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Purchase Date:</span>
            <span>${purchaseDate}</span>
          </div>

          <div class="detail-row">
            <span class="detail-label">Payment ID:</span>
            <span>${ticketData.paymentId || 'N/A'}</span>
          </div>
        </div>

        <p>Your ticket has been securely stored on the blockchain and can be accessed from your TruePass account.</p>

        <div style="text-align: center;">
          <a href="https://truepass-6d376.web.app/profile" class="button">
            View My Tickets
          </a>
        </div>

        <p>For any questions or assistance, please contact our support team.</p>

        <p>Best regards,<br>The TruePass Team</p>

        <div class="footer">
          <p>© 2023 TruePass. All rights reserved.</p>
          <p>
            This is an automated email. Please do not reply to this message.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
//# sourceMappingURL=index.js.map
