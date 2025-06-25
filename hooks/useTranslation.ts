import { useLanguage } from '@/components/LanguageProvider';
import translations from '@/locales';

export function useTranslation() {
  const { language } = useLanguage();
  return translations[language];
}
