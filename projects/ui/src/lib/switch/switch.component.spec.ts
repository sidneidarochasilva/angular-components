import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SwitchComponent } from './switch.component';

@Component({
  standalone: true,
  imports: [SwitchComponent, ReactiveFormsModule],
  template: `<ui-switch [formControl]="control" label="Test Switch" />`,
})
class TestHostComponent {
  control = new FormControl(false);
}

describe('SwitchComponent', () => {
  let fixture: ComponentFixture<SwitchComponent>;
  let component: SwitchComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renderiza o switch corretamente', () => {
    expect(component).toBeTruthy();
  });

  it('começa desligado por padrão', () => {
    const button = fixture.debugElement.query(
      By.css('button[role="switch"]')
    ).nativeElement;

    expect(component.value).toBeFalse();
    expect(button.getAttribute('aria-checked')).toBe('false');
  });

  it('liga o switch quando o usuário clica', () => {
    const button = fixture.debugElement.query(By.css('button[role="switch"]'));

    button.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();

    expect(component.value).toBeTrue();
  });


  it('mostra o texto do label quando informado', () => {
    component.label = 'Meu Switch';
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('.ui-switch-label'));
    expect(label?.nativeElement.textContent.trim()).toBe('Meu Switch');
  });

  it('atualiza o aria-checked ao mudar o estado', () => {
    const button = fixture.debugElement.query(
      By.css('button[role="switch"]')
    ).nativeElement;

    component.writeValue(true);
    fixture.detectChanges();

    expect(button.getAttribute('aria-checked')).toBe('true');
  });

  it('integra corretamente com FormControl', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const instance = hostFixture.debugElement.query(
      By.directive(SwitchComponent)
    ).componentInstance as SwitchComponent;

    expect(instance.value).toBeFalse();

    hostFixture.componentInstance.control.setValue(true);
    hostFixture.detectChanges();

    expect(instance.value).toBeTrue();
  });

  it('exibe o spinner quando está em loading', () => {
    component.loading = true;
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(By.css('.ui-switch-spinner'))
    ).toBeTruthy();

    expect(
      fixture.debugElement.query(By.css('.ui-switch-icon'))
    ).toBeFalsy();
  });

  it('marca como tocado ao perder o foco', () => {
    const touchedSpy = spyOn<any>(component, 'onTouched');

    fixture.debugElement
      .query(By.css('button[role="switch"]'))
      .triggerEventHandler('blur', null);

    expect(touchedSpy).toHaveBeenCalled();
  });

  it('reflete o disabled do FormControl no botão', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const button = hostFixture.debugElement.query(
      By.css('button[role="switch"]')
    ).nativeElement;

    hostFixture.componentInstance.control.disable();
    hostFixture.detectChanges();

    expect(button.disabled).toBeTrue();
  });

  it('emite o evento change ao alternar', () => {
    spyOn(component.change, 'emit');

    fixture.debugElement
      .query(By.css('button[role="switch"]'))
      .triggerEventHandler('click', new MouseEvent('click'));

    expect(component.change.emit).toHaveBeenCalledWith(true);
  });

  it('aceita writeValue mesmo com valor inesperado', () => {
    expect(() => component.writeValue(null as any)).not.toThrow();
  });

  it('expõe corretamente o estado disabled via aria', () => {
    component.disabled = true;
    fixture.detectChanges();

    const button = fixture.debugElement.query(
      By.css('button[role="switch"]')
    ).nativeElement;

    expect(
      button.getAttribute('aria-disabled') === 'true' || button.disabled
    ).toBeTrue();
  });
});
