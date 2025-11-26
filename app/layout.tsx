import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Oizumi Lab | The University of Tokyo",
  description: "Oizumi Laboratory at The University of Tokyo. Researching consciousness and the brain.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
