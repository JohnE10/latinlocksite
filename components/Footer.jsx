// components/Footer.jsx
import { metadata } from '@/app/layout';

// components/Footer.jsx
export default function Footer() {
  
  const blogTitle = metadata.title;
  
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container text-center">
        <p>&copy; {new Date().getFullYear()} LatinLock. All rights reserved.</p>
      </div>
    </footer>
  );
}