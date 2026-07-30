// tone.dad — server-side lead capture.
//   1) Subscribes the lead to Beehiiv (source-tagged), keeping the API key secret.
//   2) Instantly emails Justin the lead's details (via Resend) so no hot lead is missed.
//
// Env vars (set via `vercel env add`):
//   BEEHIIV_API_KEY, BEEHIIV_PUB_ID  — required for capture (already set)
//   RESEND_API_KEY                   — required for the instant notify email
//   LEAD_NOTIFY_TO (optional)        — where the alert goes. default herrera.justin@gmail.com
//   LEAD_FROM      (optional)        — sender. default "tone.dad leads <onboarding@resend.dev>"
// If RESEND_API_KEY is absent, capture still works exactly as before; the email is simply skipped.
//
// Bot filtering (added 2026-07-26): honeypot field + form-fill timing + a
// gmail dot-farm heuristic. See spamReason() below. Blocked attempts are logged
// with a [spam] prefix — filter for that in the Vercel log view to see volume.

const welcomeEmail = require('./_welcome.js');

// A homepage-inline signup is labelled by the segment the person picked, so a
// wedding lead reads as a wedding lead in the inbox instead of a newsletter signup.
const SEGMENT_LABEL = {
  wedding:   'WEDDING inquiry · homepage',
  homes:     'Tonehomes · buying or selling',
  learn:     'Learn video · homepage',
  noblepost: 'Noblepost · shoots weddings',
  website:   'Website build · homepage'
};

// homepage-inline segment -> welcome-email variant. Everything else gets the file.
const SEGMENT_VARIANT = {
  wedding: 'wedding', homes: 'homes', learn: 'learn',
  noblepost: 'noblepost', website: 'website'
};

function segmentOf(body) {
  var seg = String(body.segment || '').trim().toLowerCase();
  if (SEGMENT_VARIANT[seg]) return seg;
  // fallback for any cached page still sending only the q1 label
  var q1 = String(body.q1 || '').toLowerCase();
  if (q1.indexOf('married') !== -1) return 'wedding';
  if (q1.indexOf('home') !== -1 || q1.indexOf('buying') !== -1 || q1.indexOf('selling') !== -1) return 'homes';
  if (q1.indexOf('video') !== -1 && q1.indexOf('shoot') === -1) return 'learn';
  if (q1.indexOf('shoot weddings') !== -1) return 'noblepost';
  if (q1.indexOf('website') !== -1) return 'website';
  return '';
}

function variantFor(body) {
  var src = body.source;
  if (src === 'homepage-inline') return SEGMENT_VARIANT[segmentOf(body)] || 'file';
  if (src === 'note-blankspace' || src === 'note-western' || src === 'homepage-top') return 'file';
  return '';   // venture lead forms get no welcome email at all
}

const SOURCE_LABEL = {
  'tonemedia': 'Tonemedia — wedding film inquiry',
  'noblepost': 'Noblepost — editing lead',
  'tonehomes-realtor': 'Tonehomes — real estate lead',
  'note-blankspace': 'Newsletter · Blank Space hidden-detail popup',
  'note-western': 'Newsletter · Western Ave note',
  'homepage-inline': 'Newsletter · homepage',
  'homepage-top': 'Newsletter · homepage top capture',
  'unknown': 'Unknown — no source tag'
};

// ---------------------------------------------------------------------------
// Bot filter. Every real signup comes from a form on the site, which sends:
//   hp — a hidden honeypot field a human never sees and never fills
//   t  — ms elapsed between page load and submit
// Scripted signups posting straight at this endpoint send neither, so a missing
// `t` is by itself proof the request did not come from the site.
// ---------------------------------------------------------------------------
const MIN_FILL_MS = 2500;   // nobody reads the label, types an email and submits faster than this

function spamReason(body, email) {
  if (String(body.hp || '').trim()) return 'honeypot';

  const t = Number(body.t);
  if (!isFinite(t)) return 'no_form_token';
  if (t < MIN_FILL_MS) return 'too_fast:' + t + 'ms';

  // Gmail ignores dots, so bots farm one mailbox as thousands of "unique"
  // addresses (o.p.ot.apilok.a6.0.7@gmail.com). Real people rarely use 4+.
  const at = email.lastIndexOf('@');
  const local = email.slice(0, at);
  const domain = email.slice(at + 1).toLowerCase();
  if ((domain === 'gmail.com' || domain === 'googlemail.com') && (local.split('.').length - 1) >= 4) {
    return 'gmail_dot_farm';
  }

  return null;
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// Best-effort: email Justin the moment a lead lands. Returns true/false, never throws.
async function notifyOwner(body) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false; // notify not configured yet; skip silently
  const to = process.env.LEAD_NOTIFY_TO || 'herrera.justin@gmail.com';
  const from = process.env.LEAD_FROM || 'tone.dad leads <onboarding@resend.dev>';
  const src = body.source || 'unknown';
  let label = SOURCE_LABEL[src] || src;
  if (src === 'homepage-inline') {
    const seg = segmentOf(body);
    if (seg) label = SEGMENT_LABEL[seg];
  }
  const email = String(body.email || '').trim();
  const lines = [body.q1, body.q2, body.q3, body.q4, body.detail].filter(Boolean);
  const rows = lines.map(function (l) {
    return '<tr><td style="padding:5px 0;color:#111;font-size:15px;border-top:1px solid #eee">' + esc(l) + '</td></tr>';
  }).join('');
  const html =
    '<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;max-width:520px">' +
      '<p style="font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#B8934A;margin:0 0 6px">New lead · tone.dad</p>' +
      '<h2 style="margin:0 0 12px;font-size:20px;color:#111">' + esc(label) + '</h2>' +
      '<p style="margin:0 0 14px;font-size:15px;color:#111"><b>Contact:</b> <a href="mailto:' + esc(email) + '">' + esc(email) + '</a></p>' +
      (rows ? '<table style="width:100%;border-bottom:1px solid #eee;margin:0 0 14px;border-collapse:collapse">' + rows + '</table>' : '') +
      '<p style="font-size:13px;color:#888;margin:0">Just hit reply to reach them directly.</p>' +
    '</div>';
  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: from,
        to: [to],
        reply_to: email || undefined,
        subject: 'New ' + label + ': ' + (email || 'lead'),
        html: html
      })
    });
    if (!resp.ok) {
      const d = await resp.text().catch(function () { return '(no body)'; });
      console.error('[lead-alert] resend ' + resp.status + ' — ' + String(d).slice(0, 300));
    }
    return resp.ok;
  } catch (e) {
    return false; // capture already succeeded; the alert is best-effort
  }
}

