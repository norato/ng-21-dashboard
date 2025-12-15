import { CacheMessageBus, clearFromLocalStorage, STORAGE_KEYS } from '$core';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Store } from '@ngrx/store';
import { CardModule } from 'primeng/card';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Post } from '../../models/post.model';
import * as PostActions from '../../store/actions/post.actions';
import * as PostSelectors from '../../store/selectors/post.selectors';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './post-list.component.html',
})
export class PostListComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly cacheBus = inject(CacheMessageBus);
  private readonly destroyRef = inject(DestroyRef);

  posts$: Observable<Post[]> = this.store.select(PostSelectors.selectAllPosts);
  isLoading$: Observable<boolean> = this.store.select(PostSelectors.selectPostsLoading);
  error$: Observable<string | null> = this.store.select(PostSelectors.selectPostsError);

  ngOnInit(): void {
    // Registra que essa página usa POSTS_STATE
    this.cacheBus.setActiveStore(STORAGE_KEYS.POSTS_STATE);

    // Carrega dados inicial
    this.store.dispatch(PostActions.loadPosts());

    // Escuta eventos de reload específicos para POSTS_STATE
    this.cacheBus.reloadRequested$
      .pipe(
        filter((storeName) => storeName === STORAGE_KEYS.POSTS_STATE),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => {
        // Limpa cache da store (dispara named action) + localStorage
        this.store.dispatch(PostActions.clearCache());
        clearFromLocalStorage(STORAGE_KEYS.POSTS_STATE);
        // Força novo fetch
        this.store.dispatch(PostActions.loadPosts());
      });
  }
}
