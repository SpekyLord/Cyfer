import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="foot">
      <div className="container-page foot-row">
        <div>
          <div className="row" style={{ gap: 10 }}>
            <Image src="/Cyfer Logo.png" alt="CYFER" width={26} height={26} />
            <strong style={{ color: 'var(--ink-900)' }}>CYFER</strong>
            <span className="muted">Sample City LGU · Fiscal Year 2026</span>
          </div>
          <div style={{ marginTop: 6, fontSize: 13 }}>
            A public trust platform aligned with SDG 16 - Peace, Justice and Strong Institutions.
          </div>
        </div>
        <div className="row" style={{ gap: 18, fontSize: 13 }}>
          <Link href="#">About</Link>
          <Link href="#">Data policy</Link>
          <Link href="#">Contact LGU</Link>
          <Link href="#">Source code</Link>
        </div>
      </div>
    </footer>
  );
}
