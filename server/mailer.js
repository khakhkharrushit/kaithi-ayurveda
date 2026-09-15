'use strict';
const nodemailer = require('nodemailer');

let _transporter = null;

function getTransporter() {
  if (_transporter) return _transporter;
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  _transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
  return _transporter;
}

function wrapHtml(bodyHtml) {
  return `<!DOCTYPE html><html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#0B1C10;font-family:Georgia,serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0B1C10;padding:40px 0;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0"
  style="max-width:560px;background:#0D1F12;border:1px solid #C9A96E;border-radius:14px;overflow:hidden;">
<tr><td style="background:linear-gradient(135deg,#0D1F12 0%,#1A3D20 100%);padding:32px 40px 24px;text-align:center;border-bottom:1px solid rgba(201,169,110,0.3);">
  <div style="font-size:28px;font-weight:bold;letter-spacing:4px;color:#C9A96E;">KAITHI AYURVEDA</div>
  <div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#A3B899;margin-top:6px;">Dr. Nidhi Khakhkhar (BAMS) &middot; Kodinar, Gujarat</div>
</td></tr>
<tr><td style="padding:32px 40px;color:#D8D2C6;font-size:15px;line-height:1.7;">${bodyHtml}</td></tr>
<tr><td style="padding:20px 40px 28px;text-align:center;border-top:1px solid rgba(201,169,110,0.2);">
  <p style="margin:0;font-size:11px;color:#6E7D6A;letter-spacing:1px;">Ravi Complex, Avni Apartment, Kodinar, Gujarat &ndash; 362720<br/>&#128222; +91 9228207999 &nbsp;|&nbsp; kaithi-ayurveda.onrender.com</p>
</td></tr>
</table>
</td></tr></table></body></html>`;
}

async function sendOtpEmail(toEmail, otp) {
  const t = getTransporter();
  if (!t) { console.log(`[OTP] ${toEmail}: ${otp}`); return { sent: false }; }
  const html = wrapHtml(`
    <p>Namaste &#128591;</p>
    <p>Use this code to sign in to your <strong style="color:#C9A96E;">Kaithi Ayurveda</strong> account:</p>
    <div style="background:rgba(201,169,110,0.1);border:1px dashed #C9A96E;border-radius:10px;padding:22px;text-align:center;margin:24px 0;">
      <span style="font-size:36px;font-weight:bold;letter-spacing:10px;color:#C9A96E;">${otp}</span>
      <p style="margin:10px 0 0;font-size:12px;color:#8C9985;">Valid for 10 minutes &middot; Do not share with anyone</p>
    </div>
    <p style="font-size:13px;color:#8C9985;">If you didn't request this, ignore this email.</p>
  `);
  await t.sendMail({ from: `"Kaithi Ayurveda" <${process.env.SMTP_USER}>`, to: toEmail, subject: `${otp} \u2014 Kaithi Ayurveda Verification Code`, html });
  return { sent: true };
}

