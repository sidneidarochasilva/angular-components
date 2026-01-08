import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextId = 0;

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
  @Input() disabled: boolean = false;
  @Input() label: string = 'teste';

  @Output() change = new EventEmitter<boolean>();

  id = `ui-switch-${nextId++}`;
  value = false;

  private onChangeFn = (value: boolean) => {};
  private onTouchedFn = () => {};

  markAsTouched(): void {
    this.onTouchedFn();
  }

  writeValue(value: boolean): void {
    this.value = value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  toggle(): void {
    if (this.disabled) {
      return;
    }
    this.value = !this.value;
    this.onChangeFn(this.value);
    this.change.emit(this.value);
    this.onTouchedFn();
  }
}
