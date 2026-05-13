import { Providers } from '@/components/providers';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  icons: {
    icon: [
      { url: '/assets/logo/favicon1.jpg', sizes: 'any', type: 'image/jpeg' },
      { url: '/assets/logo/VAXEN.png', sizes: 'any' },
    ],
    apple: [
      { url: '/assets/logo/favicon1.jpg', sizes: '180x180' },
    ],
    shortcut: '/assets/logo/favicon1.jpg',
  },
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const validLocale = ['en', 'pt-BR', 'es-ES'].includes(locale) ? locale : 'en';

  // Set the request locale so next-intl server hooks (getNow, getTimeZone, etc.)
  // can resolve the locale from React's request-scoped cache instead of reading
  // the X-NEXT-INTL-LOCALE header, which avoids an unexpected notFound() call.
  setRequestLocale(validLocale);

  const messages = (await import(`../../messages/${validLocale}.json`)).default;

  return (
    <NextIntlClientProvider locale={validLocale} messages={messages}>
      <Providers>{children}</Providers>
    </NextIntlClientProvider>
  );
}
