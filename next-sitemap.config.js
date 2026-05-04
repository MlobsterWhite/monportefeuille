module.exports = {
  siteUrl: 'https://monportefeuille.ca',
  generateRobotsTxt: true,
  exclude: ['/admin*'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
}