import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  Output,
  HostListener,
  ElementRef,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface SelectOption {
  value: any;
  label: string;
}

let selectIdCounter = 0;

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
  @Input() options: SelectOption[] = [];
  @Input() label = '';
  @Input() placeholder = 'Selecione uma opção';
  @Input() disabled = false;
  @Input() error = false;

  @Output() change = new EventEmitter<any>();

  readonly id = `ui-select-${selectIdCounter++}`;
  value: any = null;
  isOpen = false;
  selectedLabel = '';
  focusedIndex = -1;

  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef) {}

  // Fecha o dropdown ao clicar fora do componente
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (this.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.isOpen) {
          if (this.focusedIndex >= 0 && this.focusedIndex < this.options.length) {
            this.selectOption(this.options[this.focusedIndex]);
          } else {
            this.closeDropdown();
          }
        } else {
          this.openDropdown();
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen) {
          this.openDropdown();
        } else {
          this.focusedIndex =
            this.focusedIndex < this.options.length - 1
              ? this.focusedIndex + 1
              : 0;
          this.scrollToFocusedOption();
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen) {
          this.openDropdown();
        } else {
          this.focusedIndex =
            this.focusedIndex > 0
              ? this.focusedIndex - 1
              : this.options.length - 1;
          this.scrollToFocusedOption();
        }
        break;

      case 'Home':
        event.preventDefault();
        if (this.isOpen) {
          this.focusedIndex = 0;
          this.scrollToFocusedOption();
        }
        break;

      case 'End':
        event.preventDefault();
        if (this.isOpen) {
          this.focusedIndex = this.options.length - 1;
          this.scrollToFocusedOption();
        }
        break;

      case 'Escape':
        event.preventDefault();
        this.closeDropdown();
        break;

      case 'Tab':
        if (this.isOpen) {
          this.closeDropdown();
        }
        break;
    }
  }

  toggleDropdown(): void {
    if (this.disabled) return;
    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  private openDropdown(): void {
    this.isOpen = true;
    this.onTouched();

    // Define o foco inicial na opção selecionada ou na primeira
    const selectedIndex = this.options.findIndex(opt => opt.value === this.value);
    this.focusedIndex = selectedIndex >= 0 ? selectedIndex : 0;

    // Aguarda renderização para scrollar
    setTimeout(() => this.scrollToFocusedOption(), 0);
  }

  private closeDropdown(): void {
    this.isOpen = false;
    this.focusedIndex = -1;
  }

  private scrollToFocusedOption(): void {
    if (!this.isOpen || this.focusedIndex < 0) return;

    const container = this.elementRef.nativeElement.querySelector('.ui-select-options');
    const option = container?.children[this.focusedIndex] as HTMLElement;

    if (container && option) {
      const containerRect = container.getBoundingClientRect();
      const optionRect = option.getBoundingClientRect();

      if (optionRect.bottom > containerRect.bottom) {
        container.scrollTop += optionRect.bottom - containerRect.bottom;
      } else if (optionRect.top < containerRect.top) {
        container.scrollTop -= containerRect.top - optionRect.top;
      }
    }
  }

  selectOption(option: SelectOption): void {
    if (this.disabled) return;

    this.value = option.value;
    this.selectedLabel = option.label;
    this.closeDropdown();

    this.onChange(this.value);
    this.change.emit(this.value);
  }

  // Métodos ControlValueAccessor
  writeValue(value: any): void {
    this.value = value;
    const selected = this.options.find((opt) => opt.value === value);
    this.selectedLabel = selected ? selected.label : '';
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
