import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SelectComponent } from 'ui';

@Component({
  selector: 'app-switch-doc',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectComponent],
  templateUrl: './select-doc.component.html',
  styleUrls: ['./select-doc.component.css'],
})
export class SelectDocComponent {
  control = new FormControl('');
  options = [
    { label: 'Option 1', value: '1' },
    { label: 'Option 2', value: '2' },
    { label: 'Option 3', value: '3' },
  ];
}
