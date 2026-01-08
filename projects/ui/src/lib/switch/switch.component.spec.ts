import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SwitchComponent } from './switch.component';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';

@Component({
  standalone: true,
  imports: [SwitchComponent, ReactiveFormsModule],
  template: `<ui-switch [formControl]="control" label="Test Switch"></ui-switch>`
})
class TestHostComponent {
  control = new FormControl(false);
}

describe('SwitchComponent', () => {
  let component: SwitchComponent;
  let fixture: ComponentFixture<SwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SwitchComponent, FormsModule, ReactiveFormsModule, TestHostComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('deve ter o valor inicial como falso', () => {
    expect(component.value).toBeFalse();
    const input = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(input.checked).toBeFalse();
  });

  it('deve alternar o valor quando clicado', () => {
    const input = fixture.debugElement.query(By.css('input'));
    input.triggerEventHandler('change', {});
    fixture.detectChanges();

    expect(component.value).toBeTrue();
  });

  it('deve não alternar o switch quando desabilitado', () => {
    component.disabled = true;
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input'));
    input.triggerEventHandler('change', {});
    fixture.detectChanges();

    expect(component.value).toBeFalse();
  });

  it('deve renderizar o label quando fornecido', () => {
    component.label = 'Test Label';
    fixture.detectChanges();

    const label = fixture.debugElement.query(By.css('.ui-switch-label'));
    expect(label).toBeTruthy();
    expect(label.nativeElement.textContent.trim()).toBe('Test Label');
  });

  it('deve ter os atributos de acessibilidade corretos', () => {
    const input = fixture.debugElement.query(By.css('input'));
    expect(input.attributes['role']).toBe('switch');
    expect(input.attributes['aria-checked']).toBe('false');

    component.toggle();
    fixture.detectChanges();
    expect(input.attributes['aria-checked']).toBe('true');
  });

  it('deve suportar formulários reativos', () => {
    const hostFixture = TestBed.createComponent(TestHostComponent);
    const hostComponent = hostFixture.componentInstance;
    hostFixture.detectChanges();

    const switchEl = hostFixture.debugElement.query(By.directive(SwitchComponent));
    const switchInstance = switchEl.componentInstance as SwitchComponent;

    expect(switchInstance.value).toBeFalse();

    hostComponent.control.setValue(true);
    hostFixture.detectChanges();

    expect(switchInstance.value).toBeTrue();
  });
});
