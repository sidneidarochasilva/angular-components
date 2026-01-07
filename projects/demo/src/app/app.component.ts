import { Component } from '@angular/core';
import { SwitchComponent, SelectComponent } from 'ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SwitchComponent, SelectComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}
