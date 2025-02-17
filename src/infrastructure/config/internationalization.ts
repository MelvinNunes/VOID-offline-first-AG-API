import i18nextConfig from "i18next";

const en = require("../../../resources/locales/en/translation.json");
const pt = require("../../../resources/locales/pt/translation.json");
const middleware = require("i18next-http-middleware");

const resources = {
  en: {
    translation: en,
  },
  pt: {
    translation: pt,
  },
};

i18nextConfig.use(middleware.LanguageDetector).init({
  preload: ["en", "pt"],
  resources: resources,
  supportedLngs: ["en", "pt"],
  fallbackLng: "en",
});

export default i18nextConfig;
