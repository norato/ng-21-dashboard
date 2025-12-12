import type { Preview } from '@storybook/angular';
import { setCompodocJson } from "@storybook/addon-docs/angular";
import { applicationConfig } from '@storybook/angular';
import { provideAnimations } from '@angular/platform-browser/animations';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
import docJson from "../documentation.json";
setCompodocJson(docJson);

const preview: Preview = {
  decorators: [
    applicationConfig({
      providers: [
        provideAnimations(),
        providePrimeNG({
          theme: {
            preset: Lara,
            options: {
              darkModeSelector: '.dark-mode',
            }
          }
        })
      ],
    }),
  ],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;