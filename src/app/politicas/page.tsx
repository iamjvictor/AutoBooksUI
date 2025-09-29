import React from 'react';

export default function PoliticasPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block w-44 h-10 bg-gray-200 rounded flex items-center justify-center">
            <span className="text-gray-600 font-bold text-xl">AutoBooks</span>
          </div>
        </div>

        {/* Conteúdo da Política */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">PRIVACY POLICY</h1>
          <p className="text-gray-500 mb-8">Last updated September 28, 2025</p>

          <div className="prose max-w-none">
            <p className="text-gray-700 mb-6">
              This Privacy Notice for <strong>Autobooks</strong> ("we," "us," or "our"), describes how and why we might access, collect, store, use, and/or share ("process") your personal information when you use our services ("Services"), including when you:
            </p>

            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Visit our website at <a href="https://www.autobooks.com.br/" className="text-blue-600 hover:underline">https://www.autobooks.com.br/</a> or any website of ours that links to this Privacy Notice</li>
              <li>Use AutoBooks. A SAAS that help business to automate your social media</li>
              <li>Engage with us in other related ways, including any sales, marketing, or events</li>
            </ul>

            <p className="text-gray-700 mb-6">
              <strong>Questions or concerns?</strong> Reading this Privacy Notice will help you understand your privacy rights and choices. We are responsible for making decisions about how your personal information is processed. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at <a href="mailto:jvictor.asevedo@gmail.com" className="text-blue-600 hover:underline">jvictor.asevedo@gmail.com</a>.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">SUMMARY OF KEY POINTS</h2>
            
            <div className="space-y-4 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">What personal information do we process?</h3>
                <p className="text-gray-700">When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do we process any sensitive personal information?</h3>
                <p className="text-gray-700">We do not process sensitive personal information.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Do we collect any information from third parties?</h3>
                <p className="text-gray-700">We do not collect any information from third parties.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How do we process your information?</h3>
                <p className="text-gray-700">We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">How do we keep your information safe?</h3>
                <p className="text-gray-700">We have adequate organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure.</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. WHAT INFORMATION DO WE COLLECT?</h2>
            
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Personal information you disclose to us</h3>
            <p className="text-gray-700 mb-4">
              <strong>In Short:</strong> We collect personal information that you provide to us.
            </p>
            
            <p className="text-gray-700 mb-4">
              We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us.
            </p>

            <p className="text-gray-700 mb-4">
              <strong>Personal Information Provided by You.</strong> The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:
            </p>

            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Names</li>
              <li>Phone numbers</li>
              <li>Email addresses</li>
              <li>Mailing addresses</li>
              <li>Passwords</li>
              <li>Contact or authentication data</li>
            </ul>

            <p className="text-gray-700 mb-4">
              <strong>Sensitive Information.</strong> We do not process sensitive information.
            </p>

            <p className="text-gray-700 mb-4">
              <strong>Payment Data.</strong> We may collect data necessary to process your payment if you choose to make purchases, such as your payment instrument number, and the security code associated with your payment instrument. All payment data is handled and stored by <strong>Stripe</strong>. You may find their privacy notice link here: <a href="https://stripe.com/en-br/privacy" className="text-blue-600 hover:underline">https://stripe.com/en-br/privacy</a>.
            </p>

            <p className="text-gray-700 mb-6">
              All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Google API</h3>
            <p className="text-gray-700 mb-6">
              Our use of information received from Google APIs will adhere to <a href="https://developers.google.com/terms/api-services-user-data-policy" className="text-blue-600 hover:underline">Google API Services User Data Policy</a>, including the <a href="https://developers.google.com/terms/api-services-user-data-policy#limited-use" className="text-blue-600 hover:underline">Limited Use requirements</a>.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. HOW DO WE PROCESS YOUR INFORMATION?</h2>
            
            <p className="text-gray-700 mb-4">
              <strong>In Short:</strong> We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent.
            </p>

            <p className="text-gray-700 mb-4">
              <strong>We process your personal information for a variety of reasons, depending on how you interact with our Services, including:</strong>
            </p>

            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li><strong>To facilitate account creation and authentication and otherwise manage user accounts.</strong> We may process your information so you can create and log in to your account, as well as keep your account in working order.</li>
              <li><strong>To deliver and facilitate delivery of services to the user.</strong> We may process your information to provide you with the requested service.</li>
              <li><strong>To send administrative information to you.</strong> We may process your information to send you details about our products and services, changes to our terms and policies, and other similar information.</li>
              <li><strong>To request feedback.</strong> We may process your information when necessary to request feedback and to contact you about your use of our Services.</li>
              <li><strong>To send you marketing and promotional communications.</strong> We may process the personal information you send to us for our marketing purposes, if this is in accordance with your marketing preferences. You can opt out of our marketing emails at any time.</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?</h2>
            
            <p className="text-gray-700 mb-4">
              <strong>In Short:</strong> We may share information in specific situations described in this section and/or with the following third parties.
            </p>

            <p className="text-gray-700 mb-4">
              <strong>Vendors, Consultants, and Other Third-Party Service Providers.</strong> We may share your data with third-party vendors, service providers, contractors, or agents ("third parties") who perform services for us or on our behalf and require access to such information to do that work. We have contracts in place with our third parties, which are designed to help safeguard your personal information.
            </p>

            <p className="text-gray-700 mb-4">The third parties we may share personal information with are as follows:</p>

            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li><strong>Invoice and Billing</strong> - Stripe</li>
              <li><strong>User Account Registration and Authentication</strong> - Google OAuth 2.0</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. DO WE OFFER ARTIFICIAL INTELLIGENCE-BASED PRODUCTS?</h2>
            
            <p className="text-gray-700 mb-4">
              <strong>In Short:</strong> We offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies.
            </p>

            <p className="text-gray-700 mb-4">
              As part of our Services, we offer products, features, or tools powered by artificial intelligence, machine learning, or similar technologies (collectively, "AI Products"). These tools are designed to enhance your experience and provide you with innovative solutions.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Use of AI Technologies</h3>
            <p className="text-gray-700 mb-4">
              We provide the AI Products through third-party service providers ("AI Service Providers"), including <strong>Google Cloud AI</strong>. Your input, output, and personal information will be shared with and processed by these AI Service Providers to enable your use of our AI Products.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Our AI Products</h3>
            <p className="text-gray-700 mb-4">Our AI Products are designed for the following functions:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>AI bots</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. HOW LONG DO WE KEEP YOUR INFORMATION?</h2>
            
            <p className="text-gray-700 mb-4">
              <strong>In Short:</strong> We keep your information for as long as necessary to fulfill the purposes outlined in this Privacy Notice unless otherwise required by law.
            </p>

            <p className="text-gray-700 mb-4">
              We will only keep your personal information for as long as it is necessary for the purposes set out in this Privacy Notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. HOW DO WE KEEP YOUR INFORMATION SAFE?</h2>
            
            <p className="text-gray-700 mb-4">
              <strong>In Short:</strong> We aim to protect your personal information through a system of organizational and technical security measures.
            </p>

            <p className="text-gray-700 mb-4">
              We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. DO WE COLLECT INFORMATION FROM MINORS?</h2>
            
            <p className="text-gray-700 mb-4">
              <strong>In Short:</strong> We do not knowingly collect data from or market to children under 18 years of age.
            </p>

            <p className="text-gray-700 mb-4">
              We do not knowingly collect, solicit data from, or market to children under 18 years of age, nor do we knowingly sell such personal information. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent's use of the Services.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. WHAT ARE YOUR PRIVACY RIGHTS?</h2>
            
            <p className="text-gray-700 mb-4">
              <strong>In Short:</strong> You may review, change, or terminate your account at any time, depending on your country, province, or state of residence.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Withdrawing your consent:</h3>
            <p className="text-gray-700 mb-4">
              If we are relying on your consent to process your personal information, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us using the contact details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Opting out of marketing and promotional communications:</h3>
            <p className="text-gray-700 mb-4">
              You can unsubscribe from our marketing and promotional communications at any time by clicking on the unsubscribe link in the emails that we send, or by contacting us using the details provided in the section "HOW CAN YOU CONTACT US ABOUT THIS NOTICE?" below.
            </p>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Account Information</h3>
            <p className="text-gray-700 mb-4">If you would at any time like to review or change the information in your account or terminate your account, you can:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700">
              <li>Log in to your account settings and update your user account.</li>
            </ul>

            <p className="text-gray-700 mb-6">
              If you have questions or comments about your privacy rights, you may email us at <a href="mailto:jvictor.asevedo@gmail.com" className="text-blue-600 hover:underline">jvictor.asevedo@gmail.com</a>.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. CONTROLS FOR DO-NOT-TRACK FEATURES</h2>
            
            <p className="text-gray-700 mb-4">
              Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track ("DNT") feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage, no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. DO WE MAKE UPDATES TO THIS NOTICE?</h2>
            
            <p className="text-gray-700 mb-4">
              <strong>In Short:</strong> Yes, we will update this notice as necessary to stay compliant with relevant laws.
            </p>

            <p className="text-gray-700 mb-4">
              We may update this Privacy Notice from time to time. The updated version will be indicated by an updated "Revised" date at the top of this Privacy Notice. If we make material changes to this Privacy Notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?</h2>
            
            <p className="text-gray-700 mb-4">
              If you have questions or comments about this notice, you may email us at <a href="mailto:jvictor.asevedo@gmail.com" className="text-blue-600 hover:underline">jvictor.asevedo@gmail.com</a> or contact us by post at:
            </p>

            <div className="bg-gray-100 p-4 rounded-lg mb-6">
              <p className="text-gray-700">
                <strong>Autobooks</strong><br />
                Rodovia ernani do amaral<br />
                29333<br />
                Maricá, Rio de janeiro 24912-710<br />
                Brazil
              </p>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?</h2>
            
            <p className="text-gray-700 mb-4">
              Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, details about how we have processed it, correct inaccuracies, or delete your personal information. You may also have the right to withdraw your consent to our processing of your personal information. These rights may be limited in some circumstances by applicable law.
            </p>

            <p className="text-gray-700 mb-6">
              To request to review, update, or delete your personal information, please fill out and submit a <a href="https://app.termly.io/dsar/58049519-5486-4a64-be31-30fab9210784" className="text-blue-600 hover:underline">data subject access request</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
