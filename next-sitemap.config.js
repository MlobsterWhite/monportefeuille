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
    const isGuide     = path.includes('guide-');
    const isUtility   = ['/confidentialite', '/mentions-legales', '/nous-joindre', '/a-propos'].includes(path);
    const isHomepage  = path === '/';

    return {
      loc: path,
      changefreq: isUtility  ? 'yearly'
                : isGuide    ? 'monthly'
                :              'weekly',
      priority:   isHomepage ? 1.0
                : isGuide    ? 0.9
                : isUtility  ? 0.2
                :              0.8,
      lastmod: new Date().toISOString(),
    };
  },
};
