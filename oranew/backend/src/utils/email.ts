import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    console.log(`Email sent to ${options.to}`);
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

// Email Templates
export const getWelcomeEmailTemplate = (name: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Inter', sans-serif; color: #2D2D2D; background: #FDFBF7; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .logo { font-size: 32px; font-weight: bold; color: #FFD6E8; }
        .tagline { font-size: 14px; color: #6B6B6B; margin-top: 8px; }
        .content { background: white; padding: 40px; border-radius: 8px; }
        h1 { font-family: 'Cormorant Garamond', serif; font-size: 28px; margin-bottom: 20px; }
        .button { display: inline-block; padding: 12px 32px; background: #FFD6E8; color: #2D2D2D; text-decoration: none; border-radius: 8px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">ORA</div>
          <div class="tagline">own. radiate. adorn.</div>
        </div>
        <div class="content">
          <h1>Welcome to ORA, ${name}!</h1>
          <p>Thank you for joining our luxury jewellery community.</p>
          <p>We're delighted to have you here. Explore our exclusive collection of handcrafted artificial jewellery designed to make you shine.</p>
          <a href="${process.env.FRONTEND_URL}/products" class="button">Start Shopping</a>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const getOrderConfirmationTemplate = (orderNumber: string, totalAmount: number): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Inter', sans-serif; color: #2D2D2D; background: #FDFBF7; }
        .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .logo { font-size: 32px; font-weight: bold; color: #FFD6E8; }
        .content { background: white; padding: 40px; border-radius: 8px; }
        h1 { font-family: 'Cormorant Garamond', serif; font-size: 28px; margin-bottom: 20px; }
        .order-box { background: #FDFBF7; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .button { display: inline-block; padding: 12px 32px; background: #FFD6E8; color: #2D2D2D; text-decoration: none; border-radius: 8px; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">ORA</div>
        </div>
        <div class="content">
          <h1>Order Confirmed!</h1>
          <p>Thank you for your order. We're processing it now.</p>
          <div class="order-box">
            <strong>Order Number:</strong> ${orderNumber}<br>
            <strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}
          </div>
          <p>You will receive a shipping confirmation email once your order is on the way.</p>
          <a href="${process.env.FRONTEND_URL}/orders/${orderNumber}" class="button">Track Order</a>
        </div>
      </div>
    </body>
    </html>
  `;
};
