import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent, SelectOption } from './select.component';

@Component({
  standalone: true,
  imports: [SelectComponent, ReactiveFormsModule],
  template: `
    <ui-select
      [formControl]="control"
      [options]="mockOptions"
      label="Test Select"
      placeholder="Select an item"
    />
  `,
})
class TestHostComponent {
  control = new FormControl(null);
  mockOptions: SelectOption[] = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
  ];
}

describe('SelectComponent', () => {
  let fixture: ComponentFixture<SelectComponent>;
  let component: SelectComponent;

  const mockOptions: SelectOption[] = [
    { value: 'val1', label: 'Texto 1' },
    { value: 'val2', label: 'Texto 2' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    component.options = mockOptions;
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve exibir o placeholder quando nenhum valor estiver selecionado', () => {
    const valueEl = fixture.debugElement.query(
      By.css('.ui-select-value')
    ).nativeElement;
    expect(valueEl.textContent.trim()).toBe('Selecione uma opção');
  });

  it('deve abrir o dropdown ao clicar na select box', () => {
    const selectBox = fixture.debugElement.query(By.css('.ui-select-box'));
    selectBox.nativeElement.click();
    fixture.detectChanges();

    const optionsList = fixture.debugElement.query(
      By.css('.ui-select-options')
    );
    expect(optionsList).toBeTruthy();
    expect(component.isOpen).toBeTrue();
  });

  it('deve selecionar uma opção e fechar o dropdown ao clicar nela', () => {
    spyOn(component.change, 'emit');

    // Abre dropdown
    component.toggleDropdown();
    fixture.detectChanges();

    // Clica na primeira opção
    const firstOption = fixture.debugElement.query(By.css('.ui-select-option'));
    firstOption.nativeElement.click();
    fixture.detectChanges();

    expect(component.value).toBe('val1');
    expect(component.selectedLabel).toBe('Texto 1');
    expect(component.isOpen).toBeFalse();
    expect(component.change.emit).toHaveBeenCalledWith('val1');
  });

  it('não deve abrir o dropdown se estiver desabilitado', () => {
    component.disabled = true;
    fixture.detectChanges();

    const selectBox = fixture.debugElement.query(By.css('.ui-select-box'));
    selectBox.nativeElement.click();
    fixture.detectChanges();

    expect(component.isOpen).toBeFalse();
  });

  describe('Navegação por teclado', () => {

    it('deve abrir o dropdown ao pressionar Enter', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      fixture.nativeElement.dispatchEvent(event);
      fixture.detectChanges();
      expect(component.isOpen).toBeTrue();
    });

    it('deve abrir o dropdown ao pressionar Space', () => {
      const event = new KeyboardEvent('keydown', { key: ' ' });
      fixture.nativeElement.dispatchEvent(event);
      fixture.detectChanges();
      expect(component.isOpen).toBeTrue();
    });

    it('deve fechar o dropdown ao pressionar Escape', () => {
      component.isOpen = true;
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Escape' });
      fixture.nativeElement.dispatchEvent(event);
      fixture.detectChanges();
      expect(component.isOpen).toBeFalse();
    });

    it('deve navegar entre as opções com as setas', () => {
      component.isOpen = true;
      fixture.detectChanges();

      // Seta para baixo -> índice 0
      fixture.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      expect(component.focusedIndex).toBe(0);

      // Seta para baixo -> índice 1
      fixture.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      expect(component.focusedIndex).toBe(1);

      // Seta para cima -> índice 0
      fixture.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      expect(component.focusedIndex).toBe(0);
    });

    it('deve selecionar a opção focada ao pressionar Enter', () => {
      component.isOpen = true;
      component.focusedIndex = 1; // Foca na segunda opção ('val2')
      fixture.detectChanges();

      spyOn(component.change, 'emit');

      fixture.nativeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      fixture.detectChanges();

      expect(component.value).toBe('val2');
      expect(component.isOpen).toBeFalse();
      expect(component.change.emit).toHaveBeenCalledWith('val2');
    });
  });

  it('deve fechar o dropdown ao clicar fora do componente', () => {
    component.isOpen = true;
    fixture.detectChanges();

    // Simula clique no body
    document.dispatchEvent(new MouseEvent('click'));
    fixture.detectChanges();

    expect(component.isOpen).toBeFalse();
  });

  // --- Testes de Integração com Reactive Forms ---

  describe('Integração com Reactive Forms', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;
    let hostComponent: TestHostComponent;

    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostComponent = hostFixture.componentInstance;
      hostFixture.detectChanges();
    });

    it('deve atualizar o valor do componente quando o FormControl mudar (writeValue)', () => {
      hostComponent.control.setValue('2' as any);
      hostFixture.detectChanges();

      const selectComponent = hostFixture.debugElement.query(
        By.directive(SelectComponent)
      ).componentInstance;
      expect(selectComponent.value).toBe('2');
      expect(selectComponent.selectedLabel).toBe('Option 2');
    });

    it('deve atualizar o FormControl quando uma opção for selecionada', () => {
      const selectComponentDebug = hostFixture.debugElement.query(
        By.directive(SelectComponent)
      );
      const selectComponent = selectComponentDebug.componentInstance;

      // Abre e seleciona via método interno para simplificar
      selectComponent.selectOption(hostComponent.mockOptions[0]);
      hostFixture.detectChanges();

      expect(hostComponent.control.value).toBe('1' as any);
    });

    it('deve refletir o estado desabilitado do FormControl', () => {
      hostComponent.control.disable();
      hostFixture.detectChanges();

      const selectContainer = hostFixture.debugElement.query(
        By.css('.ui-select-container')
      );
      expect(
        selectContainer.nativeElement.classList.contains('ui-select-disabled')
      ).toBeTrue();
    });
  });

  // --- Testes de Acessibilidade (Handoff Requirements) ---

  it('deve ter os atributos ARIA corretos', () => {
    const selectBox = fixture.debugElement.query(
      By.css('.ui-select-box')
    ).nativeElement;

    expect(selectBox.getAttribute('role')).toBe('combobox');
    expect(selectBox.getAttribute('aria-expanded')).toBe('false');

    component.toggleDropdown();
    fixture.detectChanges();
    expect(selectBox.getAttribute('aria-expanded')).toBe('true');
  });
});
