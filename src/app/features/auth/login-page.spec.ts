import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { vi } from 'vitest';

import { login } from '../../core/store/auth/auth.actions';
import { LoginPageComponent } from './login-page';

describe('LoginPageComponent', () => {
  let fixture: ComponentFixture<LoginPageComponent>;
  let store: MockStore;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        provideMockStore({
          initialState: { auth: { session: null, loading: false, error: false } },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    store = TestBed.inject(MockStore);
  });

  it('should render credentials hint', () => {
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('ana@banking.dev');
    expect(compiled.textContent).toContain('Senha: 123456');
  });

  it('should dispatch login action on valid submit', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    fixture.detectChanges();

    const component = fixture.componentInstance as unknown as {
      form: { setValue: (v: object) => void };
      submit: () => void;
    };

    component.form.setValue({ identifier: 'ana@banking.dev', password: '123456' });
    component.submit();

    expect(dispatchSpy).toHaveBeenCalledWith(expect.objectContaining({ type: login.type }));
  });
});
