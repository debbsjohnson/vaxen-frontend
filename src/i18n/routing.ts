import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'pt-BR', 'es-ES'],
  defaultLocale: 'en',
});
