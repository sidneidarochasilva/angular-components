import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

// Interface para as opções do select
export interface SelectOption {
  value: any;
  label: string;
  disabled?: boolean;
}

let nextId = 0;

@Component({
  selector: 'ui-select',
  standalone: true,
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true,
    },
  ],
})
export class SelectComponent implements ControlValueAccessor {
  // Inputs de configuração
  @Input() options: SelectOption[] = [];
  @Input() label = '';
  @Input() placeholder = 'Selecione...';

  // Estados
  @Input() disabled = false;
  @Input() error = false;

  @Output() change = new EventEmitter<any>();

  // ID único para acessibilidade
  readonly id = `ui-select-${nextId++}`;

  // Valor interno
  value: any = null;

  // Callbacks do ControlValueAccessor
  private onChange: (val: any) => void = () => {};
  private onTouched: () => void = () => {};

  /**
   * Captura a mudança no select nativo e propaga
   */
  onSelectChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const newValue = target.value || null;

    this.value = newValue;
    this.onChange(newValue);
    this.change.emit(newValue);
  }

  markAsTouched(): void {
    this.onTouched();
  }

  // ControlValueAccessor

  writeValue(val: any): void {
    this.value = val;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
