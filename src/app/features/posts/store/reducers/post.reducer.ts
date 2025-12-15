import { loadFromLocalStorage, STORAGE_KEYS } from '$core';
import { createReducer, on } from '@ngrx/store';
import { Post } from '../../models/post.model';
import * as PostActions from '../actions/post.actions';

export interface PostState {
  posts: Post[];
  postsCachedAt: number | null; // Timestamp do cache
  selectedPost: Post | null;
  isLoading: boolean;
  error: string | null;
}

const persistedState = loadFromLocalStorage<PostState>(STORAGE_KEYS.POSTS_STATE);

export const initialState: PostState = persistedState || {
  posts: [],
  postsCachedAt: null,
  selectedPost: null,
  isLoading: false,
  error: null,
};

export const postReducer = createReducer(
  initialState,
  on(PostActions.loadPostsStarted, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(PostActions.loadPostsFromCache, (state, { posts }) => ({
    ...state,
    posts,
    isLoading: false,
    error: null,
  })),
  on(PostActions.loadPostsSuccess, (state, { posts }) => ({
    ...state,
    posts,
    postsCachedAt: Date.now(),
    isLoading: false,
    error: null,
  })),
  on(PostActions.loadPostsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(PostActions.loadPost, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(PostActions.loadPostSuccess, (state, { post }) => ({
    ...state,
    selectedPost: post,
    isLoading: false,
    error: null,
  })),
  on(PostActions.loadPostFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error,
  })),
  on(PostActions.clearCache, () => ({
    posts: [],
    postsCachedAt: null,
    selectedPost: null,
    isLoading: false,
    error: null,
  }))
);
