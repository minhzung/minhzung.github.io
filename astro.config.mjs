import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
    markdown: {
        shikiConfig: {
          theme: "github-light",
        },
    },
    integrations: [
      mdx({
			syntaxHighlight: 'shiki',
			shikiConfig: {
				theme: 'github-light',
			},
      optimize: true,
			
		})
      ],
    image: {
      domains: ["docs.astro.build", "source.unsplash.com"],
    }
});
