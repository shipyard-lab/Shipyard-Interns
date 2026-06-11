import StyledJsxRegistry from './registry';

export const metadata = {
  title: 'Shipyard Projects',
  description: 'Project CRUD dashboard',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <StyledJsxRegistry>{children}</StyledJsxRegistry>
      </body>
    </html>
  );
}

