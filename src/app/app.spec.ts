import { MockBuilder, MockRender } from 'ng-mocks';
import 'zone.js';
import 'zone.js/testing';
import { App } from './app';
import { ThemeToggleComponent } from './shared/components/theme-toggle/theme-toggle.component';

describe('App', () => {
  beforeEach(() => {
    return MockBuilder(App).mock(ThemeToggleComponent);
  });

  it('should create the app', () => {
    const fixture = MockRender(App);
    expect(fixture.point.componentInstance).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = MockRender(App);
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('User Dashboard');
  });
});
