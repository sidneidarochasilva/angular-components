import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectComponent, SelectOption } from './select.component';

@Component({
  standalone: true,
  imports: [SelectComponent, ReactiveFormsModule],
  template: `
    <ui-select
      label="Seleção"
      placeholder="Escolha uma opção"
      [options]="options"
      [required]="true"
      [formControl]="control"
    />
  `,
})
class TestHostComponent {
  control = new FormControl<string | null>(null);
  options: SelectOption[] = [
    { value: '1', label: 'Opção 1' },
    { value: '2', label: 'Opção 2' },
  ];
}

describe('SelectComponent', () => {
  let fixture: ComponentFixture<SelectComponent>;
  let component: SelectComponent;

  const optionsBase: SelectOption[] = [
    { value: 'val1', label: 'Texto 1' },
    { value: 'val2', label: 'Texto 2' },
    { value: 'val3', label: 'Texto 3 (desabilitado)', disabled: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    component.options = optionsBase;
    component.label = 'Rótulo do Select';
    component.placeholder = 'Selecione uma opção';
    fixture.detectChanges();
  });

  it('cria o componente', () => {
    expect(component).toBeTruthy();
  });

  it('renderiza o label quando informado', () => {
    const labelEl = fixture.debugElement.query(By.css('.ui-select-label'));
    expect(labelEl).toBeTruthy();
    expect(labelEl.nativeElement.textContent).toContain('Rótulo do Select');
  });

  it('mostra o placeholder como primeira opção desabilitada', () => {
    const selectEl = fixture.debugElement.query(
      By.css('select.ui-select-native')
    ).nativeElement as HTMLSelectElement;

    expect(selectEl.options.length).toBeGreaterThan(0);
    expect(selectEl.options[0].value).toBe('');
    expect(selectEl.options[0].disabled).toBeTrue();
    expect(selectEl.options[0].textContent?.trim()).toBe('Selecione uma opção');
  });

  it('mantém value como null quando nada foi escolhido', () => {
    expect(component.value).toBeNull();
  });

  it('renderiza as opções e respeita itens desabilitados', () => {
    const selectEl = fixture.debugElement.query(
      By.css('select.ui-select-native')
    ).nativeElement as HTMLSelectElement;

    const values = Array.from(selectEl.options).map((o) => o.value);
    expect(values).toContain('val1');
    expect(values).toContain('val2');
    expect(values).toContain('val3');

    const disabledOption = Array.from(selectEl.options).find(
      (o) => o.value === 'val3'
    );
    expect(disabledOption).toBeTruthy();
    expect(disabledOption?.disabled).toBeTrue();
  });

  it('atualiza o valor interno e emite evento quando o usuário seleciona', () => {
    spyOn(component.change, 'emit');

    const selectEl = fixture.debugElement.query(
      By.css('select.ui-select-native')
    ).nativeElement as HTMLSelectElement;

    selectEl.value = 'val2';
    selectEl.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(component.value).toBe('val2');
    expect(component.change.emit).toHaveBeenCalledWith('val2');
  });

  it('marca como tocado ao perder o foco', () => {
    const touchedSpy = jasmine.createSpy('touched');
    component.registerOnTouched(touchedSpy);
    fixture.detectChanges();

    const selectEl = fixture.debugElement.query(
      By.css('select.ui-select-native')
    ).nativeElement as HTMLSelectElement;

    selectEl.dispatchEvent(new Event('blur'));
    expect(touchedSpy).toHaveBeenCalled();
  });

  it('desabilita o select nativo quando [disabled] é true', () => {
    component.disabled = true;
    fixture.detectChanges();

    const selectEl = fixture.debugElement.query(
      By.css('select.ui-select-native')
    ).nativeElement as HTMLSelectElement;

    expect(selectEl.disabled).toBeTrue();
  });

  it('aplica classe de erro no wrapper quando [error] é true', () => {
    component.error = true;
    fixture.detectChanges();

    const box = fixture.debugElement.query(By.css('.ui-select-box'))
      .nativeElement as HTMLElement;
    expect(box.classList).toContain('ui-select-error');
  });

  it('expõe atributos ARIA básicos coerentes', () => {

    component.error = true;
    fixture.detectChanges();

    const selectEl = fixture.debugElement.query(
      By.css('select.ui-select-native')
    ).nativeElement as HTMLSelectElement;

    expect(selectEl.getAttribute('aria-invalid')).toBe('true');
    expect(selectEl.getAttribute('aria-labelledby')).toContain('ui-select-');
  });

  describe('Integração com Reactive Forms', () => {
    let hostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(() => {
      hostFixture = TestBed.createComponent(TestHostComponent);
      hostFixture.detectChanges();
    });

    it('reflete o valor do FormControl no componente', () => {
      hostFixture.componentInstance.control.setValue('2');
      hostFixture.detectChanges();

      const selectCmp = hostFixture.debugElement.query(
        By.directive(SelectComponent)
      ).componentInstance as SelectComponent;

      expect(selectCmp.value).toBe('2');
    });

    it('propaga a seleção do usuário para o FormControl', () => {
      const selectEl = hostFixture.debugElement.query(
        By.css('select.ui-select-native')
      ).nativeElement as HTMLSelectElement;

      selectEl.value = '1';
      selectEl.dispatchEvent(new Event('change'));
      hostFixture.detectChanges();

      expect(hostFixture.componentInstance.control.value).toBe('1');
    });

    it('respeita o disabled vindo do FormControl', () => {
      hostFixture.componentInstance.control.disable();
      hostFixture.detectChanges();

      const selectEl = hostFixture.debugElement.query(
        By.css('select.ui-select-native')
      ).nativeElement as HTMLSelectElement;

      expect(selectEl.disabled).toBeTrue();
    });
  });
});
