import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'QR Code Generator — Create Custom QR Codes',
  description: 'Create custom QR codes for your website, contact info, or any text. Fast, free, and easy to use QR generator for Nepal. Free online tool.',
  slug: 'qr-generator',
  keywords: ['qr code generator', 'create qr code', 'free qr generator', 'qr code maker', 'custom qr code'],
});

export default function Page() {
  return <Calculator />;
}
