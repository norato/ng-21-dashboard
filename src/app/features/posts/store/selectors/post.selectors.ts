import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PostState } from '../reducers/post.reducer';

export const selectPostState = createFeatureSelector<PostState>('posts');

export const selectAllPosts = createSelector(selectPostState, (state) => state.posts);

export const selectSelectedPost = createSelector(selectPostState, (state) => state.selectedPost);

export const selectPostsLoading = createSelector(selectPostState, (state) => state.isLoading);

export const selectPostsError = createSelector(selectPostState, (state) => state.error);

export const selectPostById = (id: number) =>
  createSelector(selectAllPosts, (posts) => posts.find((post) => post.id === id));
