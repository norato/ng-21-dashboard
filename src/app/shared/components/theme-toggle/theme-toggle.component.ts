import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [ToggleSwitchModule, FormsModule],
  template: `
    <div class="flex items-center gap-3 p-4">
      <label class="flex items-center gap-3 cursor-pointer">
        <span class="font-medium select-none">
          {{ isDarkMode() ? 'Dark Mode' : 'Light Mode' }}
        </span>
        <p-toggleswitch
          [ngModel]="isDarkMode()"
          (ngModelChange)="toggleTheme($event)"
        />
      </label>
    </div>
  `,
})
export class ThemeToggleComponent {
  private readonly document = inject(DOCUMENT);
  private readonly window = this.document.defaultView;
  isDarkMode = signal(false);

  constructor() {
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = this.window?.matchMedia('(prefers-color-scheme: dark)').matches ?? false;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      this.isDarkMode.set(true);
      this.applyDarkMode();
    }
  }

  toggleTheme(value: boolean) {
    this.isDarkMode.set(value);

    if (value) {
      this.applyDarkMode();
      localStorage.setItem('theme', 'dark');
    } else {
      this.applyLightMode();
      localStorage.setItem('theme', 'light');
    }
  }

  private applyDarkMode() {
    this.document.documentElement.classList.add('dark');
  }

  private applyLightMode() {
    this.document.documentElement.classList.remove('dark');
  }
}
