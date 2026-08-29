import { Helmet } from 'react-helmet-async';
import DioramaHero from '../components/DioramaHero';

export default function HeroLab() {
  return (
    <>
      <Helmet>
        <title>Hero Lab — Preview Only | Modern Explorer</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <DioramaHero />
    </>
  );
}
