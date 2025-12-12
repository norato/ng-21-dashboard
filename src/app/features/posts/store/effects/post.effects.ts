import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { PostService } from '../../services/post.service';
import * as PostActions from '../actions/post.actions';

@Injectable()
export class PostEffects {
  private actions$ = inject(Actions);
  private postService = inject(PostService);

  loadPosts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PostActions.loadPosts),
      switchMap(() =>
        this.postService.getPosts().pipe(
          map((posts) => PostActions.loadPostsSuccess({ posts })),
          catchError((error) => of(PostActions.loadPostsFailure({ error: error.message })))
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
          catchError((error) => of(PostActions.loadPostFailure({ error: error.message })))
        )
      )
    )
  );
}
