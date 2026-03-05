// app/latinlock/latin-address-converter/page.tsx
import AddressInputForm from '../../../components/AddressInputForm';
import CTAButton from '../../../components/CTAButton';

export default function HomePage() {
  return (
    <div className="py-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
        Latin Address Converter
      </h1>

      <div className="text-center text-[16px] text-gray-500 w-[90%] [@media(min-width:750px)]:w-[530px] mx-auto mb-6">
        <p className="mb-4">
          Shipping internationally? Some fulfillment centers struggle with non-Latin/non-Roman characters like Arabic, Chinese, Cyrillic, and others.
        </p>
        <p>
          Drop the address below and we'll convert any of those characters into their Latin/Roman equivalents.
        </p>

      </div>
      <AddressInputForm />

      <div className="text-center mt-6 w-[90%] [@media(min-width:750px)]:w-[530px] mx-auto">
        <CTAButton />
        <p className="text-[16px] text-gray-500 mt-8">

          A Shopify app that prompts buyers to replace non-Latin/non-Roman characters in shipping address fields, so the checkout can proceed.

        </p>
        <p className="text-[16px] text-gray-500 mt-5">
          The safest address to ship to is the one your customer enters, in Latin/Roman Characters. {" "}

          <a href="https://youtu.be/8UdnqKvOZ8o?si=_jCOWB5U_SsuSZ3b" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">See demo.</a>
        </p>
      </div>
    </div>
  );
}