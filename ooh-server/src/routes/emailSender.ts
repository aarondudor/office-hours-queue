import nodemailer, { Transporter } from 'nodemailer';

// configure nodemailer transporter
const transporter: Transporter = nodemailer.createTransport({
  secure: true,
});

/**
 * Sends an email to the specified recipient with the specified subject and message.
 *
 * @param recipient The recipient's email address
 * @throws If there is a server error
 */
export async function sendEmail(recipient: string): Promise<void> {
  const info = await transporter.sendMail({
    from: 'officehourhacks@gmail.com',
    to: recipient,
    subject: 'It\'s Your Turn!',
    text: 'Hey there! Please come to CS 2770 for your office hours appointment. Thank you!'
  });

  console.log("Message sent: " + info.messageId);
}
