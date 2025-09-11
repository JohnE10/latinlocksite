// app/contact/page.jsx

// "use client";

// export default function ContactPage() {
//   // Email char codes for display and mailto creation
//   const emailCharCodes = [
//     112, 114, 111, 106, 101, 99, 116, 99, 111, 100, 101, 114, 49, 48,
//     64,
//     103, 109, 97, 105, 108, 46, 99, 111, 109,
//   ];

//   const email = String.fromCharCode(...emailCharCodes);

//   // Display email obfuscated by splitting with zero-width spaces (optional)
//   const displayEmail = emailCharCodes
//     .map((c) => String.fromCharCode(c))
//     .join('\u200B');

//   const handleClick = () => {
//     window.location.href = `mailto:${email}`;
//   };

//   return (
//     <section className="max-w-3xl mx-auto px-6 py-16">
//       <h1 className="text-4xl font-bold mb-6">Get in Touch</h1>
//       <p className="text-lg mb-6">
//         We'd love to hear from you! Please reach out with any questions or feedback.
//       </p>
//       <p className="text-lg">
//         Email us at:{' '}
//         <span
//           role="link"
//           tabIndex={0}
//           onClick={handleClick}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter') handleClick();
//           }}
//           className="text-indigo-600 hover:underline cursor-pointer select-all"
//           title="Send email"
//         >
//           {displayEmail}
//         </span>
//       </p>
//     </section>
//   );
// }

// app/contact/page.jsx
export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* <h1 className="text-3xl font-bold mb-4 text-gray-900">Contact Us</h1>
      <p className="text-gray-600 mb-6">
        We'd love to hear from you! Please fill out the form below to get in touch.
      </p> */}
      <div className="flex justify-center">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSfQmdLUltsQAkcpdOf-WerKOvhdOMKmyKzzuLhreRwZjw0s8w/viewform?embedded=true"
          width="100%"
          height="589"
          frameBorder="0"
          marginHeight="0"
          marginWidth="0"
          title="Contact Form"
          className="max-w-[640px]"
          style={{ overflowY: 'hidden' }}
        >
          Loading…
        </iframe>
      </div>
    </div>
  );
}
