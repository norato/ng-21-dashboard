import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CardModule } from 'primeng/card';
import { Post } from '../../models/post.model';
import * as PostActions from '../../store/actions/post.actions';
import * as PostSelectors from '../../store/selectors/post.selectors';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, CardModule],
  templateUrl: './post-list.component.html',
})
export class PostListComponent implements OnInit {
  private readonly store = inject(Store);

  posts$: Observable<Post[]> = this.store.select(PostSelectors.selectAllPosts);
  isLoading$: Observable<boolean> = this.store.select(PostSelectors.selectPostsLoading);
  error$: Observable<string | null> = this.store.select(PostSelectors.selectPostsError);

  ngOnInit(): void {
    this.store.dispatch(PostActions.loadPosts());
  }
}
