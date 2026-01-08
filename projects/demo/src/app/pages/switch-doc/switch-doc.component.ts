import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SwitchComponent } from 'ui';

@Component({
  selector: 'app-switch-doc',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SwitchComponent],
  templateUrl: './switch-doc.component.html',
  styleUrls: ['./switch-doc.component.css'],
})
export class SwitchDocComponent {
  // valores usados só nos exemplos visuais da doc
  demoValue = false;
  demoDisabled = false;
  demoLabel = 'Rótulo do Switch';

  // exemplo simples de reactive forms
  form = new FormGroup({
    notifications: new FormControl(false),
    settings: new FormControl(true),
  });

  lastEventValue: boolean | null = null;

  onDemoChange(value: boolean): void {
    console.log('demo change:', value);
  }

  onEventChange(value: boolean): void {
    this.lastEventValue = value;
    console.log('event value:', value);
  }

  // snippets mostrados na página de documentação
  basicUsageCode = `
<ui-switch
  [(ngModel)]="isChecked"
  label="Toggle me">
</ui-switch>
`.trim();

  reactiveFormCode = `
form = new FormGroup({
  notifications: new FormControl(false)
});

<form [formGroup]="form">
  <ui-switch
    formControlName="notifications"
    label="Enable Notifications">
  </ui-switch>
</form>
`.trim();

  disabledCode = `
<ui-switch
  [disabled]="true"
  [ngModel]="true"
  label="Disabled Checked">
</ui-switch>

<ui-switch
  [disabled]="true"
  [ngModel]="false"
  label="Disabled Unchecked">
</ui-switch>
`.trim();

  eventHandlingCode = `
<ui-switch
  label="With Event"
  (change)="handleChange($event)">
</ui-switch>

handleChange(value: boolean) {
  console.log('New value:', value);
}
`.trim();
}
