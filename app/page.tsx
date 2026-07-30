import { redirect } from 'next/navigation';
import { defaultLocale } from '@/lib/i18n/config';

/** Safety net: middleware normally handles this before the request lands. */
export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
