/** @type {import('tailwindcss').Config} */
export default {
    // TODO: 適用するファイルを整理する
    content: [
        'src/*.tsx',
        'src/components/**/*.vue',
        'src/components/**/*.tsx',
        'src/components/**/*.jsx',
        'src/components/**/*.ts',
        'src/components/**/*.js',
        'src/pages/**/*.vue',
        'src/pages/**/*.tsx',
        'src/pages/**/*.jsx',
        'src/pages/**/*.ts',
        'src/pages/**/*.js',
        'nuxt.config.js',
        'nuxt.config.ts',
        'next.config.js',
        'src/safelist.txt',
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
