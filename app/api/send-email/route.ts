import { NextResponse } from "next/server";
import nodemailer, { SentMessageInfo } from "nodemailer";

import { createSupabaseServer } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = createSupabaseServer();
  const resp = await request.json();
  const data = resp.data;

  // Set up Nodemailer
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: "hi.kartikeyasaini@gmail.com", // Gmail address
      pass: process.env.SMTP_PASSWORD as string, // App-specific password or your SMTP password
    },
  });

  // Compose the email
  const mailOptions = {
    from: "Kartikeya Saini <weekly_newsletter@example.com>", // Sender address
    to: resp.email, // List of recipients
    subject: "Aid-Grid - Weekly Newsletter", // Subject line
    html: "Link here", // HTML body
  };

  // Send the email
  try {
    const info: SentMessageInfo = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return NextResponse.json({ success: true, info }, { status: 200 });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
