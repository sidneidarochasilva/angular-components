import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
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
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, SwitchComponent],
  templateUrl: './switch-doc.component.html',
  styleUrls: ['./switch-doc.component.css'],
})
export class SwitchDocComponent {

  demoValue = false;
  demoDisabled = false;
  demoLoading = false;
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
  label="Switch básico">
</ui-switch>
`.trim();

  reactiveFormCode = `
form = new FormGroup({
  notifications: new FormControl(false),
  settings: new FormControl(true),
});

<form [formGroup]="form">
  <ui-switch
    formControlName="notifications"
    label="Habilitar notificações">
  </ui-switch>
  <ui-switch
    formControlName="settings"
    label="Configurações">
  </ui-switch>
</form>
`.trim();

  disabledCode = `
<ui-switch
  [disabled]="true"
  [ngModel]="true"
  label="Desabilitado ligado">
</ui-switch>

<ui-switch
  [disabled]="true"
  [ngModel]="false"
  label="Desabilitado desligado">
</ui-switch>
`.trim();

  eventHandlingCode = `
<ui-switch
  label="Clique aqui!"
  (change)="handleChange($event)">
</ui-switch>

handleChange(value: boolean) {
  console.log('New value:', value);
}
`.trim();
}
