import type { Config } from '@docusaurus/types';
import type { Preset } from '@docusaurus/preset-classic';

const config: Config = {
  title: 'ToolBox Docs',
  tagline: 'Documentation for ToolBox',
  url: 'https://rishabh3562.github.io',     
  baseUrl: '/ToolBox/',                     
  favicon: 'img/favicon.ico',
  organizationName: 'rishabh3562',
  projectName: 'ToolBox',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  presets: [
    [
      'classic',
      {
        docs: { sidebarPath: require.resolve('./sidebars.ts') },
        blog: false, 
        theme: { customCss: require.resolve('./src/css/custom.css') },
      } satisfies Preset.Options,
    ],
  ],

 plugins: [
  [
    require.resolve('@cmfcmf/docusaurus-search-local'),
    {
      indexDocs: true,
      indexPages: true,
      indexBlog: false,
      language: ['en'],
    },
  ],
],


  themeConfig: {
    navbar: {
      title: 'ToolBox',
      items: [
        { to: '/docs/getting-started', label: 'Docs', position: 'left' },
        { to: '/docs/guides/overview', label: 'Guides', position: 'left' },
        { to: '/docs/api/', label: 'API', position: 'left' },
        { href: 'https://github.com/rishabh3562/ToolBox', label: 'GitHub', position: 'right' },
      ],
    },

    // Algolia search can be configured later by the repo owner:
    // algolia: { appId: 'APP_ID', apiKey: 'SEARCH_API_KEY', indexName: 'toolbox' },
  },
};

export default config;
