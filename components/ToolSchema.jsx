export default function ToolSchema({ name, description, url }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": name,
          "applicationCategory": "FinanceApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "CAD"
          },
          "operatingSystem": "Web Browser",
          "description": description,
          "url": url,
          "inLanguage": "fr-CA",
          "availableLanguage": {
            "@type": "Language",
            "name": "French",
            "alternateName": "fr-CA"
          },
          "audience": {
            "@type": "Audience",
            "audienceType": "Investors and savers",
            "geographicArea": {
              "@type": "Country",
              "name": "Canada"
            }
          }
        })
      }}
    />
  );
}
