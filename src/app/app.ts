import { ThemeToggleComponent } from '$shared';
import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { CacheStatusComponent } from './shared/components/cache-status/cache-status';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ThemeToggleComponent, ToastModule, CacheStatusComponent],
  templateUrl: './app.html',
})
export class App {}
