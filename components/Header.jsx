// components/Header.jsx
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container flex justify-between items-center py-4">
        <Link href="/" className="flex items-center space-x-3">
          <Image
            src="/images/latinLock.jpg"
            alt="LatinLock Logo"
            width={80}
            height={80}
            className="rounded"
            priority
          />
          <h1 className="text-2xl font-bold text-gray-500">LatinLock</h1>
        </Link>
        <nav>
          <ul className="flex space-x-[15px]">
            <li>
              <Link href="/blog" className="text-gray-600 hover:text-gray-900">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
