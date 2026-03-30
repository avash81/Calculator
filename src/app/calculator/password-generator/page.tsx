import { calcMeta } from '@/lib/calcMeta';
import Calculator from './Calculator';

export const metadata = calcMeta({
  title: 'Password Generator — Strong & Secure Passwords',
  description: 'Generate strong, secure, and random passwords to keep your accounts safe with our customizable password generator tool. Free online tool.',
  slug: 'password-generator',
  keywords: ['password generator', 'strong password', 'secure password', 'random password', 'password tool'],
});

export default function Page() {
  return <Calculator />;
}
