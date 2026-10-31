import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'DIGITAL DARK SPOT — AI-Assisted Information Gap Detection & Verification',
  description: 'Find What Information Is Missing. Verify What Matters. Cross-source gap detection, evidence extraction, contradiction analysis, and actionable verification checklists.',
  openGraph: {
    title: 'DIGITAL DARK SPOT — Information Gap Detection',
    description: 'Find What Information Is Missing. Verify What Matters.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DIGITAL DARK SPOT',
    description: 'Find What Information Is Missing. Verify What Matters.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
