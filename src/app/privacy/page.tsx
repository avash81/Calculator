export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10 min-h-screen">
      <h1 className="text-2xl font-semibold text-gray-900 mb-4">
        Privacy Policy
      </h1>
      <div className="prose text-gray-600 text-sm space-y-4">
        <p>CalcPro.NP does not collect or store any personal data.
          All calculations happen entirely in your browser.
          No user data is sent to our servers.</p>
        <p>We do not require registration. We do not use
          tracking cookies. We do not sell any data.</p>
        <p>Google Analytics may be used to track anonymous
          page views to improve our service. You can opt out
          using browser extensions.</p>
        <p>Last updated: {new Date().getFullYear()}</p>
      </div>
    </div>
  );
}
