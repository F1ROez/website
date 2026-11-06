import type {NextConfig} from 'next';
const config:NextConfig={basePath: process.env.NEXT_PUBLIC_BASE_PATH || '', output:'export',trailingSlash:true,images:{unoptimized:true}};export default config;
