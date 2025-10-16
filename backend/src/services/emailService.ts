import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;

  constructor() {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const config: EmailConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    };

    if (config.auth.user && config.auth.pass) {
      this.transporter = nodemailer.createTransporter(config);
    } else {
      console.warn('Email service not configured. Set SMTP_USER and SMTP_PASS environment variables.');
    }
  }

  async sendCredentialIssuedEmail(
    userEmail: string, 
    userName: string, 
    credentialType: string, 
    tokenId: string,
    txHash: string
  ): Promise<boolean> {
    if (!this.transporter) {
      console.log('Email service not available. Would send:', {
        to: userEmail,
        subject: 'Your Credential Has Been Issued',
        credentialType,
        tokenId,
        txHash
      });
      return false;
    }

    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: userEmail,
        subject: '🎉 Your Digital Credential Has Been Issued - IdentiChain',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
            <div style="background: linear-gradient(135deg, #4f46e5, #06b6d4); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Credential Issued!</h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Your digital identity credential is ready</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #1f2937; margin-top: 0;">Hello ${userName},</h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                Great news! Your <strong>${credentialType}</strong> credential has been successfully issued and is now available in your digital wallet.
              </p>
              
              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #374151; margin-top: 0;">Credential Details:</h3>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Type:</strong> ${credentialType}</p>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Token ID:</strong> ${tokenId}</p>
                <p style="margin: 5px 0; color: #6b7280;"><strong>Transaction:</strong> <a href="https://sepolia.etherscan.io/tx/${txHash}" target="_blank" style="color: #4f46e5;">View on Etherscan</a></p>
              </div>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                You can now use this credential to verify your identity and access services that require ${credentialType} verification.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/user-dashboard" 
                   style="background: linear-gradient(135deg, #4f46e5, #06b6d4); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  View Your Credentials
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="color: #9ca3af; font-size: 14px; text-align: center;">
                This is an automated message from IdentiChain. Please do not reply to this email.<br>
                If you have any questions, please contact our support team.
              </p>
            </div>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Credential issued email sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('Failed to send credential issued email:', error);
      return false;
    }
  }

  async sendAccessRequestEmail(
    userEmail: string,
    userName: string,
    requesterAddress: string,
    purpose: string,
    requestId: string,
    txHash: string
  ): Promise<boolean> {
    if (!this.transporter) {
      console.log('Email service not available. Would send:', {
        to: userEmail,
        subject: 'Access Request Received',
        requesterAddress,
        purpose,
        requestId,
        txHash
      });
      return false;
    }

    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: userEmail,
        subject: '🔐 New Access Request - IdentiChain',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
            <div style="background: linear-gradient(135deg, #dc2626, #f59e0b); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Access Request</h1>
              <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Someone wants to access your data</p>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <h2 style="color: #1f2937; margin-top: 0;">Hello ${userName},</h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                You have received a new access request for your personal data. Please review the details below and decide whether to approve or deny this request.
              </p>
              
              <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #dc2626; margin-top: 0;">Request Details:</h3>
                <p style="margin: 5px 0; color: #7f1d1d;"><strong>Requester:</strong> ${requesterAddress}</p>
                <p style="margin: 5px 0; color: #7f1d1d;"><strong>Purpose:</strong> ${purpose}</p>
                <p style="margin: 5px 0; color: #7f1d1d;"><strong>Request ID:</strong> ${requestId}</p>
                <p style="margin: 5px 0; color: #7f1d1d;"><strong>Transaction:</strong> <a href="https://sepolia.etherscan.io/tx/${txHash}" target="_blank" style="color: #dc2626;">View on Etherscan</a></p>
              </div>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                <strong>Important:</strong> Only approve this request if you trust the requester and understand why they need access to your data.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/user-dashboard" 
                   style="background: linear-gradient(135deg, #dc2626, #f59e0b); color: white; padding: 12px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                  Review & Approve Request
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="color: #9ca3af; font-size: 14px; text-align: center;">
                This is an automated message from IdentiChain. Please do not reply to this email.<br>
                If you have any questions, please contact our support team.
              </p>
            </div>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
      console.log(`Access request email sent to ${userEmail}`);
      return true;
    } catch (error) {
      console.error('Failed to send access request email:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
