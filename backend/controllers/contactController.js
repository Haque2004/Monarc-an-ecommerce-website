// Simple contact controller: accepts contact form and logs it.
const sendContact = async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email and message are required' });
  }

  // In a real app you'd persist this or send an email. For now, log and return success.
  console.log('Contact form submitted:', { name, email, subject, message });

  res.status(201).json({ message: 'Contact received' });
};

module.exports = { sendContact };
