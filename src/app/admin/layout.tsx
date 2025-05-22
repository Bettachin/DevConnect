// app/admin/layout.tsx
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        {/* No navbar here */}
        {children}
      </body>
    </html>
  );
}
