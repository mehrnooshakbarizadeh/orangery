const withReactSvg = require('next-react-svg')
const path = require('path')

/** @type {import('next').NextConfig} */
module.exports = withReactSvg({
    include: path.resolve(__dirname, 'src/assets/svg'),
    webpack(config, options) {
        return config
    },
    reactStrictMode: true,
    basePath: `${process.env.NEXT_PUBLIC_BASE_PATH}`,
    assetPrefix: `${process.env.NEXT_PUBLIC_BASE_PATH}/`,
    publicRuntimeConfig: {
        path: `${process.env.NEXT_PUBLIC_BASE_PATH}` // Pass through env variables
    },
    trailingSlash: true,
    images: {
        domains: ['cdn.orangery.io'],
        loader: 'akamai',
        path: '/',
    },
})

