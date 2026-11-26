// Vercel Serverless Function — POST /api/contact
// Optional env vars in Vercel Project Settings -> Environment Variables:
//   RESEND_API_KEY     : Your Resend API key (https://resend.com)
//   CONTACT_TO_EMAIL   : Destination inbox for VMV Design Groups enquiries
//   CONTACT_FROM_EMAIL : Verified sender (e.g. "VMV Website <noreply@yourdomain.com>")

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const fullName = String(body.fullName || '').trim();
    const email = String(body.email || '').trim();
    const phone = String(body.phone || '').trim();
    const projectType = String(body.projectType || '').trim();
    const projectLocation = String(body.projectLocation || '').trim();
    const projectDescription = String(body.projectDescription || '').trim();

    if (fullName.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !projectType || !projectLocation || projectDescription.length < 15) {
      return res.status(400).json({ ok: false, error: 'Please complete all required enquiry fields.' });
    }

    const resendKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || 'vmvnexxusdesigngroup@gmail.com';
    const fromEmail = process.env.CONTACT_FROM_EMAIL || 'VMV Design Groups <onboarding@resend.dev>';

    if (resendKey && toEmail) {
      const emailRes = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: email,
          subject: `New ${projectType} Enquiry — ${fullName} (${projectLocation})`,
          text: [
            'New Project Enquiry — VMV Design Groups',
            '----------------------------------------',
            `Name: ${fullName}`,
            `Email: ${email}`,
            `Phone: ${phone || 'Not provided'}`,
            `Project Type: ${projectType}`,
            `Project Location: ${projectLocation}`,
            '',
            'Project Description:',
            projectDescription,
          ].join('\n'),
        }),
      });

      if (!emailRes.ok) {
        const errDetail = await emailRes.text();
        console.error('Resend error:', errDetail);
        return res.status(502).json({ ok: false, error: 'Email delivery service returned an error.' });
      }
    } else {
      // Logged in Vercel Function Logs until RESEND_API_KEY + CONTACT_TO_EMAIL are configured
      console.log('VMV Enquiry Received:', { fullName, email, phone, projectType, projectLocation });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Contact handler error:', err);
    return res.status(500).json({ ok: false, error: 'Internal server error' });
  }
}
