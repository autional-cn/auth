/** @type {import('tailwindcss').Config} */
// GENERATED FILE — DO NOT EDIT. Source: tokens/tokens.json · Regenerate: pnpm gen · v0.1.0-rc
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          '50': 'var(--color-primary-50)',
          '100': 'var(--color-primary-100)',
          '200': 'var(--color-primary-200)',
          '300': 'var(--color-primary-300)',
          '400': 'var(--color-primary-400)',
          '500': 'var(--color-primary-500)',
          '600': 'var(--color-primary-600)',
          '700': 'var(--color-primary-700)',
          '800': 'var(--color-primary-800)',
          '900': 'var(--color-primary-900)'
        },
        sky: {
          '50': 'var(--color-sky-50)',
          '100': 'var(--color-sky-100)',
          '200': 'var(--color-sky-200)',
          '300': 'var(--color-sky-300)',
          '400': 'var(--color-sky-400)',
          '500': 'var(--color-sky-500)',
          '600': 'var(--color-sky-600)',
          '700': 'var(--color-sky-700)',
          '800': 'var(--color-sky-800)',
          '900': 'var(--color-sky-900)'
        },
        amber: {
          '50': 'var(--color-amber-50)',
          '100': 'var(--color-amber-100)',
          '200': 'var(--color-amber-200)',
          '300': 'var(--color-amber-300)',
          '400': 'var(--color-amber-400)',
          '500': 'var(--color-amber-500)',
          '600': 'var(--color-amber-600)',
          '700': 'var(--color-amber-700)',
          '800': 'var(--color-amber-800)',
          '900': 'var(--color-amber-900)'
        },
        neutral: {
          '0': 'var(--color-neutral-0)',
          '50': 'var(--color-neutral-50)',
          '100': 'var(--color-neutral-100)',
          '200': 'var(--color-neutral-200)',
          '300': 'var(--color-neutral-300)',
          '400': 'var(--color-neutral-400)',
          '500': 'var(--color-neutral-500)',
          '600': 'var(--color-neutral-600)',
          '700': 'var(--color-neutral-700)',
          '800': 'var(--color-neutral-800)',
          '900': 'var(--color-neutral-900)'
        },
        chart: {
          '1': 'var(--color-chart-1)',
          '2': 'var(--color-chart-2)',
          '3': 'var(--color-chart-3)',
          '4': 'var(--color-chart-4)',
          '5': 'var(--color-chart-5)',
          '6': 'var(--color-chart-6)',
          '7': 'var(--color-chart-7)',
          '8': 'var(--color-chart-8)'
        },
        method: {
          get: 'var(--color-method-get)',
          post: 'var(--color-method-post)',
          put: 'var(--color-method-put)',
          patch: 'var(--color-method-patch)',
          delete: 'var(--color-method-delete)',
          head: 'var(--color-method-head)'
        },
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        danger: 'var(--color-danger)',
        error: 'var(--color-danger)',
        info: 'var(--color-info)',
        brand: 'var(--color-brand)',
        'brand-hover': 'var(--color-brand-hover)',
        'brand-soft': 'var(--color-brand-soft)',
        'brand-active': 'var(--color-brand-active)',
        accent: 'var(--color-accent)',
        inverse: 'var(--color-text-inverse)',
        surface: 'var(--color-bg-surface)',
        muted: 'var(--color-bg-muted)',
        elevated: 'var(--color-bg-elevated)',
        developer: 'var(--color-bg-developer)',
        'border-subtle': 'var(--color-border-subtle)',
        'border-strong': 'var(--color-border-strong)'
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans CJK SC', 'sans-serif'],
        serif: ['Source Han Serif SC', 'Noto Serif SC', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      },
      fontSize: {
        xs: ['12px', {
          lineHeight: '16px'
        }],
        sm: ['14px', {
          lineHeight: '20px'
        }],
        base: ['16px', {
          lineHeight: '24px'
        }],
        lg: ['18px', {
          lineHeight: '28px',
          fontWeight: '500'
        }],
        xl: ['20px', {
          lineHeight: '28px',
          fontWeight: '600'
        }],
        '2xl': ['24px', {
          lineHeight: '32px',
          fontWeight: '700'
        }],
        '3xl': ['30px', {
          lineHeight: '36px',
          fontWeight: '700'
        }],
        '4xl': ['36px', {
          lineHeight: '40px'
        }],
        'display-xl': ['48px', {
          lineHeight: '1.16',
          fontWeight: '800',
          letterSpacing: '-0.02em'
        }],
        'display-lg': ['40px', {
          lineHeight: '1.2',
          fontWeight: '800',
          letterSpacing: '-0.015em'
        }],
        'heading-lg': ['30px', {
          lineHeight: '1.35',
          fontWeight: '700',
          letterSpacing: '-0.01em'
        }],
        'heading-md': ['22px', {
          lineHeight: '1.45',
          fontWeight: '700',
          letterSpacing: '0'
        }],
        'body-lg': ['18px', {
          lineHeight: '1.75'
        }],
        'body-md': ['16px', {
          lineHeight: '1.75'
        }],
        'body-sm': ['14px', {
          lineHeight: '1.6'
        }],
        'label-md': ['14px', {
          lineHeight: '1.43',
          fontWeight: '600'
        }],
        'label-caps': ['12px', {
          lineHeight: '1.35',
          fontWeight: '600',
          letterSpacing: '0.12em'
        }],
        'code-md': ['14px', {
          lineHeight: '1.75'
        }]
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '8': '32px',
        '10': '40px',
        '12': '48px'
      },
      borderRadius: {
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '28px',
        xxl: '32px',
        full: '9999px'
      },
      boxShadow: {
        soft: '0 8px 20px rgba(0, 49, 83, 0.08)',
        card: '0 12px 36px rgba(0, 49, 83, 0.10)',
        brand: '0 24px 80px rgba(0, 49, 83, 0.14)'
      },
      zIndex: {
        base: '0',
        dropdown: '1000',
        sticky: '1020',
        fixed: '1030',
        'modal-backdrop': '1040',
        modal: '1050',
        popover: '1060',
        toast: '1070',
        tooltip: '1080'
      },
      backgroundImage: {
        'brand-radial': 'var(--image-brand-radial)',
        'brand-grid': 'var(--image-brand-grid)',
        'page-light': 'var(--image-page-light)',
        'page-dark': 'var(--image-page-dark)'
      }
    }
  },
  plugins: []
};
