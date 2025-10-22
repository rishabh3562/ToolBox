import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  docs: [
    { type: 'doc', id: 'getting-started' },
    {
      type: 'category',
      label: 'Guides',
      items: ['guides/overview'],
    },
    {
      type: 'category',
      label: 'API',
      items: ['api/README'],
    },
    {
      type: 'category',
      label: 'Plugins',
      items: ['plugins/authoring'],
    },
    { type: 'doc', id: 'faq' },
    { type: 'doc', id: 'troubleshooting' },
    { type: 'doc', id: 'contributing' },
  ],
};

export default sidebars;
