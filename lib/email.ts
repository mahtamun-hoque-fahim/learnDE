import { Resend } from 'resend'

const FROM = process.env.EMAIL_FROM || 'LearnD.E. <noreply@learnde.dev>'
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://learnde.vercel.app'

function getResend() {
  if (!process.env.RESEND_API_KEY) return null
  return new Resend(process.env.RESEND_API_KEY)
}

// ── Notify staff when a new submission arrives ─────────────────────────────
export async function sendNewSubmissionAlert(opts: {
  staffEmails: string[]
  studentName: string
  university: string
  department: string
  submissionId: number
}) {
  const resend = getResend(); if (!resend) return
  await resend.emails.send({
    from: FROM,
    to: opts.staffEmails,
    subject: `📬 New Certificate Request — ${opts.studentName}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:12px;border:1px solid #1a1a1a">
        <h1 style="font-size:20px;margin:0 0 8px">New Certificate Request</h1>
        <p style="color:#888;margin:0 0 24px;font-size:14px">A student has completed the LearnD.E. course and is requesting a certificate.</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#888;font-size:13px;width:120px">Name</td><td style="color:#fff;font-size:13px">${opts.studentName}</td></tr>
          <tr><td style="padding:8px 0;color:#888;font-size:13px">University</td><td style="color:#fff;font-size:13px">${opts.university}</td></tr>
          <tr><td style="padding:8px 0;color:#888;font-size:13px">Department</td><td style="color:#fff;font-size:13px">${opts.department}</td></tr>
        </table>
        <a href="${BASE_URL}/staff/submissions/${opts.submissionId}" style="display:inline-block;margin-top:24px;padding:12px 24px;background:#00e676;color:#000;font-weight:700;border-radius:8px;text-decoration:none;font-size:14px">
          Review Submission →
        </a>
        <p style="color:#444;font-size:12px;margin-top:24px">LearnD.E. · Differential Equations Course</p>
      </div>
    `,
  })
}

// ── Notify student their certificate is ready ──────────────────────────────
export async function sendCertificateReady(opts: {
  studentEmail: string
  studentName: string
  certificateId: string
  quoteText?: string
  quoteAuthor?: string
}) {
  const resend = getResend(); if (!resend) return
  await resend.emails.send({
    from: FROM,
    to: opts.studentEmail,
    subject: `🎓 Your Certificate is Ready — LearnD.E.`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:12px;border:1px solid #1a1a1a">
        <h1 style="font-size:20px;margin:0 0 8px">Congratulations, ${opts.studentName}! 🎉</h1>
        <p style="color:#888;margin:0 0 24px;font-size:14px">Your coursework has been verified and your certificate is ready.</p>
        ${opts.quoteText ? `
        <div style="background:#0d1a0d;border:1px solid #00e67622;border-radius:8px;padding:16px;margin-bottom:24px">
          <p style="color:#ddd;font-style:italic;margin:0 0 8px;font-size:14px">"${opts.quoteText}"</p>
          ${opts.quoteAuthor ? `<p style="color:#00e676;font-size:12px;margin:0">— ${opts.quoteAuthor}</p>` : ''}
        </div>` : ''}
        <p style="color:#888;font-size:13px;margin:0 0 8px">Certificate ID: <code style="color:#00e676">${opts.certificateId}</code></p>
        <a href="${BASE_URL}/dashboard" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#00e676;color:#000;font-weight:700;border-radius:8px;text-decoration:none;font-size:14px">
          View Your Certificate →
        </a>
        <p style="color:#444;font-size:12px;margin-top:24px">LearnD.E. · Differential Equations Course</p>
      </div>
    `,
  })
}

// ── Notify student their submission was rejected ───────────────────────────
export async function sendRejectionNotice(opts: {
  studentEmail: string
  studentName: string
  reason: string
}) {
  const resend = getResend(); if (!resend) return
  await resend.emails.send({
    from: FROM,
    to: opts.studentEmail,
    subject: `LearnD.E. — Certificate Request Update`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;background:#0a0a0a;color:#fff;padding:32px;border-radius:12px;border:1px solid #1a1a1a">
        <h1 style="font-size:20px;margin:0 0 8px">Certificate Request Update</h1>
        <p style="color:#888;margin:0 0 16px;font-size:14px">Hi ${opts.studentName}, your certificate request needs some attention.</p>
        <div style="background:#1a0a0a;border:1px solid #ff444422;border-radius:8px;padding:16px;margin-bottom:24px">
          <p style="color:#ff8888;font-size:13px;margin:0">${opts.reason}</p>
        </div>
        <p style="color:#888;font-size:13px">Please complete any missing coursework and re-submit from your dashboard.</p>
        <a href="${BASE_URL}/dashboard" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#fff;color:#000;font-weight:700;border-radius:8px;text-decoration:none;font-size:14px">
          Go to Dashboard →
        </a>
      </div>
    `,
  })
}
