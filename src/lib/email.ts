import nodemailer from 'nodemailer'

// Email configuration - uses environment variables
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface EmailOptions {
  to: string[]
  subject: string
  text?: string
  html?: string
}

/**
 * Send email notification
 * @param options Email options including recipients, subject, and content
 * @returns Promise with success status
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if email configuration is available
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log('Email not configured - skipping email send')
      return { success: true } // Don't fail if email is not configured
    }

    const mailOptions = {
      from: `"ARAM Education Platform" <${process.env.SMTP_USER}>`,
      to: options.to.join(', '),
      subject: options.subject,
      text: options.text,
      html: options.html,
    }

    await transporter.sendMail(mailOptions)
    return { success: true }
  } catch (error) {
    console.error('Email send error:', error)
    return { success: false, error: 'Failed to send email' }
  }
}

/**
 * Send login notification to teacher and parent
 * @param studentName Student's name
 * @param schoolName School name
 * @param classNumber Class (10, 11, or 12)
 * @param loginTime Login timestamp
 * @param teacherEmail Teacher's email
 * @param parentEmail Parent's email
 */
export async function sendLoginNotification(
  studentName: string,
  schoolName: string,
  classNumber: number,
  loginTime: Date,
  teacherEmail: string,
  parentEmail: string
) {
  const formattedTime = loginTime.toLocaleString()
  const recipients = [teacherEmail, parentEmail].filter(Boolean)

  console.log('Sending login notification to:', {
    teacherEmail,
    parentEmail,
    parentEmailIncluded: !!parentEmail,
    totalRecipients: recipients.length
  })

  const emailContent = {
    to: recipients,
    subject: `Login Notification - ${studentName}`,
    text: `
Dear Parent/Teacher,

This is to inform you that the student has logged in to the ARAM Education Platform.

Student Details:
- Name: ${studentName}
- School: ${schoolName}
- Class: ${classNumber}
- Login Time: ${formattedTime}

Please contact support if this activity is unauthorized.

Best regards,
ARAM Education Platform
    `.trim(),
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(to right, #059669, #0d9488); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">ARAM Education Platform</h1>
  </div>

  <div style="padding: 20px; background: #f9fafb;">
    <h2 style="color: #1f2937; margin-top: 0;">Login Notification</h2>

    <p>Dear Parent/Teacher,</p>

    <p>This is to inform you that the student has logged in to the ARAM Education Platform.</p>

    <div style="background: white; padding: 15px; border-left: 4px solid #059669; margin: 15px 0;">
      <h3 style="margin-top: 0; color: #059669;">Student Details:</h3>
      <p><strong>Name:</strong> ${studentName}</p>
      <p><strong>School:</strong> ${schoolName}</p>
      <p><strong>Class:</strong> ${classNumber}</p>
      <p><strong>Login Time:</strong> ${formattedTime}</p>
    </div>

    <p style="color: #6b7280;">Please contact support if this activity is unauthorized.</p>

    <p style="margin-top: 20px;">Best regards,<br><strong>ARAM Education Platform</strong></p>
  </div>

  <div style="background: #1f2937; color: white; padding: 15px; text-align: center;">
    <p style="margin: 0; font-size: 12px;">© 2025 ARAM Education Platform. All rights reserved.</p>
  </div>
</div>
    `.trim(),
  }

  return await sendEmail(emailContent)
}

/**
 * Send logout notification to teacher and parent
 * @param studentName Student's name
 * @param schoolName School name
 * @param classNumber Class (10, 11, or 12)
 * @param loginTime Login timestamp
 * @param logoutTime Logout timestamp
 * @param teacherEmail Teacher's email
 * @param parentEmail Parent's email
 */
export async function sendLogoutNotification(
  studentName: string,
  schoolName: string,
  classNumber: number,
  loginTime: Date,
  logoutTime: Date,
  teacherEmail: string,
  parentEmail: string
) {
  const formattedLoginTime = loginTime.toLocaleString()
  const formattedLogoutTime = logoutTime.toLocaleString()
  const duration = Math.round((logoutTime.getTime() - loginTime.getTime()) / 60000) // minutes
  const recipients = [teacherEmail, parentEmail].filter(Boolean)

  console.log('Sending logout notification to:', {
    teacherEmail,
    parentEmail,
    parentEmailIncluded: !!parentEmail,
    totalRecipients: recipients.length,
    sessionDuration: duration
  })

  const emailContent = {
    to: recipients,
    subject: `Logout Notification - ${studentName}`,
    text: `
Dear Parent/Teacher,

This is to inform you that the student has logged out of the ARAM Education Platform.

Student Details:
- Name: ${studentName}
- School: ${schoolName}
- Class: ${classNumber}
- Login Time: ${formattedLoginTime}
- Logout Time: ${formattedLogoutTime}
- Session Duration: ${duration} minutes

Best regards,
ARAM Education Platform
    `.trim(),
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background: linear-gradient(to right, #059669, #0d9488); padding: 20px; text-align: center;">
    <h1 style="color: white; margin: 0;">ARAM Education Platform</h1>
  </div>

  <div style="padding: 20px; background: #f9fafb;">
    <h2 style="color: #1f2937; margin-top: 0;">Logout Notification</h2>

    <p>Dear Parent/Teacher,</p>

    <p>This is to inform you that the student has logged out of the ARAM Education Platform.</p>

    <div style="background: white; padding: 15px; border-left: 4px solid #0891b2; margin: 15px 0;">
      <h3 style="margin-top: 0; color: #0891b2;">Student Details:</h3>
      <p><strong>Name:</strong> ${studentName}</p>
      <p><strong>School:</strong> ${schoolName}</p>
      <p><strong>Class:</strong> ${classNumber}</p>
      <p><strong>Login Time:</strong> ${formattedLoginTime}</p>
      <p><strong>Logout Time:</strong> ${formattedLogoutTime}</p>
      <p><strong>Session Duration:</strong> ${duration} minutes</p>
    </div>

    <p style="margin-top: 20px;">Best regards,<br><strong>ARAM Education Platform</strong></p>
  </div>

  <div style="background: #1f2937; color: white; padding: 15px; text-align: center;">
    <p style="margin: 0; font-size: 12px;">© 2025 ARAM Education Platform. All rights reserved.</p>
  </div>
</div>
    `.trim(),
  }

  return await sendEmail(emailContent)
}
