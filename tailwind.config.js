function withOpacity(variableName) {
    return ({ opacityValue }) => {
        if (opacityValue !== undefined) {
            return `color-mix(in srgb, var(${variableName}) calc(${opacityValue} * 100%), transparent)`;
        }
        return `var(${variableName})`;
    };
}

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: withOpacity('--background'),
                foreground: withOpacity('--foreground'),
                surface: {
                    DEFAULT: withOpacity('--surface'),
                    hover: withOpacity('--surface-hover'),
                    foreground: withOpacity('--surface-foreground'),
                },
                primary: {
                    DEFAULT: withOpacity('--primary'),
                    foreground: withOpacity('--primary-foreground'),
                },
                secondary: {
                    DEFAULT: withOpacity('--secondary'),
                    foreground: withOpacity('--secondary-foreground'),
                },
                tertiary: {
                    DEFAULT: withOpacity('--tertiary'),
                    foreground: withOpacity('--tertiary-foreground'),
                },
                muted: {
                    DEFAULT: withOpacity('--muted'),
                    foreground: withOpacity('--muted-foreground'),
                },
                accent: {
                    DEFAULT: withOpacity('--accent'),
                    foreground: withOpacity('--accent-foreground'),
                },
                destructive: {
                    DEFAULT: withOpacity('--destructive'),
                    foreground: withOpacity('--destructive-foreground'),
                },
                border: withOpacity('--border'),
                input: withOpacity('--input'),
                ring: withOpacity('--ring'),
            },
        },
    },
    plugins: [],
}

