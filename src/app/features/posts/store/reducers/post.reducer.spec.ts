import 'zone.js';
import 'zone.js/testing';
import { describe, it, expect } from 'vitest';
import { postReducer, initialState } from './post.reducer';
import * as PostActions from '../actions/post.actions';

describe('PostReducer', () => {
  it('should load posts successfully', () => {
    const mockPosts = [{ userId: 1, id: 1, title: 'Test', body: 'Body' }];
    const action = PostActions.loadPostsSuccess({ posts: mockPosts });
    const state = postReducer(initialState, action);

    expect(state.posts).toEqual(mockPosts);
    expect(state.isLoading).toBe(false);
  });
});
