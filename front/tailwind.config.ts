import type {Config} from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                bg: "url(/map.png)"
            },
            colors: {
                primary: "#00d256",
                secondary: "#fff",
                text: "#000",
                highlight: "#00d256",
                dark: "#131313",
                subprimary: {
                    50: '#e6f9ed',
                    100: '#ccf3db',
                    200: '#99e7b7',
                    300: '#66dba3',
                    400: '#33cf8f',
                    500: '#00d256',
                    600: '#00a846',
                    700: '#007e36',
                    800: '#005426',
                    900: '#002a16',
                },
                subsecondary: {
                    50: '#ffffff',
                    100: '#ffffff',
                    200: '#ffffff',
                    300: '#ffffff',
                    400: '#ffffff',
                    500: '#ffffff',
                    600: '#cccccc',
                    700: '#999999',
                    800: '#666666',
                    900: '#333333',
                },
                subtext: {
                    50: '#e6e6e6',
                    100: '#cccccc',
                    200: '#b3b3b3',
                    300: '#999999',
                    400: '#808080',
                    500: '#000000',
                    600: '#666666',
                    700: '#4d4d4d',
                    800: '#333333',
                    900: '#1a1a1a',
                },
                subhighlight: {
                    50: '#e6f9ed',
                    100: '#ccf3db',
                    200: '#99e7b7',
                    300: '#66dba3',
                    400: '#33cf8f',
                    500: '#00d256',
                    600: '#00a846',
                    700: '#007e36',
                    800: '#005426',
                    900: '#002a16',
                },
                subdark: {
                    50: '#e6e6e6',
                    100: '#cccccc',
                    200: '#b3b3b3',
                    300: '#999999',
                    400: '#808080',
                    500: '#131313',
                    600: '#666666',
                    700: '#4d4d4d',
                    800: '#333333',
                    900: '#1a1a1a',
                },
            },
        },
    },
    plugins: [],
} satisfies Config;
