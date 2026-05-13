// Dates de dernière modification réelles par page.
// Mettre à jour manuellement lors d'une modification substantielle du contenu.
const LAST_MODIFIED = {
  '/':                                    '2025-04-01',
  '/calculateur-celi':                    '2025-04-15',
  '/calculateur-reer':                    '2025-04-15',
  '/calculateur-hypotheque':              '2025-04-15',
  '/estimateur-credit':                   '2025-04-15',
  '/estimateur-assurance':                '2025-04-15',
  '/estimateur-impot':                    '2025-04-15',
  '/valeur-nette':                        '2025-04-15',
  '/celi-vs-reer':                        '2025-04-15',
  '/guide-investissement-debutant-canada':'2025-03-01',
  '/guide-cote-de-credit-canada':         '2025-03-01',
  '/a-propos':                            '2025-01-01',
  '/nous-joindre':                        '2025-01-01',
  '/mentions-legales':                    '2025-01-01',
  '/confidentialite':                     '2025-01-01',
};

module.exports = {
  siteUrl: 'https://monportefeuille.ca',
  generateRobotsTxt: true,
  exclude: ['/admin*', '/api*', '/404'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  transform: async (config, path) => {
    const isGuide    = path.includes('guide-');
    const isUtility  = ['/confidentialite', '/mentions-legales', '/nous-joindre', '/a-propos'].includes(path);
    const isHomepage = path === '/';

    return {
      loc: path,
      changefreq: isUtility  ? 'yearly'
                : isGuide    ? 'monthly'
                :              'weekly',
      priority:   isHomepage ? 1.0
                : isGuide    ? 0.9
                : isUtility  ? 0.2
                :              0.8,
      // Utiliser la date connue ou omettre lastmod (Google la déterminera lui-même)
      ...(LAST_MODIFIED[path] ? { lastmod: LAST_MODIFIED[path] } : {}),
    };
  },
};
