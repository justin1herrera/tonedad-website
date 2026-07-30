// tone.dad — browser mirror of the welcome emails.
// /welcome/<variant> is rewritten here by vercel.json. Renders the exact same
// HTML the subscriber was sent, so "VIEW IN BROWSER" never drifts from the email.
const welcomeEmail = require('./_welcome.js');

module.exports = (req, res) => {
  const url = new URL(req.url, 'https://tone.dad');
  const v = String(url.searchParams.get('v') || 'file').toLowerCase();
  const key = welcomeEmail.VARIANT_KEYS.indexOf(v) !== -1 ? v : 'file';

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.setHeader('X-Robots-Tag', 'noindex');   // these are inbox mirrors, not pages to rank
  res.status(200).send(welcomeEmail(key).html);
};
