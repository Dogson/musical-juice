const path = require('path');
const moment = require('moment');

const currentYear = moment().year();

// exports.createPages = ({actions, graphql}) => {
//     const {createPage} = actions;
//     // const formationsPage = path.resolve(`src/templates/formationsListTemplate.js`);
//
//     // createPage({
//     //     path: `formations/`,
//     //     component: formationsPage,
//     //     context: {year: currentYear}, // additional data can be passed via context
//     // });
//
//     const formationTemplate = path.resolve(`src/templates/formationTemplate.js`);
//
//     return graphql(`
//     {
//   allMarkdownRemark(filter: {frontmatter: {type: {eq: "formations"}, hideFormation: {ne: true}, buildPage: {eq: true}}}) {
//     edges {
//       node {
//         id
//         fileAbsolutePath
//       }
//     }
//   }
// }
//
//   `).then(result => {
//         const {errors, data} = result;
//         const {allMarkdownRemark} = data;
//         const {edges} = allMarkdownRemark;
//         if (errors) {
//             return Promise.reject(errors);
//         }
//
//         edges.forEach(({node}) => {
//             createPage({
//                 path: `formations/${node.fileAbsolutePath.substring(node.fileAbsolutePath.lastIndexOf('/')+1).slice(0, -3)}`,
//                 component: formationTemplate,
//                 context: {id: node.id}, // additional data can be passed via context
//             })
//         });
//     })
// };
