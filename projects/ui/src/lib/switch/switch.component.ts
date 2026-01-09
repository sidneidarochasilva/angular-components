import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * Gera IDs únicos para manter acessibilidade
 * quando múltiplos switches são renderizados
 */
let switchIdCounter = 0;

@Component({
  selector: 'ui-switch',
  standalone: true,
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SwitchComponent),
      multi: true,
    },
  ],
})
export class SwitchComponent implements ControlValueAccessor {
  @Input() disabled = false;
  @Input() label = '';
  @Input() loading? = false;

  /**
   * Evento emitido sempre que o valor é alterado
   * manualmente pelo usuário
   */
  @Output() change = new EventEmitter<boolean>();

  readonly id = `ui-switch-${switchIdCounter++}`;

  value = false;

  // Callbacks do ControlValueAccessor
  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: boolean): void {
    this.value = !!value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  markAsTouched(): void {
    this.onTouched();
  }

  /**
   * Manipula a interação do usuário com o switch
   */
  handleToggle(event: Event): void {
    event.stopPropagation();

    if (this.disabled) {
      return;
    }

    this.updateValue(!this.value);
  }

  private updateValue(value: boolean): void {
    this.value = value;
    this.onChange(value);
    this.change.emit(value);
    this.onTouched();
  }
}
