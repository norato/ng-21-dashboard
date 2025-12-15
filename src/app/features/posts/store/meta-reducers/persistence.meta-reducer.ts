import { saveToLocalStorage, STORAGE_KEYS } from '$core';
import { ActionReducer } from '@ngrx/store';
import * as PostActions from '../actions/post.actions';
import { PostState } from '../reducers/post.reducer';

export function postsPersistenceMetaReducer(
  reducer: ActionReducer<PostState>
): ActionReducer<PostState> {
  return (state, action) => {
    const nextState = reducer(state, action);

    // Persist full state (posts + timestamp) after successful load
    if (action.type === PostActions.loadPostsSuccess.type) {
      saveToLocalStorage(STORAGE_KEYS.POSTS_STATE, nextState);
    }

    return nextState;
  };
}
