// app/latinlock/latin-address-converter/page.tsx
import BackButton from '@/components/BackButton';
import AddressInputForm from '../../../components/AddressInputForm';
import CTAButton from '../../../components/CTAButton';

export default function HomePage() {
  return (
    <div className="py-6 max-w-[1200px] mx-auto w-[70%]">
      <div className='ps-6'>
        <BackButton />
      </div>

      <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
        Latin Address Converter
      </h1>

      {/* Two-column layout on desktop; stacks on mobile */}
      <div className="flex flex-col md:flex-row w-[90%] justify-between p-6 [@media(min-width:750px)]:w-[100%] mx-auto gap-6 items-start">
        {/* Left column: marketing copy */}
        <div className="md:w-[50%] flex flex-col justify-center text-center md:text-left text-gray-500 text-[16px] pt-4">
          <p className="mb-4 font-medium">
            Struggling with international orders? Non-Latin characters—like Arabic, Chinese, or Cyrillic—can break fulfillment.
          </p>
          <p className="mb-4">
            {/* Paste any shipping address below, and we'll automatically convert it to Latin/Roman characters, keeping the address safe and accurate. */}

            Paste any shipping address to the right (or below if on a mobile device), and we'll automatically convert it to Latin/Roman characters.
          </p>

          <div className='w-[50%] mx-auto mt-1 mb-4'><hr /></div>

          <div className='flex flex-col items-center justify-center bg-gray-200 rounded-lg p-10 mt-2 w-full text-gray-900'>
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
              The safest address to ship to is the one your customer enters him or herself, in Latin/Roman Characters.
            </p>
          </div>

        </div>

        {/* Right column: input form + CTA */}
        <div className="md:w-1/2 flex flex-col items-center md:items-center w-full">
          <AddressInputForm />
        </div>
      </div>

      {/* Optional supporting text below the fold */}
      {/* <div className="text-center mt-6 w-[90%] [@media(min-width:750px)]:w-[530px] mx-auto">
        <p className="text-[16px] text-gray-500 mt-4">
          The safest address to ship to is the one your customer enters, in Latin/Roman Characters.
        </p>
      </div> */}
    </div>
  );
}