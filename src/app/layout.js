import './globals.css';

export const metadata = {
  title: 'User Management System',
  description: 'A simple Next.js application for managing user data',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-100">
          {children}
        </div>
      </body>
    </html>
  );
}