// Best-effort: send the branded tone.dad welcome email to a new newsletter subscriber via Resend.
// (Beehiiv can't send full custom-HTML welcome emails on non-Max plans, so we send our own.)
async function sendWelcome(email, variant) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !email) return false;
  const mail = welcomeEmail(variant);
  const from = process.env.WELCOME_FROM || 'Justin at tone.dad <justin@tone.dad>';
  const replyTo = process.env.WELCOME_REPLY_TO || process.env.LEAD_NOTIFY_TO || 'herrera.justin@gmail.com';
  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: from,
        to: [email],
        reply_to: replyTo,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,          // multipart — better inbox placement, and what watches render
        headers: { 'List-Unsubscribe': '<mailto:unsubscribe@tone.dad?subject=Unsubscribe>' }
      })
    });
    if (!resp.ok) {
      // Resend rejected it. Log loudly — this used to fail silently, which cost
      // an evening. Filter the Vercel log view for [welcome] to see these.
      const detail = await resp.text().catch(function () { return '(no body)'; });
      console.error('[welcome] resend ' + resp.status + ' variant=' + variant +
                    ' from=' + from + ' to=' + email + ' — ' + String(detail).slice(0, 400));
      return false;
    }
    const ok = await resp.json().catch(function () { return {}; });
    console.log('[welcome] sent variant=' + variant + ' to=' + email + ' id=' + (ok.id || '?'));
    return true;
  } catch (e) {
    console.error('[welcome] threw variant=' + variant + ' to=' + email + ' — ' + (e && e.message));
    return false;
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'method_not_allowed' });
    return;
  }

  const apiKey = process.env.BEEHIIV_API_KEY;
  const pubId  = process.env.BEEHIIV_PUB_ID;
  if (!apiKey || !pubId) {
    res.status(500).json({ error: 'not_configured' });
    return;
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  body = body || {};

  const email = String(body.email || '').trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    res.status(400).json({ error: 'invalid_email' });
    return;
  }

  // Drop bots before they touch Beehiiv or burn a Resend send.
  // Answer 200/success so the bot believes it worked and moves on — a 4xx just
  // teaches it to retry differently. Every drop is logged for the Vercel log view.
  const spam = spamReason(body, email);
  if (spam) {
    console.warn('[spam] blocked ' + spam + ' — ' + email + ' (source: ' + (body.source || 'none') + ')');
    res.status(200).json({ success: true });
    return;
  }

  // carry the answers/details as attribution (visible per-subscriber in beehiiv)
  const answers = [body.q1, body.q2, body.q3, body.q4, body.detail].filter(Boolean).join(' | ').slice(0, 250);

  // Newsletter subscribers get our branded Resend welcome; Beehiiv's own welcome is suppressed for them.
  // (Venture lead forms — tonemedia/noblepost/tonehomes-realtor — keep Beehiiv's default.)
  const variant = variantFor(body);
  const wantsWelcome = !!variant;

  try {
    const r = await fetch(`https://api.beehiiv.com/v2/publications/${pubId}/subscriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: !wantsWelcome,
        utm_source: body.source || 'unknown',
        utm_medium: body.source === 'note-blankspace' ? 'note_popup'
                  : body.source === 'note-western' ? 'note_popup'
                  : body.source === 'homepage-inline' ? 'homepage_inline'
                  : body.source === 'homepage-top' ? 'homepage_top'
                  : body.source ? 'chapter_two_qa'
                  : 'unknown',
        utm_campaign: answers || 'early_access'
      })
    });

    if (r.ok) {
      // fire the instant lead alert to Justin — never let it break the capture
      try { await notifyOwner(body); } catch (e) { /* best-effort */ }
      if (wantsWelcome) { try { await sendWelcome(email, variant); } catch (e) { /* best-effort */ } }
      res.status(200).json({ success: true });
    } else {
      const detail = (await r.text()).slice(0, 300);
      res.status(502).json({ error: 'beehiiv_error', detail });
    }
  } catch (e) {
    res.status(502).json({ error: 'network_error' });
  }
};
