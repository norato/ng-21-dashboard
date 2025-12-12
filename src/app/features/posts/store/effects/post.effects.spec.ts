import 'zone.js';
import 'zone.js/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { PostEffects } from './post.effects';
import { PostService } from '../../services/post.service';
import * as PostActions from '../actions/post.actions';

describe('PostEffects', () => {
  let actions$: Observable<any>;
  let effects: PostEffects;
  let postService: PostService;

  beforeEach(() => {
    const postServiceMock = {
      getPosts: vi.fn(),
      getPostById: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        PostEffects,
        provideMockActions(() => actions$),
        { provide: PostService, useValue: postServiceMock },
      ],
    });

    effects = TestBed.inject(PostEffects);
    postService = TestBed.inject(PostService);
  });

  it('should return loadPostsSuccess on success', async () => {
    const mockPosts = [{ userId: 1, id: 1, title: 'Test', body: 'Body' }];
    vi.mocked(postService.getPosts).mockReturnValue(of(mockPosts));

    actions$ = of(PostActions.loadPosts());

    const result = await new Promise<any>((resolve) => {
      effects.loadPosts$.subscribe((action) => resolve(action));
    });

    expect(result).toEqual(PostActions.loadPostsSuccess({ posts: mockPosts }));
  });
});
