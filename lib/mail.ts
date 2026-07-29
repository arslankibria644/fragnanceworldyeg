import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOrderConfirmationEmail(
  to: string,
  orderNumber: string,
  items: { name: string; size: string; quantity: number; price: number }[],
  total: number
) {
  const itemsHtml = items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name} (${item.size})</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #eee;">PKR ${item.price.toLocaleString()}</td>
    </tr>
  `
    )
    .join("");

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `Order Confirmation - ${orderNumber} | Fragrance World YEG`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0f2d21 0%, #1a4d38 100%); padding: 30px; text-align: center;">
          <h1 style="color: #d4af37; font-size: 28px; margin: 0; letter-spacing: 2px;">FRAGRANCE WORLD YEG</h1>
          <p style="color: #aed3bb; margin: 5px 0 0; letter-spacing: 3px; font-size: 11px;">PREMIUM FRAGRANCES</p>
        </div>
        <div style="padding: 30px; background: #fff;">
          <h2 style="color: #1f6043;">Order Confirmed!</h2>
          <p style="color: #666;">Thank you for your order. Your order number is <strong>${orderNumber}</strong>.</p>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f5f5f5;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: left;">Qty</th>
                <th style="padding: 10px; text-align: left;">Price</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <div style="text-align: right; margin-top: 20px;">
            <strong style="font-size: 18px;">Total: PKR ${total.toLocaleString()}</strong>
          </div>
          <p style="color: #666; margin-top: 20px;">We will notify you when your order is shipped.</p>
        </div>
        <div style="background: #0f2d21; padding: 20px; text-align: center;">
          <p style="color: #aed3bb; margin: 0; font-size: 12px;">© 2024 Fragrance World YEG. All rights reserved.</p>
        </div>
      </div>
    `,
  });
}

export async function sendLowStockAlert(
  productName: string,
  sku: string,
  stock: number
) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.SMTP_USER,
    subject: `Low Stock Alert: ${productName}`,
    html: `
      <p>Low stock alert for <strong>${productName}</strong> (SKU: ${sku})</p>
      <p>Current stock: <strong>${stock}</strong> units remaining.</p>
    `,
  });
}
