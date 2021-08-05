module.exports = {
  siteMetadata: {
    siteUrl: `https://www.campusfrancosenegalais.org`,
  },
  plugins: [
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-remark`,
    `gatsby-plugin-sitemap`,
    {
      resolve: `gatsby-plugin-sass`,
      // options: {
      //     includePaths: ["src/styles"]
      // }
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // replace "UA-XXXXXXXXX-X" with your own Tracking ID
        trackingId: 'UA-147259695-1',
      },
    },
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-offline`,
    `gatsby-plugin-netlify-cms`,
    `gatsby-plugin-eslint`,
// {
    //     resolve: `gatsby-source-filesystem`,
    //     options: {
    //         path: `${__dirname}/src/content/formations`,
    //         name: "formations",
    //     },
    // },
    // {
    //     resolve: `gatsby-source-filesystem`,
    //     options: {
    //         path: `${__dirname}/src/content/pages`,
    //         name: "pages",
    //     },
    // },
    // {
    //     resolve: `gatsby-source-filesystem`,
    //     options: {
    //         path: `${__dirname}/src/content/schools`,
    //         name: "schools",
    //     },
    // }
  ],
};
