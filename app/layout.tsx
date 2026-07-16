import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Material 3 UI Kit",
  description: "A reusable Material 3 component showcase built with Next.js and SCSS Modules.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const themeScript = `try{var t=localStorage.getItem('m3-theme');var d=t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.dataset.theme=d?'dark':'light'}catch(e){}`;
  return (
    <html lang="vi" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
