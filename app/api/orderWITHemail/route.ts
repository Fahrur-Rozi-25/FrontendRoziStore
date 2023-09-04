

import { Decrypt, Encrypt } from '@/crypto/encrypt';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST (request : Request) {

  const verify = process.env.APP_VERIFICATION_ORDER

  const { id , zoneid , product_name , category , brand , price , seller_name , buyer_sku_code , seller_price} = await request.json()

  const data: any = {
    verify,
    id: id+zoneid,
    buyer_sku_code,
  };

  const encryptionKey = process.env.ENCRYPTION_KEY || ""
  
  
  const encrypt = Encrypt(data , encryptionKey)
  const decryptedData = Decrypt(encrypt, encryptionKey);
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAILUSER_ADMIN,
      pass: process.env.EMAILPASSWORD_ADMIN,
    },
  });

  const orderId = encrypt;
  

  const confirmOrderLink = `https://webtopup.vercel.app/services/orders/acceptOrders/${orderId}`;
  const declineOrderLink = `https://example.com/order/${orderId}/decline`;

  const emailContent = `
  <p>Hello,</p>
  <h1>Please take action on the order:</h1>
  <h2>With Order:</h2>
  <p>ID : ${id}</p>
  <p>Zone ID :( ${zoneid} )</p>
  <p>category : ${category} </p>
  <p>Brand : ${brand} </p>
  <p>Product : ${product_name} </p>
  <p>Price : ${price} </p>
  <p>Seller Price : ${seller_price} </p>
  <p>Seller : ${seller_name} </p>
  <p>SKU Code : ${buyer_sku_code} </p>
  <p>Decrypted Data: ${JSON.stringify(decryptedData)}</p>
  <p>Nama : ${decryptedData.name}</p>
  
  <a href="${confirmOrderLink}">
    <button style="background-color: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
      Accept
    </button>
  </a>
  <span style="display: inline-block; width: 10px;"></span>
  <a href="${declineOrderLink}">
    <button style="background-color: #dc3545; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
      Decline
    </button>
  </a>

  <footer>
  <div>ROZISTORE ALL RIGHTREVERSED</div>
  </footer>
`;

  const mailOptions = {
    from: 'rozistoreemail@gmail.com',
    to: 'akungamesaya123456@gmail.com', // Ganti dengan alamat admin yang sesuai
    subject: "ORDER DETAIL",
    html: emailContent,
  };

  await transporter.sendMail(mailOptions);
  return NextResponse.json("Email Telah Terkirim , Tunggu Admin Untuk Memprosesnya..!")

}