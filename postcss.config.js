import postcssImport from 'postcss-import';
import cssnano from 'cssnano';
import purgecss from '@fullhuman/postcss-purgecss';


export default {
  plugins: [
    postcssImport,
    cssnano,
    // purgecss.purgeCSSPlugin({
    //   content: [
    //     './**/*.html',
    //     './**/*.js'
    //   ],
    //   defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
    // })
  ]
};
