function createTransporter() {
  const user = (process.env.SMTP_USER || '').trim();
  const pass = (process.env.SMTP_PASS || '').trim().replace(/\s+/g, '');
  if (!user || !pass) return null;
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  });
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
  const t = createTransporter();
  const user = (process.env.SMTP_USER || '').trim();
  if (!t) {
    console.log(`[OTP CONSOLE FALLBACK] ${toEmail}: ${otp}`);
    return { sent: false, reason: 'SMTP not configured' };
  }
  const html = wrapHtml(`
    <p>Namaste &#128591;</p>
    <p>Use this code to sign in to your <strong style="color:#C9A96E;">Kaithi Ayurveda</strong> account:</p>
    <div style="background:rgba(201,169,110,0.1);border:1px dashed #C9A96E;border-radius:10px;padding:22px;text-align:center;margin:24px 0;">
      <span style="font-size:36px;font-weight:bold;letter-spacing:10px;color:#C9A96E;">${otp}</span>
      <p style="margin:10px 0 0;font-size:12px;color:#8C9985;">Valid for 10 minutes &middot; Do not share with anyone</p>
    </div>
    <p style="font-size:13px;color:#8C9985;">If you didn't request this, ignore this email.</p>
  `);
  try {
    const info = await t.sendMail({
      from: `"Kaithi Ayurveda" <${user}>`,
      to: toEmail,
      subject: `${otp} \u2014 Kaithi Ayurveda Verification Code`,
      html
    });
    console.log(`[OTP SENT SUCCESS] to: ${toEmail}, messageId: ${info.messageId}`);
    return { sent: true, messageId: info.messageId };
  } catch (err) {
    console.error('[OTP SEND ERROR]', err.message);
    // Secondary attempt with fallback transport
    try {
      const pass = (process.env.SMTP_PASS || '').trim().replace(/\s+/g, '');
      const altTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
      });
      const altInfo = await altTransporter.sendMail({
        from: `"Kaithi Ayurveda" <${user}>`,
        to: toEmail,
        subject: `${otp} \u2014 Kaithi Ayurveda Verification Code`,
        html
      });
      console.log(`[OTP SENT ALT SUCCESS] to: ${toEmail}, messageId: ${altInfo.messageId}`);
      return { sent: true, messageId: altInfo.messageId };
    } catch (altErr) {
      console.error('[OTP SEND ALT ERROR]', altErr.message);
      return { sent: false, error: altErr.message };
    }
  }
}

