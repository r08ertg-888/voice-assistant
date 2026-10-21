interface Inquiry {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  organization?: string;
  topic: string;
  message: string;
  timeframe?: string;
}

const inquiries: Inquiry[] = [
  {
    id: 'inq-initial',
    timestamp: new Date().toISOString(),
    name: 'Executive Partner',
    email: 'advisory@boardroom.org',
    organization: 'Global Capital Syndicate',
    topic: 'Enterprise AI & Governance Advisory',
    message: 'Requesting preliminary discussion regarding Q3 advisory engagement.',
    timeframe: 'Next 2-3 weeks',
  },
];

export default async function handler(req: any, res: any) {
  if (req.method === 'GET') {
    return res.status(200).json({ inquiries });
  }

  if (req.method === 'POST') {
    const { name, email, organization, topic, message, timeframe } = req.body || {};
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required.' });
    }

    const newInquiry: Inquiry = {
      id: `inq-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
      name,
      email,
      organization: organization || 'Confidential',
      topic: topic || 'General Executive Inquiry',
      message,
      timeframe: timeframe || 'Standard scheduling',
    };

    inquiries.unshift(newInquiry);

    return res.status(201).json({
      success: true,
      inquiry: newInquiry,
      alexConfirmation: `Thank you, ${name}. I have registered your consultation brief for Robert Gammer. Robert reviews all advisory inquiries personally and will respond via ${email}.`,
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