async function sendOrderConfirmationEmail(order) {
  const t = getTransporter();
  if (!t) { console.log(`[ORDER CONFIRM] ${order.customer_email} ${order.order_number}`); return { sent: false }; }
  const siteUrl = process.env.SITE_URL || 'https://kaithi-ayurveda.onrender.com';
  const itemsHtml = (order.items || []).map(i =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid rgba(201,169,110,0.12);font-size:13px;color:#D8D2C6;">${i.product_name||i.name}</td><td style="padding:8px 0;border-bottom:1px solid rgba(201,169,110,0.12);font-size:13px;color:#D8D2C6;text-align:center;">&times;${i.quantity}</td><td style="padding:8px 0;border-bottom:1px solid rgba(201,169,110,0.12);font-size:13px;color:#C9A96E;text-align:right;">&#8377;${i.price*i.quantity}</td></tr>`
  ).join('');
  const html = wrapHtml(`
    <p>Namaste, <strong style="color:#C9A96E;">${order.customer_name}</strong> &#127807;</p>
    <p>Your order has been <strong style="color:#5BBF74;">successfully placed</strong>! We'll start preparing your herbal formulations right away.</p>
    <div style="background:rgba(201,169,110,0.12);border:1px solid rgba(201,169,110,0.4);border-radius:8px;padding:14px 20px;margin-bottom:22px;text-align:center;">
      <span style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#A3B899;">Order Reference</span><br/>
      <strong style="font-size:22px;color:#C9A96E;letter-spacing:3px;">${order.order_number}</strong>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
      <thead><tr>
        <th style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#6E7D6A;text-align:left;padding-bottom:8px;border-bottom:1px solid rgba(201,169,110,0.3);">Product</th>
        <th style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#6E7D6A;text-align:center;padding-bottom:8px;border-bottom:1px solid rgba(201,169,110,0.3);">Qty</th>
        <th style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#6E7D6A;text-align:right;padding-bottom:8px;border-bottom:1px solid rgba(201,169,110,0.3);">Amount</th>
      </tr></thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${order.discount_amount>0?`<tr><td style="font-size:13px;color:#8C9985;padding:3px 0;">Discount</td><td style="font-size:13px;color:#5BBF74;text-align:right;padding:3px 0;">&minus;&#8377;${order.discount_amount}</td></tr>`:''}
      <tr><td style="font-size:13px;color:#8C9985;padding:3px 0;">Shipping</td><td style="font-size:13px;color:#D8D2C6;text-align:right;padding:3px 0;">${order.shipping_fee===0?'FREE':'&#8377;'+order.shipping_fee}</td></tr>
      <tr><td style="font-size:16px;font-weight:bold;color:#F5EFEB;padding:10px 0 0;">Total Paid</td><td style="font-size:20px;font-weight:bold;color:#C9A96E;text-align:right;padding:10px 0 0;">&#8377;${order.total_amount}</td></tr>
    </table>
    <div style="background:rgba(255,255,255,0.03);border-left:3px solid #C9A96E;padding:12px 16px;border-radius:0 8px 8px 0;margin-bottom:24px;font-size:13px;color:#A3B899;">
      <strong style="color:#C9A96E;">Delivering to:</strong><br/>${order.shipping_address}, ${order.city}, ${order.state} &ndash; ${order.pincode}
    </div>
    <div style="text-align:center;margin-top:24px;">
      <a href="${siteUrl}?feedback=1&amp;order=${order.order_number}" style="display:inline-block;background:#C9A96E;color:#0D1F12;font-weight:bold;font-size:13px;padding:12px 28px;border-radius:25px;text-decoration:none;letter-spacing:1px;">&#11088; Share Your Feedback</a>
    </div>
    <p style="margin:20px 0 0;font-size:12px;color:#6E7D6A;text-align:center;">Questions? Reply to this email or call +91 9228207999</p>
  `);
  await t.sendMail({ from: `"Kaithi Ayurveda" <${process.env.SMTP_USER}>`, to: order.customer_email, subject: `\u2705 Order Confirmed \u2014 ${order.order_number} | Kaithi Ayurveda`, html });
  return { sent: true };
}

const STATUS_CFG = {
  'Processing': { emoji: '\u2697\uFE0F', headline: 'Your order is being prepared', color: '#E8A838', body: 'Our herbalists are carefully crafting your Ayurvedic formulations using traditional Kshir Pak Vidhi methods.' },
  'Shipped':    { emoji: '\uD83D\uDE9A', headline: 'Your order is on its way!',     color: '#4A9EBF', body: 'Your herbal package has been dispatched. Expect delivery within 3\u20137 working days.' },
  'Out for Delivery': { emoji: '\uD83D\uDCE6', headline: 'Out for delivery today!', color: '#5BBF74', body: 'Your order is with the courier and will arrive at your doorstep today.' },
  'Delivered':  { emoji: '\uD83C\uDF3F', headline: 'Your order has been delivered!',color: '#5BBF74', body: 'We hope your Kaithi Ayurveda formulations bring you wellness and vitality. Thank you for being part of our healing community!' },
  'Cancelled':  { emoji: '\u274C',        headline: 'Your order has been cancelled', color: '#C0392B', body: 'Your order has been cancelled. If you were charged, a refund will be initiated within 5\u20137 business days.' }
};

async function sendOrderStatusEmail(order) {
  const t = getTransporter();
  if (!t) { console.log(`[ORDER STATUS] ${order.customer_email}: ${order.order_status}`); return { sent: false }; }
  const siteUrl = process.env.SITE_URL || 'https://kaithi-ayurveda.onrender.com';
  const cfg = STATUS_CFG[order.order_status] || { emoji: '\uD83D\uDCCB', headline: `Status updated: ${order.order_status}`, color: '#C9A96E', body: 'Your order status has been updated.' };
  const trackingHtml = order.tracking_number ? `
    <div style="background:rgba(74,158,191,0.1);border:1px solid rgba(74,158,191,0.4);border-radius:8px;padding:14px 20px;margin:20px 0;text-align:center;">
      <span style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#A3B899;">Tracking Number</span><br/>
      <strong style="font-size:18px;color:#4A9EBF;letter-spacing:2px;">${order.tracking_number}</strong>
    </div>` : '';
  const feedbackHtml = order.order_status === 'Delivered' ? `
    <div style="text-align:center;margin-top:28px;">
      <p style="margin:0 0 14px;font-size:14px;color:#A3B899;">How was your experience? Your feedback helps us serve you better.</p>
      <a href="${siteUrl}?feedback=1&amp;order=${order.order_number}" style="display:inline-block;background:#C9A96E;color:#0D1F12;font-weight:bold;font-size:13px;padding:12px 28px;border-radius:25px;text-decoration:none;letter-spacing:1px;">&#11088; Leave a Review</a>
    </div>` : `
    <div style="text-align:center;margin-top:24px;">
      <a href="${siteUrl}" style="display:inline-block;background:rgba(201,169,110,0.15);color:#C9A96E;font-weight:bold;font-size:12px;padding:10px 24px;border-radius:20px;text-decoration:none;border:1px solid rgba(201,169,110,0.4);letter-spacing:1px;">View My Orders</a>
    </div>`;
  const html = wrapHtml(`
    <div style="text-align:center;margin-bottom:24px;">
      <div style="font-size:48px;margin-bottom:12px;">${cfg.emoji}</div>
      <h2 style="margin:0;font-size:22px;color:${cfg.color};font-weight:bold;">${cfg.headline}</h2>
    </div>
    <p>Hi <strong style="color:#C9A96E;">${order.customer_name}</strong>,</p>
    <p style="color:#A3B899;font-size:14px;">${cfg.body}</p>
    <div style="background:rgba(201,169,110,0.08);border:1px solid rgba(201,169,110,0.3);border-radius:8px;padding:12px 20px;margin:14px 0;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr><td style="font-size:13px;color:#8C9985;">Order</td><td style="font-size:13px;color:#C9A96E;text-align:right;"><strong>${order.order_number}</strong></td></tr>
        <tr><td style="font-size:13px;color:#8C9985;padding-top:6px;">Status</td><td style="font-size:13px;text-align:right;padding-top:6px;"><strong style="color:${cfg.color};">${order.order_status}</strong></td></tr>
      </table>
    </div>
    ${trackingHtml}
    ${feedbackHtml}
    <p style="margin:20px 0 0;font-size:12px;color:#6E7D6A;text-align:center;">Questions? Reply to this email or call +91 9228207999</p>
  `);
  await t.sendMail({ from: `"Kaithi Ayurveda" <${process.env.SMTP_USER}>`, to: order.customer_email, subject: `${cfg.emoji} ${order.order_status} \u2014 Order ${order.order_number} | Kaithi Ayurveda`, html });
  return { sent: true };
}

module.exports = { sendOtpEmail, sendOrderConfirmationEmail, sendOrderStatusEmail };
