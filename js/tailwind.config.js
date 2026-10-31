/* Tailwind Play CDN config (classic script, must load right after the CDN script) */
tailwind.config = {
    theme: {
        extend: {
            colors: {
                maple: {
                    mahogany: '#2A0D0B',
                    bark: '#3D1B18',
                    crimson: '#C83228',
                    terracotta: '#D95B30',
                    amber: '#EA8124',
                    gold: '#F4B030',
                    cream: '#FAF0DB',
                    moss: '#4A5D3B'
                }
            },
            fontFamily: {
                pixelHeading: ['Silkscreen', 'cursive'],
                pixelText: ['VT323', 'monospace'],
                sans: ['Plus Jakarta Sans', 'sans-serif']
            }
        }
    }
};
