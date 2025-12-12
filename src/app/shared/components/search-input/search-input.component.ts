import { Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './search-input.component.html',
})
export class SearchInputComponent {
  control = input.required<FormControl<string>>();
  placeholder = input<string>('Search...');
}
