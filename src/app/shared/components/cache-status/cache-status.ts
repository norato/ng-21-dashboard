import { CacheMessageBus } from '$core';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-cache-status',
  imports: [CommonModule, ButtonModule, TooltipModule],
  templateUrl: './cache-status.html',
})
export class CacheStatusComponent {
  private readonly cacheBus = inject(CacheMessageBus);
  private readonly destroyRef = inject(DestroyRef);

  private readonly activeStoreName = toSignal(this.cacheBus.currentStore$, { initialValue: null });

  readonly dataAge = signal('Sem dados em cache');

  constructor() {
    // Efeito para reagir a mudanças na store ativa
    effect(() => {
      const currentStore = this.activeStoreName();
      if (currentStore) {
        this.updateAge(currentStore);
      } else {
        this.dataAge.set('Sem dados em cache');
      }
    });

    // Escuta eventos de dados salvos para atualizações imediatas
    this.cacheBus
      .onDataSavedForActiveStore()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const currentStore = this.activeStoreName();
        if (currentStore) {
          this.updateAge(currentStore);
        }
      });

    // Atualização periódica a cada minuto usando RxJS interval
    interval(60000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const currentStore = this.activeStoreName();
        if (currentStore) {
          this.updateAge(currentStore);
        }
      });
  }

  onReload(): void {
    this.cacheBus.requestReloadForActiveStore();
  }

  private updateAge(storeName: string): void {
    const age = this.cacheBus.getAgeOfStore(storeName);

    if (age === null) {
      this.dataAge.set('Sem dados em cache');
      return;
    }

    const minutes = Math.floor(age / 60000);

    if (minutes === 0) {
      this.dataAge.set('Atualizado agora');
    } else if (minutes === 1) {
      this.dataAge.set('Atualizado há 1 minuto');
    } else {
      this.dataAge.set(`Atualizado há ${minutes} minutos`);
    }
  }
}
