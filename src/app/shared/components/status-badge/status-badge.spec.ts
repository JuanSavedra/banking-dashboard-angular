import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusBadgeComponent } from './status-badge';

describe('StatusBadgeComponent', () => {
  let fixture: ComponentFixture<StatusBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusBadgeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(StatusBadgeComponent);
  });

  it('should render label and variant class', () => {
    fixture.componentInstance.label = 'Ativo';
    fixture.componentInstance.variant = 'success';
    fixture.detectChanges();

    const badge = fixture.nativeElement.querySelector('.status-badge') as HTMLElement;

    expect(badge.textContent).toContain('Ativo');
    expect(badge.classList).toContain('status-badge--success');
  });
});
