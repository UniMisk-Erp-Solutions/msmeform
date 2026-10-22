const SITE = 'https://www.mistryandshah.com';
export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="topbar">
        <a href="tel:+919426049084"><img src="/theme/call_end.png" alt="" width="22" height="22" /> +91 94260 49084</a>
        <a href="mailto:mail@mistryandshah.com"><img src="/theme/mail-1.png" alt="" width="21" height="22" /> mail@mistryandshah.com</a>
      </div>
      <div className="mainbar">
        <a className="logo" href={SITE + '/'}><img src="/theme/Untitled-1-1-1.png" alt="Mistry & Shah, Chartered Accountants" width="146" height="50" /></a>
      </div>
    </header>
  );
}

const Icon = ({ d, label }) => (
  <svg viewBox="0 0 24 24" width="18" height="18" role="img" aria-label={label} fill="currentColor"><path d={d} /></svg>
);

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="ft-one">
        <div className="ft-text">
          <b>Need help claiming these incentives?</b>
          <span>Talk to the Industrial Subsidies team at Mistry &amp; Shah.</span>
        </div>
        <div className="ft-join">
          <span>Join Us :</span>
          <a href="https://www.facebook.com/mistryandshah" aria-label="Facebook"><Icon label="Facebook" d="M13.5 22v-8.2h2.8l.5-3.3h-3.3V8.4c0-.9.4-1.7 1.8-1.7h1.6V3.9c-.3 0-1.3-.1-2.4-.1-2.5 0-4.1 1.5-4.1 4.2v2.5H7.6v3.3h2.8V22h3.1z" /></a>
          <a href="https://www.linkedin.com/company/mistry-&-shah/" aria-label="LinkedIn"><Icon label="LinkedIn" d="M4.98 3.5a2.5 2.5 0 11-.01 5 2.5 2.5 0 01.01-5zM3 9.8h4V21H3V9.8zm6.5 0h3.8v1.6h.1c.5-1 1.8-2 3.8-2 4 0 4.8 2.6 4.8 6V21h-4v-4.9c0-1.2 0-2.7-1.7-2.7s-1.9 1.3-1.9 2.6V21h-4V9.8z" /></a>
          <a href="mailto:Mail@mistryandshah.com" aria-label="Email"><Icon label="Email" d="M3 5h18a1 1 0 011 1v12a1 1 0 01-1 1H3a1 1 0 01-1-1V6a1 1 0 011-1zm9 7.2L4.5 7v1.7l7.5 5 7.5-5V7L12 12.2z" /></a>
          <a href="https://wa.me/message/V6NVS24NKBMFL1" aria-label="WhatsApp"><Icon label="WhatsApp" d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 1.9c.1.2.1.4 0 .6l-.3.5-.4.4c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.3 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.2.4-.2.6-.1l1.8.9c.3.1.5.2.5.3.1.1.1.6-.1 1.2z" /></a>
        </div>
        <a className="ft-scan" href="https://wa.me/message/V6NVS24NKBMFL1">Connect on WhatsApp</a>
      </div>
      <div className="ft-two">
        <p><b>Disclaimer:</b> The rules of the Institute of Chartered Accountants of India prohibits CA firms from advertising and soliciting work through communication in public domain. This website is meant solely for the purpose of information and not for the purpose of advertising. Mistry &amp; Shah does not intend to solicit clients through this website. We do not take responsibility for decisions taken by the reader based solely on the information provided in the website. By browsing through this website, the visitor acknowledges that the information provided in this website (a) does not amount to advertising or solicitation and (b) is meant only for his/her understanding about our activities and who we are.</p>
        <p className="copy">Mistry &amp; Shah 2025 © All Rights Reserved.</p>
      </div>
    </footer>
  );
}
