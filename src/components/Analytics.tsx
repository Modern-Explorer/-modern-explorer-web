import { Helmet } from 'react-helmet-async';

// Set VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX in your .env file
const GA_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined;

export default function Analytics() {
  if (!GA_ID) return null;
  return (
    <Helmet>
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
      <script>{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_ID}', { send_page_view: true });
      `}</script>
    </Helmet>
  );
}
