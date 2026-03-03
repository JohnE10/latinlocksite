// app/contact/page.jsx
export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-8">
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
