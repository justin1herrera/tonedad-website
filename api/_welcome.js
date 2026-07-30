// tone.dad — welcome emails, sent via Resend on signup (api/subscribe.js).
// Underscore prefix keeps Vercel from treating this as a route.
//
// ONE design, SIX variants. Every signup gets the email its form actually promised.
// That was the bug: five different on-page promises, one Blank Space email for all of them.
//
//   file       note-blankspace + homepage-top      the Blank Space file (unchanged)
//   wedding    homepage-inline · "getting married" the Wedding-Day Timeline PDF
//   learn      homepage-inline · "better at video" three rules + cal.com booking
//   website    homepage-inline · "website update"  the build list + quote link
//   homes      homepage-inline · "buying/selling"  a real question, no invented asset
//   noblepost  homepage-inline · "I shoot weddings" Noblepost + an honest note
//
// Design: cream broadsheet (#F6F2E9) with ink payload cards (#171410).
// Bodoni Moda display / JetBrains Mono rails / Inter body, Didot > Georgia fallbacks.
// Image URLs use the apex https://tone.dad — NOT www, which 308-redirects and costs
// every recipient an extra hop through Gmail's image proxy.

const blankSpaceHtml = require('./_welcome_file.js');

const P = {
  paper: '#F6F2E9', ink: '#171410', gold: '#8A5A33', tan: '#E7B877',
  sage: '#EEF0E6', body: '#463F33', mute: '#5C543F', faint: '#8A8272',
  rule: '#DED7C6', dim: '#C4BDAE'
};
const serif = "'Bodoni Moda',Didot,Georgia,serif";
const sans  = 'Inter,Arial,Helvetica,sans-serif';
const mono  = "'JetBrains Mono',Courier,monospace";

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// A dark card — the one place each variant hands over its actual goods.
function payload(o) {
  var bullets = o.bullets ? '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">' +
    o.bullets.map(function (b) {
      return '<tr><td style="padding:9px 0;border-top:1px solid #2A2620;font-family:' + sans +
             ';font-size:14px;line-height:1.6;color:' + P.dim + ';">' + b + '</td></tr>';
    }).join('') + '</table>' : '';
  return `
  <tr><td class="pad" style="padding:56px 44px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${P.ink};"><tr>
      <td class="padband" style="padding:40px 36px 42px;">
        <div class="rail" style="font-family:${mono};font-size:9px;letter-spacing:3.2px;color:${P.faint};text-transform:uppercase;">${o.label}</div>
        <div class="d2" style="padding-top:18px;font-family:${serif};font-size:32px;line-height:1.08;color:${P.paper};">${o.title}</div>
        <div style="padding-top:18px;font-family:${sans};font-size:15px;line-height:1.8;color:${P.dim};">${o.text}</div>
        ${bullets}
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;"><tr>
          <td style="background-color:${P.tan};"><a href="${o.href}" style="display:block;padding:15px 32px;font-family:${mono};font-size:10px;letter-spacing:2.6px;color:${P.ink};text-transform:uppercase;text-decoration:none;font-weight:bold;">${o.cta}</a></td>
        </tr></table>
      </td>
    </tr></table>
  </td></tr>`;
}

// The shared broadsheet shell. Every variant is this plus its own middle.
function shell(v, key) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="x-ua-compatible" content="ie=edge">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>tone.dad &middot; ${esc(v.title)}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400;0,6..96,500;1,6..96,400;1,6..96,500&family=Inter:wght@400;500&family=JetBrains+Mono:wght@400&display=swap">
<style>
  img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;}
  a{text-decoration:none;}
  body{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}
  table{border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;}
  @media only screen and (max-width:620px){
    .wrap{width:100% !important;min-width:100% !important;}
    .pad{padding-left:24px !important;padding-right:24px !important;}
    .padband{padding-left:24px !important;padding-right:24px !important;}
    .d1{font-size:42px !important;} .d2{font-size:27px !important;}
    .d3{font-size:23px !important;} .d4{font-size:26px !important;}
    .num{font-size:30px !important;} .numcol{width:44px !important;}
    .indent{width:0 !important;} .rail{font-size:8px !important;letter-spacing:1.8px !important;}
  }
