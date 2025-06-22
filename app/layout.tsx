import './globals.css';

export const metadata = {
  title: '楽天 → ヤマト変換ツール',
  description: '楽天CSVをヤマトB2クラウドCSVに変換する業務ツール',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
     <body className="bg-white text-black font-sans">
        {children}
      </body>
    </html>
  );
}
