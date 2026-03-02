// app/page.jsx
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center py-1">
        {/* <h1 className="text-4xl font-bold text-gray-900 mb-4">
          LatinLock: Simplify Shopify Shipping
        </h1> */}
        <Image
          src="/images/latinlock.jpg"
          alt="LatinLock Logo"
          width={140}
          height={50}
          className="mx-auto mb-4 rounded-[30px]"
        />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          LatinLock
        </h1>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Prevent costly shipping errors with LatinLock. Ensure only Latin/Roman characters are used in checkout address fields for seamless order fulfillment.
        </p>
        <div className="flex justify-center space-x-4">
          <a
            href="https://apps.shopify.com/latinlock"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition"
          >
            Install LatinLock on Shopify
          </a>
          <a
            href="https://youtu.be/8UdnqKvOZ8o"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition"
          >
            Watch Intro Video
          </a>
        </div>
      </section>

      {/* Features Section */}
      {/* <section className="py-12">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
          Why Choose LatinLock?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <Image
              src="/images/latinlock2.png"
              alt="Prevent Shipping Errors"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Prevent Shipping Errors
            </h3>
            <p className="text-gray-600">
              Blocks non-Latin characters in address fields to avoid order cancellations and returns by carriers.[](https://apps.shopify.com/latinlock)
            </p>
          </div>
          <div className="text-center">
            <Image
              src="/images/latinlock3.png"
              alt="Customizable Validation"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Customizable Validation
            </h3>
            <p className="text-gray-600">
              Merchants can define acceptable characters to match their target markets and carrier requirements.[](https://carthook.com/blogs/compare/shopify-checkout-apps-apaczka-pl-mapa-punktow-vs-latinlock)
            </p>
          </div>
          <div className="text-center">
            <Image
              src="/images/latinlock4.png"
              alt="User-Friendly Alerts"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              User-Friendly Alerts
            </h3>
            <p className="text-gray-600">
              Buyers are notified of invalid characters with clear, customizable messages to ensure smooth checkout.[](https://carthook.com/blogs/compare/shopify-checkout-apps-apaczka-pl-mapa-punktow-vs-latinlock)
            </p>
          </div>
        </div>
      </section> */}

      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6 mt-12">Why choose LatinLock?</h2>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <li className="bg-gray-100 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Prevent Shipping Error Costs</h3>
            <p className="text-gray-600">Blocks non-Latin characters in address fields to avoid order cancellations and returns by carriers.</p>
          </li>
          <li className="bg-gray-100 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Customizable Validation</h3>
            <p className="text-gray-600">Merchants can define acceptable characters to match their target markets and carrier requirements.</p>
          </li>
          <li className="bg-gray-100 p-6 rounded-lg text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">User-Friendly Alerts</h3>
            <p className="text-gray-600">Buyers are notified of invalid characters with clear, customizable messages to ensure smooth checkout.</p>
          </li>
        </ul>
      </section>

      {/* Video Section */}
      <section className="py-12 bg-gray-100">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
          See LatinLock in Action
        </h2>
        <div className="flex justify-center">
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/8UdnqKvOZ8o"
            title="LatinLock Intro Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="rounded-lg shadow-md"
          ></iframe>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Ready to Streamline Your Shopify Checkout?
        </h2>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Join merchants who trust LatinLock to reduce shipping errors and improve customer satisfaction. Install now for free!
        </p>
        <a
          href="https://apps.shopify.com/latinlock"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition"
        >
          Get Started with LatinLock
        </a>
      </section>

      {/* Blog Link Section */}
      <section className="text-center py-12">
        <h2 className="text-3xl font-semibold text-gray-900 mb-4">
          Learn More About E-Commerce
        </h2>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Explore our blog for tips on optimizing your Shopify store and mastering checkout challenges.
        </p>
        <Link
          href="/blog"
          className="inline-block bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-lg hover:bg-gray-300 transition"
        >
          Visit Our Blog
        </Link>
      </section>
    </div>
  );
}