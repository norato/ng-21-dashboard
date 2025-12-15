import { CacheMessageBus, GLOBAL_ERROR_CODES, STORAGE_KEYS, ToastService } from '$core';
import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { PostService } from '../../services/post.service';
import * as PostActions from '../actions/post.actions';
import { PostLoadReason } from '../actions/post.actions';
import * as PostSelectors from '../selectors/post.selectors';

const CACHE_TTL = 30 * 60 * 1000; // 30 minutos

@Injectable()
export class PostEffects {
  private readonly actions$ = inject(Actions);
  private readonly store = inject(Store);
  private readonly postService = inject(PostService);
  private readonly toastService = inject(ToastService);
  private readonly cacheBus = inject(CacheMessageBus);

  loadPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.loadPosts),
      withLatestFrom(
        this.store.select(PostSelectors.selectAllPosts),
        this.store.select((state: any) => state.posts?.postsCachedAt)
      ),
      switchMap(([_, posts, cachedAt]) => {
        const hasPosts = posts.length > 0;
        const isCacheValid = cachedAt && Date.now() - cachedAt < CACHE_TTL;

        if (hasPosts && isCacheValid) {
          return of(PostActions.loadPostsFromCache({ posts }));
        }

        let reason: PostLoadReason;
        if (hasPosts) {
          reason = 'cache expired';
        } else {
          reason = 'no posts cached';
        }

        return of(PostActions.loadPostsStarted({ reason })).pipe(
          switchMap(() =>
            this.postService.getPosts().pipe(
              map((posts) => PostActions.loadPostsSuccess({ posts })),
              catchError((error) => {
                if (!GLOBAL_ERROR_CODES.includes(error.status)) {
                  this.toastService.showError('Error loading posts');
                }
                return of(PostActions.loadPostsFailure({ error: error.message }));
              })
            )
          )
        );
      })
    )
  );

  notifyOnSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PostActions.loadPostsSuccess),
        tap(() => this.cacheBus.notifyDataSaved(STORAGE_KEYS.POSTS_STATE))
      ),
    { dispatch: false }
  );

  loadPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.loadPost),
      switchMap(({ id }) =>
        this.postService.getPostById(id).pipe(
          map((post) => PostActions.loadPostSuccess({ post })),
          catchError((error) => {
            if (!GLOBAL_ERROR_CODES.includes(error.status)) {
              this.toastService.showError('Error loading post');
            }
            return of(PostActions.loadPostFailure({ error: error.message }));
          })
        )
      )
    )
  );
}
