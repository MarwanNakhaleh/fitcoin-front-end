"use client";

import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
        <p className="mb-4 text-gray-700">
          This Privacy Policy describes how Fitcoin collects, uses, and shares your personal information when you use our application.
        </p>
        <p className="mb-4 text-gray-700">
          Your privacy is important to us. It is our policy to respect your privacy and comply with applicable laws and regulations regarding your personal information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
        <p className="mb-4 text-gray-700">
          We may collect information about you when you use our application, including but not limited to:
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-700">
          <li className="mb-2">Your wallet address and transaction history related to our application</li>
          <li className="mb-2">Fitness data that you choose to submit for challenges</li>
          <li className="mb-2">Information about how you interact with our application</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
        <p className="mb-4 text-gray-700">
          We use the information we collect to:
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-700">
          <li className="mb-2">Provide, maintain, and improve our services</li>
          <li className="mb-2">Process transactions and administer fitness challenges</li>
          <li className="mb-2">Communicate with you about our services</li>
          <li className="mb-2">Protect against fraud and unauthorized transactions</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Data Sharing and Disclosure</h2>
        <p className="mb-4 text-gray-700">
          We may share your information in the following situations:
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-700">
          <li className="mb-2">With your consent</li>
          <li className="mb-2">To comply with legal obligations</li>
          <li className="mb-2">To protect and defend our rights and property</li>
          <li className="mb-2">With service providers who help us operate our application</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
        <p className="mb-4 text-gray-700">
          Depending on your location, you may have certain rights regarding your personal information, such as the right to access, correct, or delete your data.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
        <p className="mb-4 text-gray-700">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
        <p className="mb-4 text-gray-700">
          If you have any questions about this Privacy Policy, please contact us.
        </p>
      </section>
    </div>
  );
}
