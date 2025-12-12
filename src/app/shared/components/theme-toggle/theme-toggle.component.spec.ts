import 'zone.js';
import 'zone.js/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { MockBuilder, MockRender } from 'ng-mocks';
import { ThemeToggleComponent } from './theme-toggle.component';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

describe('ThemeToggleComponent', () => {
  beforeEach(() => {
    // Mock localStorage
    const store: Record<string, string> = {};
    global.localStorage = {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => { store[key] = value; },
      removeItem: (key: string) => { delete store[key]; },
      clear: () => { Object.keys(store).forEach(k => delete store[k]); },
      key: () => null,
      length: 0,
    } as Storage;

    // Mock matchMedia
    global.matchMedia = () => ({
      matches: false,
      media: '',
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList;

    return MockBuilder(ThemeToggleComponent).mock(ToggleSwitchModule);
  });

  it('should initialize in light mode by default', () => {
    const fixture = MockRender(ThemeToggleComponent);
    const component = fixture.point.componentInstance;

    expect(component.isDarkMode()).toBe(false);
  });

  it('should activate light mode when toggled to light', () => {
    const fixture = MockRender(ThemeToggleComponent);
    const component = fixture.point.componentInstance;

    component.toggleTheme(false);

    expect(component.isDarkMode()).toBe(false);
  });

  it('should activate dark mode when toggled to dark', () => {
    const fixture = MockRender(ThemeToggleComponent);
    const component = fixture.point.componentInstance;

    component.toggleTheme(true);

    expect(component.isDarkMode()).toBe(true);
  });
});
