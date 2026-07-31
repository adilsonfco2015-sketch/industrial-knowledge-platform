import "./globals.css";

export const metadata = {
  title: "Industrial Knowledge Platform",
  description: "Gestão corporativa de lições aprendidas industriais.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
