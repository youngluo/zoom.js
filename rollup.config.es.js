import babel from 'rollup-plugin-babel';

export default {
    entry: 'src/zoom.js',
    format: 'es',
    plugins: [
        babel({
            exclude: 'node_modules/**'
        })
    ],
    dest: 'dist/zoom.es.js'
};