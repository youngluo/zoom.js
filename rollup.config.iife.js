import babel from 'rollup-plugin-babel';
import conditional from "rollup-plugin-conditional";
import uglify from 'rollup-plugin-uglify';
import license from 'rollup-plugin-license';
import path from 'path';

const prod = process.env.build === 'production';

export default {
    entry: 'script/init.js',
    format: 'iife',
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
    dest: prod ? 'dist/zoom.min.js' : 'dist/zoom.js'
};