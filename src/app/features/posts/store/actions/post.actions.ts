import { createAction, props } from '@ngrx/store';
import { Post } from '../../models/post.model';

export type PostLoadReason = 'no posts cached' | 'cache expired';

export const loadPosts = createAction('[Posts] Load Posts');

export const loadPostsSuccess = createAction(
  '[Posts] Load Posts Success',
  props<{ posts: Post[] }>()
);

export const loadPostsFailure = createAction(
  '[Posts] Load Posts Failure',
  props<{ error: string }>()
);

export const loadPost = createAction('[Posts] Load Post', props<{ id: number }>());

export const loadPostSuccess = createAction(
  '[Posts] Load Post Success',
  props<{ post: Post }>()
);

export const loadPostFailure = createAction(
  '[Posts] Load Post Failure',
  props<{ error: string }>()
);

export const clearCache = createAction('[Posts] Clear Cache and Reset Store');

export const loadPostsFromCache = createAction(
  '[Posts] Load Posts from Cache (hit)',
  props<{ posts: Post[] }>()
);

export const loadPostsStarted = createAction(
  '[Posts] Load Posts Started',
  props<{ reason: PostLoadReason }>()
);
