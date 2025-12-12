import { loadFromLocalStorage, STORAGE_KEYS } from '$core';
import { createReducer, on } from '@ngrx/store';
import { Post } from '../../models/post.model';
import * as PostActions from '../actions/post.actions';

export interface PostState {
  posts: Post[];
  selectedPost: Post | null;
  isLoading: boolean;
  error: string | null;
}

const persistedPosts = loadFromLocalStorage<Post[]>(STORAGE_KEYS.POSTS_STATE);

export const initialState: PostState = {
  posts: persistedPosts || [],
  selectedPost: null,
  isLoading: false,
  error: null,
};

export const postReducer = createReducer(
  initialState,
  on(PostActions.loadPosts, (state) => ({
    ...state,
    isLoading: true,
    error: null,
  })),
  on(PostActions.loadPostsSuccess, (state, { posts }) => ({
    ...state,
    posts,
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
  }))
);
