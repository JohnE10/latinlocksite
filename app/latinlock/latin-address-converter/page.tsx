// app/latinlock/latin-address-converter/page.tsx
import BackButton from '@/components/BackButton';
import AddressInputForm from '../../../components/AddressInputForm';
import CTAButton from '../../../components/CTAButton';
import Disclaimer from '@/components/Disclaimer';

export default function HomePage() {
  return (
    <div className="mx-auto w-full">
      <div>
        <BackButton />
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
        Latin Address Converter
      </h1>

      {/* Two-column layout on desktop; stacks on mobile */}
      <div className="flex flex-col md:flex-row w-[90%] justify-between [@media(min-width:750px)]:w-[100%] mx-auto gap-6 mt-12 items-start">

        {/* left column: input form + CTA */}
        <div className="md:w-1/2 flex flex-col items-center md:items-center w-full p-4">
          <div className='text-gray-500'>
            <p className="mb-4 font-medium">
              Struggling with international orders? Non-Latin characters—like Greek, Chinese, or Cyrillic—can break fulfillment.
            </p>
            <p className="mb-4">
              Paste any shipping address below, and we'll automatically convert it to Latin/Roman characters.
            </p>
          </div>

          <AddressInputForm />

          <Disclaimer />
        </div>

        {/* right column: marketing copy */}
        <div className="md:w-[50%] flex flex-col justify-center text-center md:text-left text-gray-500 text-[16px]">

          <div className='flex flex-col items-center justify-center bg-gray-200 rounded-lg p-10 w-full text-gray-900'>
            <div className="mb-5 w-full md:w-auto w-full mx-auto">
              <CTAButton />
              {/* Added supporting microcopy to increase conversions */}
            </div>

            <p className="mb-4">
              It stops failed deliveries, hassle, and unhappy customers caused by invalid characters in international shipping addresses.
            </p>
            <p className="mb-4 w-full">
              Installs in minutes. No coding required.
            </p>

            <p className="mb-4 italic">
              Trusted by Shopify merchants to prevent international shipping headaches.
            </p>
            <p className="text-blue-600 hover:underline mb-4">
              <a href="https://youtu.be/8UdnqKvOZ8o?si=_jCOWB5U_SsuSZ3b" target="_blank" rel="noopener noreferrer">
                Watch a quick demo
              </a>
            </p>
            <p className="mb-4 w-full">
              The safest address to ship to is the one your customer enters themselves using Latin characters. LatinLock ensures this at checkout.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}