import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SelectComponent, SelectOption } from 'ui';

@Component({
  selector: 'app-select-doc',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SelectComponent],
  templateUrl: './select-doc.component.html',
  styleUrls: ['./select-doc.component.css'],
})
export class SelectDocComponent {
  // Valores da Demonstração Interativa
  demoValue: string | null = null;
  demoLabel = '';
  demoPlaceholder = 'Selecione...';
  demoDisabled = false;
  demoError = false;

  // Opções
  demoOptions: SelectOption[] = [
    { value: 'opt1', label: 'Opção 1' },
    { value: 'opt2', label: 'Opção 2' },
    { value: 'opt3', label: 'Opção 3 (Desabilitada)', disabled: true },
    { value: 'opt4', label: 'Opção 4' },
  ];


  // Reactive Forms Demo
  form = new FormGroup({
    framework: new FormControl('', Validators.required),
    version: new FormControl({ value: 'v17', disabled: true }),
  });

  frameworkOptions: SelectOption[] = [
    { value: 'angular', label: 'Angular' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
  ];

  versionOptions: SelectOption[] = [
    { value: 'v15', label: 'Versão 15' },
    { value: 'v16', label: 'Versão 16' },
    { value: 'v17', label: 'Versão 17' },
  ];

  onDemoChange(value: any): void {
    console.log('Valor alterado:', value);
  }

  // Snippets de Código
  basicUsageCode = `
<ui-select
  label="Escolha um item"
  [options]="options"
  [(ngModel)]="selectedItem">
</ui-select>
`.trim();

  optionsInterfaceCode = `
interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}
`.trim();

  reactiveFormCode = `
form = new FormGroup({
  framework: new FormControl('', Validators.required),
  version: new FormControl({ value: 'v17', disabled: true }),
});

    <form [formGroup]="form">
          <ui-select
            [options]="frameworkOptions"
            formControlName="framework"
            placeholder="Selecione um framework"
            [error]="!!(form.get('framework')?.invalid && form.get('framework')?.touched)"
          >
          </ui-select>

          <ui-select
            label="Versão (Desabilitado no Form)"
            [options]="versionOptions"
            formControlName="version"
          >
          </ui-select>
    </form>
`.trim();
}
