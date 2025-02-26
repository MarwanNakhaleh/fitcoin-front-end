"use client";

import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link href="/" className="text-blue-600 hover:underline">
          ← Back to Home
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Agreement to Terms</h2>
        <p className="mb-4 text-gray-700">
          By accessing or using Fitcoin, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this application.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Use License</h2>
        <p className="mb-4 text-gray-700">
          Permission is granted to temporarily use Fitcoin for personal, non-commercial purposes. This is the grant of a license, not a transfer of title, and under this license you may not:
        </p>
        <ul className="list-disc pl-6 mb-4 text-gray-700">
          <li className="mb-2">Modify or copy the materials</li>
          <li className="mb-2">Use the materials for any commercial purpose</li>
          <li className="mb-2">Attempt to decompile or reverse engineer any software contained in Fitcoin</li>
          <li className="mb-2">Remove any copyright or other proprietary notations from the materials</li>
          <li className="mb-2">Transfer the materials to another person or "mirror" the materials on any other server</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Disclaimer</h2>
        <p className="mb-4 text-gray-700">
          The materials on Fitcoin are provided on an 'as is' basis. Fitcoin makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Limitations</h2>
        <p className="mb-4 text-gray-700">
          In no event shall Fitcoin or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use Fitcoin, even if Fitcoin or a Fitcoin authorized representative has been notified orally or in writing of the possibility of such damage.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Accuracy of Materials</h2>
        <p className="mb-4 text-gray-700">
          The materials appearing on Fitcoin could include technical, typographical, or photographic errors. Fitcoin does not warrant that any of the materials on its application are accurate, complete, or current. Fitcoin may make changes to the materials contained on its application at any time without notice.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Links</h2>
        <p className="mb-4 text-gray-700">
          Fitcoin has not reviewed all of the sites linked to its application and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Fitcoin of the site. Use of any such linked website is at the user's own risk.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Modifications</h2>
        <p className="mb-4 text-gray-700">
          Fitcoin may revise these terms of service for its application at any time without notice. By using this application, you are agreeing to be bound by the then current version of these terms of service.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
        <p className="mb-4 text-gray-700">
          These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
        </p>
      </section>
    </div>
  );
}
