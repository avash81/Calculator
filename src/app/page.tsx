import HomePageClient from './HomePageClient';
import { JsonLd } from '@/components/seo/JsonLd';

export default function HomePage() {
  return (
    <>
      <JsonLd type="website" />
      <JsonLd type="organization" />
      <HomePageClient />
    </>
  );
}
