import { createAction, props } from '@ngrx/store';
import { Post } from '../../models/post.model';

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
