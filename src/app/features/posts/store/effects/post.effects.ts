import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ToastService } from '../../../../core/services/toast.service';
import { PostService } from '../../services/post.service';
import * as PostActions from '../actions/post.actions';

@Injectable()
export class PostEffects {
  private readonly actions$ = inject(Actions);
  private readonly postService = inject(PostService);
  private readonly toastService = inject(ToastService);

  loadPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.loadPosts),
      switchMap(() =>
        this.postService.getPosts().pipe(
          map((posts) => PostActions.loadPostsSuccess({ posts })),
          catchError((error) => {
            this.toastService.showError('Error loading posts');
            return of(PostActions.loadPostsFailure({ error: error.message }));
          })
        )
      )
    )
  );

  loadPost$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.loadPost),
      switchMap(({ id }) =>
        this.postService.getPostById(id).pipe(
          map((post) => PostActions.loadPostSuccess({ post })),
          catchError((error) => {
            this.toastService.showError('Error loading post');
            return of(PostActions.loadPostFailure({ error: error.message }));
          })
        )
      )
    )
  );
}
