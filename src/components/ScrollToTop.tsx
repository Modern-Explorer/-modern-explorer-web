import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // Hash present — wait for the new page to render then scroll to the element
    const id = hash.slice(1);
    const attempt = (tries = 0) => {
      const el = document.getElementById(id);
      if (el) {
        // Small offset so the section header isn't hidden under the fixed navbar
        const y = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top: y, behavior: 'smooth' });
      } else if (tries < 10) {
        // Element not in DOM yet — retry up to 10× at 50ms intervals
        setTimeout(() => attempt(tries + 1), 50);
      }
    };
    attempt();
  }, [pathname, hash]);

  return null;
}
