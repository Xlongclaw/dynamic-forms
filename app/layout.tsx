import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const roboto = Roboto({
  weight:["100","300","400", "500", "700", "900"],
  variable:"--font-roboto",
})

export const metadata: Metadata = {
  title: "Forms",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${roboto.className} antialiased`}
      >
         <Toaster position="bottom-right" reverseOrder={false} 
         toastOptions={{
          duration: 5000, // 5 seconds
          style: {
            background: '#333',
            color: '#fff',
            fontSize: '16px',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
          },
        }}
         />
        {children}
      </body>
    </html>
  );
}
