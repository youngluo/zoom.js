import babel from 'rollup-plugin-babel';
import conditional from "rollup-plugin-conditional";
import uglify from 'rollup-plugin-uglify';
import license from 'rollup-plugin-license';
import path from 'path';

const prod = process.env.build === 'production';

export default {
    entry: 'src/zoom.js',
    format: 'umd',
    moduleName: 'zoom',
    plugins: [
        babel({
            exclude: 'node_modules/**'
        }),
        conditional(prod, [
            uglify()
        ]),
        license({
            banner: {
                file: path.join(__dirname, 'banner.text'),
                encoding: 'utf-8'
            }
        }),
    ],
    dest: prod ? 'dist/zoom.umd.min.js' : 'dist/zoom.umd.js'
};