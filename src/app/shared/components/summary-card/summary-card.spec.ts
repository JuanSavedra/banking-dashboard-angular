import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryCardComponent } from './summary-card';

describe('SummaryCardComponent', () => {
  let fixture: ComponentFixture<SummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummaryCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SummaryCardComponent);
  });

  it('should render financial summary data', () => {
    fixture.componentInstance.label = 'Saldo disponível';
    fixture.componentInstance.value = 'R$ 8.420,90';
    fixture.componentInstance.tone = 'positive';
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Saldo disponível');
    expect(compiled.textContent).toContain('R$ 8.420,90');
    expect(compiled.querySelector('.summary-card')?.classList).toContain('summary-card--positive');
  });
});