async function sendAdminNewOrderNotification(order) {
  const t = createTransporter();
  const user = (process.env.SMTP_USER || '').trim();
  const adminEmail = process.env.ADMIN_EMAIL || user || 'khakhkharrushit@gmail.com';
  if (!t) { console.log(`[ADMIN ORDER ALERT] ${order.order_number} to ${adminEmail}`); return { sent: false }; }
  const siteUrl = process.env.SITE_URL || 'https://kaithi-ayurveda.onrender.com';
  const itemsHtml = (order.items || []).map(i =>
    `<tr>
      <td style="padding:10px 0;border-bottom:1px solid rgba(201,169,110,0.15);font-size:13px;color:#F5EFEB;"><strong>${i.product_name||i.name}</strong><br/><span style="color:#8C9985;font-size:11px;">${i.weight||''}</span></td>
      <td style="padding:10px 0;border-bottom:1px solid rgba(201,169,110,0.15);font-size:13px;color:#D8D2C6;text-align:center;">&times;${i.quantity}</td>
      <td style="padding:10px 0;border-bottom:1px solid rgba(201,169,110,0.15);font-size:13px;color:#C9A96E;text-align:right;"><strong>&#8377;${i.price*i.quantity}</strong></td>
    </tr>`
  ).join('');

  const html = wrapHtml(`
    <div style="background:rgba(201,169,110,0.15);border:1px solid #C9A96E;border-radius:8px;padding:14px;text-align:center;margin-bottom:20px;">
      <div style="font-size:11px;text-transform:uppercase;letter-spacing:2px;color:#A3B899;">New Order Received</div>
      <div style="font-size:24px;font-weight:bold;color:#C9A96E;letter-spacing:2px;margin:4px 0;">&#8377;${order.total_amount} &middot; ${order.order_number}</div>
      <div style="font-size:12px;color:#5BBF74;">Payment Method: ${order.payment_method?.toUpperCase() || 'UPI/ONLINE'} (${order.payment_status?.toUpperCase() || 'PAID'})</div>
    </div>

    <h3 style="color:#C9A96E;font-size:16px;margin:0 0 10px;border-bottom:1px solid rgba(201,169,110,0.2);padding-bottom:6px;">Customer Details</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;font-size:13px;">
      <tr><td style="color:#8C9985;padding:4px 0;">Name:</td><td style="color:#F5EFEB;padding:4px 0;text-align:right;"><strong>${order.customer_name}</strong></td></tr>
      <tr><td style="color:#8C9985;padding:4px 0;">Email:</td><td style="color:#F5EFEB;padding:4px 0;text-align:right;"><a href="mailto:${order.customer_email}" style="color:#C9A96E;text-decoration:none;">${order.customer_email}</a></td></tr>
      <tr><td style="color:#8C9985;padding:4px 0;">Phone:</td><td style="color:#F5EFEB;padding:4px 0;text-align:right;"><a href="tel:${order.customer_phone}" style="color:#C9A96E;text-decoration:none;">${order.customer_phone}</a></td></tr>
      <tr><td style="color:#8C9985;padding:4px 0;">Address:</td><td style="color:#D8D2C6;padding:4px 0;text-align:right;">${order.shipping_address}, ${order.city}, ${order.state} &ndash; ${order.pincode}</td></tr>
    </table>

    <h3 style="color:#C9A96E;font-size:16px;margin:0 0 10px;border-bottom:1px solid rgba(201,169,110,0.2);padding-bottom:6px;">Ordered Items</h3>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
      <thead><tr>
        <th style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#6E7D6A;text-align:left;padding-bottom:6px;">Item</th>
        <th style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#6E7D6A;text-align:center;padding-bottom:6px;">Qty</th>
        <th style="font-size:11px;letter-spacing:1px;text-transform:uppercase;color:#6E7D6A;text-align:right;padding-bottom:6px;">Amount</th>
      </tr></thead>
      <tbody>${itemsHtml}</tbody>
    </table>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <tr><td style="font-size:13px;color:#8C9985;padding:2px 0;">Subtotal</td><td style="font-size:13px;color:#D8D2C6;text-align:right;padding:2px 0;">&#8377;${order.subtotal || order.total_amount}</td></tr>
      ${order.discount_amount>0?`<tr><td style="font-size:13px;color:#8C9985;padding:2px 0;">Discount (${order.coupon_code||'Promo'})</td><td style="font-size:13px;color:#5BBF74;text-align:right;padding:2px 0;">&minus;&#8377;${order.discount_amount}</td></tr>`:''}
      <tr><td style="font-size:13px;color:#8C9985;padding:2px 0;">Shipping</td><td style="font-size:13px;color:#D8D2C6;text-align:right;padding:2px 0;">${order.shipping_fee===0?'FREE':'&#8377;'+order.shipping_fee}</td></tr>
      <tr><td style="font-size:16px;font-weight:bold;color:#F5EFEB;padding:8px 0 0;">Total Order Value</td><td style="font-size:18px;font-weight:bold;color:#C9A96E;text-align:right;padding:8px 0 0;">&#8377;${order.total_amount}</td></tr>
    </table>

    <div style="text-align:center;margin-top:24px;">
      <a href="${siteUrl}" style="display:inline-block;background:#C9A96E;color:#0D1F12;font-weight:bold;font-size:13px;padding:12px 28px;border-radius:25px;text-decoration:none;letter-spacing:1px;">&#128203; Open Admin Portal</a>
    </div>
  `);

  try {
    const info = await t.sendMail({
      from: `"Kaithi Orders" <${user}>`,
      to: adminEmail,
      subject: `\uD83D\uDEA8 New Order Alert: ${order.order_number} (\u20B9${order.total_amount}) \u2014 ${order.customer_name}`,
      html
    });
    console.log(`[ADMIN ALERT SENT] to: ${adminEmail}, messageId: ${info.messageId}`);
    return { sent: true };
  } catch (err) {
    console.error('sendAdminNewOrderNotification error:', err.message);
    return { sent: false, error: err.message };
  }
}

async function sendOrderConfirmationEmail(order) {
  const t = createTransporter();
  const user = (process.env.SMTP_USER || '').trim();
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

  try {
    // Send customer confirmation
    await t.sendMail({ from: `"Kaithi Ayurveda" <${user}>`, to: order.customer_email, subject: `\u2705 Order Confirmed \u2014 ${order.order_number} | Kaithi Ayurveda`, html });
  } catch (err) {
    console.error('sendOrderConfirmationEmail error:', err.message);
  }

  // Also send Admin Notification alert
  sendAdminNewOrderNotification(order).catch(err => console.error('Admin order alert error:', err.message));

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
  const t = createTransporter();
  const user = (process.env.SMTP_USER || '').trim();
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
  await t.sendMail({ from: `"Kaithi Ayurveda" <${user}>`, to: order.customer_email, subject: `${cfg.emoji} ${order.order_status} \u2014 Order ${order.order_number} | Kaithi Ayurveda`, html });
  return { sent: true };
}

module.exports = {
  sendOtpEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
  sendAdminNewOrderNotification
};
