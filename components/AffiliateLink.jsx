export default function AffiliateLink({ href, partner, children, className }) {
  const handleClick = () => {
    window.gtag?.("event", "affiliate_click", {
      partner: partner,
      page: window.location.pathname,
    });
  };

  return (
    
      <a href={href}
      target="_blank"
      rel="noopener noreferrer sponsored"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}