import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

const messageImports: Record<string, () => Promise<{ default: Record<string, unknown> }>> = {
  en: () => import('../messages/en.json'),
  'pt-BR': () => import('../messages/pt-BR.json'),
  'es-ES': () => import('../messages/es-ES.json'),
};

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages = (await messageImports[locale]()).default;

  return {
    locale,
    messages,
  };
});