</style>
<!--[if mso]><style>*{font-family:Georgia,'Times New Roman',serif !important;}</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:${P.paper};">

<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:${P.paper};opacity:0;">
${esc(v.preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${P.paper};">
<tr><td align="center">
<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;background-color:${P.paper};">

  <tr><td class="pad" style="padding:32px 44px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td class="rail" align="left" style="font-family:${mono};font-size:9px;letter-spacing:2.6px;color:${P.faint};text-transform:uppercase;">NOTES FROM THE EDIT SUITE</td>
      <td class="rail" align="right" style="font-family:${mono};font-size:9px;letter-spacing:2.6px;color:${P.faint};text-transform:uppercase;"><a href="https://tone.dad/welcome/${key}" style="color:${P.faint};text-decoration:none;">VIEW IN BROWSER</a></td>
    </tr></table>
  </td></tr>
  <tr><td class="pad" style="padding:16px 44px 0;"><div style="height:1px;background-color:${P.ink};line-height:1px;font-size:1px;">&nbsp;</div></td></tr>

  <tr><td class="pad" style="padding:24px 44px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td align="left" style="font-family:${serif};font-size:25px;letter-spacing:.11em;color:${P.ink};text-transform:uppercase;line-height:1;">TONE<span style="color:${P.gold};">.</span>DAD</td>
      <td class="rail" align="right" style="font-family:${mono};font-size:9px;letter-spacing:2.6px;color:${P.faint};text-transform:uppercase;">${v.corner}</td>
    </tr></table>
  </td></tr>

  <tr><td class="pad" style="padding:76px 44px 0;">
    <div class="d1" style="font-family:${serif};font-size:56px;line-height:1;letter-spacing:-.01em;color:${P.ink};">${v.headline}</div>
  </td></tr>

  <tr><td class="pad" style="padding:34px 44px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td class="indent" width="56">&nbsp;</td>
      <td style="font-family:${sans};font-size:15px;line-height:1.8;color:${P.body};">${v.intro}</td>
    </tr></table>
  </td></tr>

${v.main}

  <tr><td class="pad" style="padding:64px 44px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${P.sage};"><tr>
      <td style="padding:40px 36px 42px;">
        <div style="font-family:${mono};font-size:9px;letter-spacing:3.2px;color:${P.gold};text-transform:uppercase;">ONE THING BEFORE YOU GO</div>
        <div class="d4" style="padding-top:18px;font-family:${serif};font-size:31px;line-height:1.12;letter-spacing:-.005em;color:${P.ink};">${v.askTitle}</div>
        <div style="padding-top:18px;font-family:${sans};font-size:14px;line-height:1.78;color:${P.mute};">${v.askText}</div>
      </td>
    </tr></table>
  </td></tr>

  <tr><td class="pad" style="padding:52px 44px 0;font-family:${sans};font-size:15px;line-height:1.8;color:${P.body};">${v.signoff}</td></tr>
  <tr><td class="pad" style="padding:24px 44px 0;">
    <div style="font-family:${serif};font-style:italic;font-size:32px;line-height:1.1;color:${P.ink};">Justin</div>
    <div style="padding-top:10px;font-family:${mono};font-size:9px;letter-spacing:2.6px;color:${P.faint};text-transform:uppercase;">MORRIS PLAINS, NEW JERSEY</div>
  </td></tr>

  <tr><td class="pad" style="padding:64px 44px 0;"><div style="height:1px;background-color:${P.ink};line-height:1px;font-size:1px;">&nbsp;</div></td></tr>
  <tr><td class="pad" style="padding:18px 44px 52px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td class="rail" align="left" style="font-family:${mono};font-size:9px;letter-spacing:2.2px;color:${P.faint};text-transform:uppercase;"><a href="https://tone.dad" style="color:${P.faint};text-decoration:none;">TONE.DAD</a></td>
      <td class="rail" align="right" style="font-family:${mono};font-size:9px;letter-spacing:2.2px;color:${P.faint};text-transform:uppercase;"><a href="mailto:unsubscribe@tone.dad?subject=Unsubscribe" style="color:${P.faint};text-decoration:none;">UNSUBSCRIBE</a></td>
    </tr></table>
    <div style="padding-top:13px;font-family:${sans};font-size:11px;line-height:1.65;color:#9A9284;">You&rsquo;re getting this because you asked for it at tone.dad. Reply &ldquo;stop&rdquo; and I&rsquo;ll take you off myself.</div>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`;
}

const LESSON = [
  ['01', 'Keep rolling after it&rsquo;s over.',
   'Everyone stops the second the moment ends. The good part is always the three seconds after &mdash; the laugh that comes late, the look back at camera. Count to ten before you hit stop. That one habit will do more for your footage than any lens you buy this year.'],
  ['02', 'Shoot hands.',
   'Everybody shoots faces, and you&rsquo;ll have a thousand frames of the face. What nobody has is how small their hands were, or the way somebody holds a cup. Took me way too long to figure that out.'],
  ['03', 'Cut on motion, not on words.',
   'The edit disappears when you cut mid-gesture instead of at the end of a sentence. Watch any broadcast package for thirty seconds and you&rsquo;ll never unsee it.']
];

function lessonRows() {
  return LESSON.map(function (r) {
    return `<tr><td class="pad" style="padding:40px 44px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
        <td class="numcol" width="68" valign="top"><div class="num" style="font-family:${serif};font-style:italic;font-size:40px;line-height:.82;color:#CFC5AE;">${r[0]}</div></td>
        <td valign="top">
          <div class="d3" style="font-family:${serif};font-size:25px;line-height:1.18;color:${P.ink};">${r[1]}</div>
          <div style="padding-top:12px;font-family:${sans};font-size:14px;line-height:1.78;color:${P.mute};">${r[2]}</div>
        </td>
      </tr></table>
    </td></tr>`;
  }).join('');
}

const VARIANTS = {

  wedding: {
    subject: 'The timeline. As promised.',
    title: 'the wedding-day timeline',
    preheader: 'The wedding-day timeline, built from 350 weddings.',
    corner: 'FOR THE ONE PLANNING &nbsp;&middot;&nbsp; N&deg; 001',
    headline: 'First things<br><span style="font-style:italic;color:#8A5A33;">first.</span>',
    intro: `Justin here &mdash; congratulations, genuinely.
      <div style="padding-top:16px;">You said you&rsquo;re getting married, so I&rsquo;m not going to open with a pitch. I&rsquo;m going to give you the thing I wish every couple had eight months out, whoever ends up filming your day.</div>`,
    main: payload({
      label: 'N&deg; 01 &nbsp;&middot;&nbsp; THE FIELD GUIDE',
      title: 'The Wedding-Day<br><span style="font-style:italic;color:#E7B877;">Timeline.</span>',
      text: 'Four pages, built from three hundred and fifty weddings. No second email gate, no upsell &mdash; the whole thing, right now.',
      bullets: [
        '<b style="color:#F6F2E9;">Seven things that quietly wreck a timeline.</b> We&rsquo;ve watched all seven happen from behind the camera.',
        '<b style="color:#F6F2E9;">A realistic blueprint.</b> 10am to last dance, with honest durations you can slide to fit your day.',
        '<b style="color:#F6F2E9;">A worksheet and family shot list.</b> Fill it in, send it to every vendor. One shared timeline is the secret every calm wedding has.'
      ],
      href: 'https://tone.dad/media/tone-dad-wedding-day-timeline.pdf',
      cta: 'Download the timeline &rarr;'
    }) + `
  <tr><td class="pad" style="padding:26px 44px 0;" align="center">
    <a href="https://tone.dad/media/tone-dad-wedding-day-timeline.pdf"><img src="https://tone.dad/media/timeline-cover.jpg" width="228" height="295" alt="The Wedding-Day Timeline &mdash; a field guide for brides." style="display:block;width:228px;max-width:228px;height:auto;border:1px solid ${P.rule};background-color:#EAE3D2;font-family:${sans};font-size:12px;line-height:1.6;color:${P.faint};"></a>
  </td></tr>
  <tr><td class="pad" style="padding:14px 44px 0;font-family:${sans};font-size:12px;line-height:1.6;color:${P.faint};" align="center">Print it, or forward the PDF straight to your planner.</td></tr>`,
    askTitle: 'Tell me your date and<br>I&rsquo;ll tell you <span style="font-style:italic;color:#8A5A33;">straight.</span>',
    askText: 'Hit reply with your date and venue. If I&rsquo;m free I&rsquo;ll say so; if I&rsquo;m not I&rsquo;ll point you at someone good &mdash; I know most of the room in New Jersey. Either way you get an answer from me, not a form.',
    signoff: 'That&rsquo;s the timeline. Talk soon.'
  },

  learn: {
    subject: 'The lesson, and thirty minutes.',
    title: 'the lesson',
    preheader: 'Three rules, and a free half hour if you want it.',
    corner: 'FOR THE ONE LEARNING &nbsp;&middot;&nbsp; N&deg; 001',
    headline: 'Two things,<br><span style="font-style:italic;color:#8A5A33;">both free.</span>',
    intro: `Justin here. You said you want to get better at video.
      <div style="padding-top:16px;">I&rsquo;ve cut for Taylor, Katy, the Jets and NBC, and shot 350 weddings. Here&rsquo;s the part that actually transfers &mdash; none of it is about gear.</div>`,
    main: `
  <tr><td class="pad" style="padding:56px 44px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td class="rail" style="font-family:${mono};font-size:9px;letter-spacing:3.2px;color:${P.faint};text-transform:uppercase;white-space:nowrap;">THE LESSON</td>
      <td class="rail" align="right" style="font-family:${mono};font-size:9px;letter-spacing:2.6px;color:${P.faint};text-transform:uppercase;white-space:nowrap;">THREE RULES</td>
    </tr></table>
    <div style="height:1px;background-color:${P.ink};line-height:1px;font-size:1px;margin-top:13px;">&nbsp;</div>
  </td></tr>
${lessonRows()}` + payload({
      label: 'N&deg; 02 &nbsp;&middot;&nbsp; THE OTHER HALF',
      title: 'Bring the edit<br><span style="font-style:italic;color:#E7B877;">that&rsquo;s fighting you.</span>',
      text: 'Thirty minutes, free, no pitch at the end. Bring a timeline that isn&rsquo;t working and we&rsquo;ll pull it apart together. I do a few of these a month.',
      href: 'https://cal.com/tonedad',
      cta: 'Grab a slot &rarr;'
    }),
    askTitle: 'Or just reply and<br>ask me <span style="font-style:italic;color:#8A5A33;">anything.</span>',
    askText: 'Stuck on a cut, a codec, a client who won&rsquo;t sign off. I read all of them and I answer. Usually late, usually after the kids are down.',
    signoff: 'That&rsquo;s the lesson. Talk soon.'
  },

  website: {
    subject: 'The sites, and what a build costs.',
    title: 'the build list',
    preheader: 'What I&rsquo;ve built, and how to get a real number.',
    corner: 'FOR THE ONE BUILDING &nbsp;&middot;&nbsp; N&deg; 001',
    headline: 'You&rsquo;re after<br><span style="font-style:italic;color:#8A5A33;">a website.</span>',
    intro: `Justin here. The quickest way to judge someone who builds sites is to look at the sites.
      <div style="padding-top:16px;">So here are mine, including the one you just came from. All three are hand-built &mdash; no template, no page builder.</div>`,
    main: `
  <tr><td class="pad" style="padding:56px 44px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td class="rail" style="font-family:${mono};font-size:9px;letter-spacing:3.2px;color:${P.faint};text-transform:uppercase;white-space:nowrap;">THE BUILDS</td>
      <td class="rail" align="right" style="font-family:${mono};font-size:9px;letter-spacing:2.6px;color:${P.faint};text-transform:uppercase;white-space:nowrap;">THREE</td>
    </tr></table>
    <div style="height:1px;background-color:${P.ink};line-height:1px;font-size:1px;margin-top:13px;">&nbsp;</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr><td style="padding:17px 0;border-bottom:1px solid ${P.rule};font-family:${sans};font-size:14px;line-height:1.6;color:${P.mute};"><a href="https://tone.dad" style="font-family:${serif};font-size:19px;color:${P.ink};">tone.dad</a> &nbsp;A personal hub. Four doors, hover video, one email capture.</td></tr>
      <tr><td style="padding:17px 0;border-bottom:1px solid ${P.rule};font-family:${sans};font-size:14px;line-height:1.6;color:${P.mute};"><a href="https://nobleposthouse.com" style="font-family:${serif};font-size:19px;color:${P.ink};">nobleposthouse.com</a> &nbsp;A service business. Pricing, proof, one clear action.</td></tr>
      <tr><td style="padding:17px 0;border-bottom:1px solid ${P.rule};font-family:${sans};font-size:14px;line-height:1.6;color:${P.mute};"><a href="https://tonemediastudio.com" style="font-family:${serif};font-size:19px;color:${P.ink};">tonemediastudio.com</a> &nbsp;A twelve-year studio. Portfolio-led, built to book weddings.</td></tr>
    </table>
  </td></tr>` + payload({
      label: 'N&deg; 02 &nbsp;&middot;&nbsp; HOW TO GET A NUMBER',
      title: 'Fifteen minutes,<br><span style="font-style:italic;color:#E7B877;">then a real quote.</span>',
      text: 'Tell me what the site has to do and who it has to convince. I&rsquo;ll tell you what that takes, what it costs, and whether you even need me &mdash; sometimes the honest answer is a template and a weekend.',
      href: 'https://cal.com/tonedad/tonebuild',
      cta: 'Book a build call &rarr;'
    }),
    askTitle: 'Or just send me<br>the <span style="font-style:italic;color:#8A5A33;">current one.</span>',
    askText: 'Hit reply with your URL and I&rsquo;ll send back the three things I&rsquo;d change first. Free, no strings &mdash; you can hand that list to anyone you like.',
    signoff: 'That&rsquo;s the build list. Talk soon.'
  },

  homes: {
    subject: 'Rice and beans, then six units.',
    title: 'rice and beans, then six units',
    preheader: 'How we got from a 500 sq ft apartment to six doors.',
    corner: 'FOR THE ONE MOVING &nbsp;&middot;&nbsp; N&deg; 001',
    headline: 'Rice and beans<br><span style="font-style:italic;color:#8A5A33;">for three years.</span>',
    intro: `Justin here. You said you&rsquo;re buying or selling, so let me start with the part most agents leave out &mdash; where I actually came from.
      <div style="padding-top:16px;">Steph and I spent three years in a 500 square-foot apartment in Randolph eating rice and beans, running the envelope system, paying off every dollar of debt with money from weddings. No shortcut. Just a long, boring, unglamorous slog.</div>
      <div style="padding-top:16px;">When it was finally time to buy, we didn&rsquo;t buy a house. We bought a duplex &mdash; so a tenant covered half the mortgage. Steph&rsquo;s eye for what a room could be, my head for the numbers. Then another. Then a single-family. Then another. Six doors now, all of it the same play run over and over.</div>`,
    main: `
  <tr><td class="pad" style="padding:56px 44px 0;" align="center">
    <img src="https://tone.dad/media/th-keys.jpg" width="260" height="260" alt="The first set of keys." style="display:block;width:260px;max-width:260px;height:auto;border:1px solid ${P.rule};background-color:#EAE3D2;font-family:${sans};font-size:12px;line-height:1.6;color:${P.faint};">
    <div style="padding-top:12px;font-family:${sans};font-size:12px;line-height:1.6;color:${P.faint};font-style:italic;">The first set. More than a door.</div>
  </td></tr>

  <tr><td class="pad" style="padding:56px 44px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
      <td class="rail" style="font-family:${mono};font-size:9px;letter-spacing:3.2px;color:${P.faint};text-transform:uppercase;white-space:nowrap;">THE SECOND ONE</td>
      <td class="rail" align="right" style="font-family:${mono};font-size:9px;letter-spacing:2.6px;color:${P.faint};text-transform:uppercase;white-space:nowrap;">OCT 2018 &rarr; JAN 2020</td>
    </tr></table>
    <div style="height:1px;background-color:${P.ink};line-height:1px;font-size:1px;margin-top:13px;">&nbsp;</div>
  </td></tr>
  <tr><td class="pad" style="padding:26px 44px 0;" align="center">
    <img src="https://tone.dad/media/th-transform.gif" width="480" height="320" alt="The living and dining room, October 2018 to January 2020 &mdash; wall opened, floors refinished, furnished." style="display:block;width:100%;max-width:480px;height:auto;border:1px solid ${P.rule};background-color:#EAE3D2;font-family:${sans};font-size:12px;line-height:1.6;color:${P.faint};">
    <div style="padding-top:13px;font-family:${sans};font-size:12px;line-height:1.65;color:${P.faint};">Four frames, October 2018 to January 2020, all pointed at the same two windows. It sat on the market needing real work &mdash; so we took that wall down, did the floors, and put a studio in the basement for extra rent.</div>
  </td></tr>
` + payload({
      label: 'N&deg; 01 &nbsp;&middot;&nbsp; WHAT I&rsquo;D ASK YOU FIRST',
      title: 'When do you<br><span style="font-style:italic;color:#E7B877;">need to be in?</span>',
      text: 'Not which houses you like &mdash; that comes later, and it changes. Your date decides everything upstream of it: whether you sell first or buy first, how hard you can push on price, and whether a two-family is even on the table for you.',
      bullets: [
        '<b style="color:#F6F2E9;">Reply with your month.</b> Rough is fine. &ldquo;Spring-ish&rdquo; is an answer.',
        '<b style="color:#F6F2E9;">Buying, selling, or both.</b> Both is the one people underplan, every time.',
        '<b style="color:#F6F2E9;">Tell me if you&rsquo;d consider a multi-family.</b> Most people never ask. It&rsquo;s how we started.'
      ],
      href: 'mailto:herrera.justin@gmail.com?subject=Morris%20County%20%E2%80%94%20my%20timeline',
      cta: 'Reply with your timeline &rarr;'
    }),
    askTitle: 'We&rsquo;re not doing this<br>from <span style="font-style:italic;color:#8A5A33;">a desk.</span>',
    askText: 'Steph and I live here. Our kids go to school here. We film the weddings, we know the contractors, we know which block floods and which one doesn&rsquo;t. Craig and Nicole hired me in 2022 to film their wedding &mdash; in 2026 I found them their house. That&rsquo;s the whole pitch. Follow along at <a href="https://instagram.com/tonehomes" style="color:#8A5A33;font-weight:500;">@tonehomes</a> if you want to see the day-to-day.',
    signoff: 'Tell me your month and I&rsquo;ll take it from there.'
  },

  noblepost: {
    subject: 'You shoot weddings. Let’s talk about the edit.',
    title: 'the handoff',
    preheader: 'The bottleneck was never the shooting.',
    corner: 'FOR THE ONE EDITING &nbsp;&middot;&nbsp; N&deg; 001',
    headline: 'The bottleneck was<br>never <span style="font-style:italic;color:#8A5A33;">the shoot.</span>',
    intro: `Justin here. You said you shoot weddings too, so you already know the problem.
      <div style="padding-top:16px;">Shooting is the fun day. The edit is the six weeks afterward that eats your evenings, your turnaround, and eventually your interest in the work. I ran that treadmill for years before building a team to get off it.</div>`,
    main: payload({
      label: 'N&deg; 01 &nbsp;&middot;&nbsp; NOBLEPOST',
      title: 'Hand off the edit.<br><span style="font-style:italic;color:#E7B877;">Keep the credit.</span>',
      text: 'Noblepost is my post house &mdash; the same hands that cut my own weddings. You send the footage, you get the film back, your name stays on it. Starts at $500.',
      bullets: [
        '<b style="color:#F6F2E9;">See a full film before you trust anyone.</b> There&rsquo;s one on the site start to finish, not a highlight of a highlight.',
        '<b style="color:#F6F2E9;">A husband-and-wife house, not a vendor.</b> Small team, and you&rsquo;ll know them by name.'
      ],
      href: 'https://nobleposthouse.com?utm_source=tonedad&utm_medium=email&utm_campaign=welcome_noblepost',
      cta: 'See the edit &rarr;'
    }),
    askTitle: 'Or tell me what you&rsquo;re<br><span style="font-style:italic;color:#8A5A33;">actually stuck on.</span>',
    askText: 'Maybe it isn&rsquo;t outsourcing. Maybe it&rsquo;s pricing, or a workflow leaking hours, or one client who won&rsquo;t sign off. Hit reply. I read all of them and I answer &mdash; and if the answer is &ldquo;don&rsquo;t hire me,&rdquo; I&rsquo;ll say that too.',
    signoff: 'That&rsquo;s the honest version. Talk soon.'
  }
};

/**
 * @param {string} variant  file | wedding | learn | website | homes | noblepost
 * @returns {{subject: string, html: string}}
 */

// Plain-text alternative. Sending multipart (text + HTML) is a positive signal to
// spam filters, and it's what Apple Watch, screen readers and plain-text clients
// actually render. Derived from the generated HTML so the two can never drift.
function htmlToText(html) {
  var t = html;
  t = t.replace(/<head[\s\S]*?<\/head>/gi, '');
  t = t.replace(/<style[\s\S]*?<\/style>/gi, '');
  t = t.replace(/<div style="display:none[\s\S]*?<\/div>/i, '');   // preheader
  t = t.replace(/<a[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, function (m, href, inner) {
    var label = inner.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (!label) return '';
    if (href.indexOf('mailto:') === 0) return label;
    return label + ' — ' + href;
  });
  t = t.replace(/<br\s*\/?>/gi, '\n');
  t = t.replace(/<\/(tr|div|table|p|h1|h2|h3)>/gi, '\n');
  t = t.replace(/<[^>]+>/g, '');
  t = t.replace(/&nbsp;/g, ' ').replace(/&middot;/g, '·').replace(/&deg;/g, '°')
       .replace(/&mdash;/g, '—').replace(/&rsquo;/g, '\u2019').replace(/&ldquo;/g, '\u201c')
       .replace(/&rdquo;/g, '\u201d').replace(/&rarr;/g, '->').replace(/&amp;/g, '&')
       .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#9654;/g, '>');
  t = t.replace(/[ \t]+/g, ' ');
  t = t.replace(/ *\n */g, '\n');
  t = t.replace(/\n{3,}/g, '\n\n');
  return t.trim();
}

function welcomeEmail(variant) {
  var v = VARIANTS[variant];
  var html = v ? shell(v, variant) : blankSpaceHtml();
  var subject = v ? v.subject : 'The file. As promised.';
  return { subject: subject, html: html, text: htmlToText(html) };
}

module.exports = welcomeEmail;
module.exports.welcomeEmail = welcomeEmail;
module.exports.VARIANT_KEYS = ['file', 'wedding', 'learn', 'website', 'homes', 'noblepost'];
