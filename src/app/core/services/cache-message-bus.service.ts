import { Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { getDataAge } from '../utils/local-storage.utils';

@Injectable({
  providedIn: 'root',
})
export class CacheMessageBus {
  private readonly currentStore$$ = new BehaviorSubject<string | null>(null);
  private readonly reloadRequested$$ = new Subject<string>();
  private readonly dataSaved$$ = new Subject<string>();

  readonly currentStore$ = this.currentStore$$.asObservable();
  readonly reloadRequested$ = this.reloadRequested$$.asObservable();
  readonly dataSaved$ = this.dataSaved$$.asObservable();

  readonly currentActiveStore = toSignal(this.currentStore$);

  /**
   * Chamado pela página quando ela é ativada
   * Define qual store está sendo usada
   */
  setActiveStore(storeName: string): void {
    this.currentStore$$.next(storeName);
  }

  /**
   * Chamado pelo ReloadButton (não precisa saber qual store)
   * Emite reload para a store ativa
   */
  requestReloadForActiveStore(): void {
    const activeStoreName = this.currentStore$$.value;
    if (activeStoreName) {
      this.reloadRequested$$.next(activeStoreName);
    }
  }

  /**
   * Chamado pelas stores/effects após salvar dados
   */
  notifyDataSaved(storeName: string): void {
    this.dataSaved$$.next(storeName);
  }

  /**
   * Para o CacheStatusComponent escutar salvamento da store ATIVA
   */
  onDataSavedForActiveStore(): Observable<void> {
    return this.dataSaved$$.pipe(
      withLatestFrom(this.currentStore$$),
      filter(([savedStore, activeStore]) => activeStore !== null && savedStore === activeStore),
      map(() => void 0)
    );
  }

  /**
   * Retorna a idade dos dados de uma store específica
   */
  getAgeOfStore(storeName: string): number | null {
    return getDataAge(storeName);
  }
}
