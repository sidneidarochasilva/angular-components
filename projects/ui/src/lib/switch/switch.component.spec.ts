import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SwitchComponent } from './switch.component';

@Component({
  standalone: true,
  imports: [SwitchComponent, ReactiveFormsModule],
  template: `
    <ui-switch
      [formControl]="control"
      label="Test Switch"
    />
  `,
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

  it('cria o componente sem erros', () => {
    expect(component).toBeTruthy();
  });

  it('inicia desmarcado e reflete isso no input', () => {
    const input = fixture.debugElement.query(By.css('input')).nativeElement;

    expect(component.value).toBeFalse();
    expect(input.checked).toBeFalse();
  });

  it('altera o valor ao interagir com o switch', () => {
    const input = fixture.debugElement.query(By.css('input'));
    const event = { stopPropagation: jasmine.createSpy() };

    input.triggerEventHandler('change', event);
    fixture.detectChanges();

    expect(component.value).toBeTrue();
    expect(event.stopPropagation).toHaveBeenCalled();
  });

  it('não muda o estado quando está desabilitado', () => {
    component.disabled = true;

    fixture.debugElement
      .query(By.css('input'))
      .triggerEventHandler('change', new Event('change'));

    fixture.detectChanges();
    expect(component.value).toBeFalse();
  });

  it('renderiza o label apenas quando informado', () => {
    component.label = 'Meu Switch';
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('.ui-switch-label'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.textContent.trim()).toBe('Meu Switch');
  });

  it('mantém aria-checked sincronizado com o valor interno', () => {
    const input = fixture.debugElement.query(By.css('input'));

    expect(input.attributes['aria-checked']).toBe('false');

    component.handleToggle(new Event('change'));
    fixture.detectChanges();

    expect(input.attributes['aria-checked']).toBe('true');
  });

  it('funciona corretamente com formulários reativos', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    hostFixture.detectChanges();

    const switchInstance = hostFixture.debugElement
      .query(By.directive(SwitchComponent))
      .componentInstance as SwitchComponent;

    expect(switchInstance.value).toBeFalse();

    hostFixture.componentInstance.control.setValue(true);
    hostFixture.detectChanges();

    expect(switchInstance.value).toBeTrue();
  });
});
