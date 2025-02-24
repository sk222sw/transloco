import { fakeAsync, tick } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TranslocoLocaleService } from '../transloco-locale.service';
import { LANG_LOCALE_MOCK, DEFAULT_LOCALE_MOCK } from './mocks';

describe('TranslocoLocaleService', () => {
  let service: TranslocoLocaleService;

  describe('getLocale', () => {
    it('should return the default locale', () => {
      const translocoService: any = {
        langChanges$: of()
      };
      service = new TranslocoLocaleService(translocoService, LANG_LOCALE_MOCK, DEFAULT_LOCALE_MOCK);
      expect(service.getLocale()).toEqual('en-US');
    });

    it('should return the current locale', () => {
      const translocoService: any = {
        langChanges$: of('en-US')
      };
      service = new TranslocoLocaleService(translocoService, LANG_LOCALE_MOCK, DEFAULT_LOCALE_MOCK);
      expect(service.getLocale()).toEqual('en-US');
    });

    it('should return the default locale', () => {
      const translocoService: any = {
        langChanges$: of('en')
      };
      service = new TranslocoLocaleService(translocoService, LANG_LOCALE_MOCK, DEFAULT_LOCALE_MOCK);
      expect(service.getLocale()).toEqual('en-US');
    });

    it('should not update a none locale format', () => {
      const translocoService: any = {
        langChanges$: of('fr')
      };
      service = new TranslocoLocaleService(translocoService, LANG_LOCALE_MOCK, DEFAULT_LOCALE_MOCK);
      expect(service.getLocale()).toEqual('en-US');
    });
  });

  describe('setLocale', () => {
    beforeEach(() => {
      const translocoService: any = {
        langChanges$: of('en')
      };
      service = new TranslocoLocaleService(translocoService, LANG_LOCALE_MOCK, DEFAULT_LOCALE_MOCK);
    });

    it('should set a given locale', () => {
      service.setLocale('es-ES');
      expect(service.getLocale()).toEqual('es-ES');
    });

    it('should throw error when receive wrong locale format', () => {
      spyOn(console, 'error');
      service.setLocale('en');
      service.setLocale('En-us');
      service.setLocale('en-Us');
      service.setLocale('en-us');
      expect(console.error).toHaveBeenCalledTimes(4);
    });
  });

  describe('localeChanges$', () => {
    it('should call subscription on locale change', () => {
      const translocoService: any = {
        langChanges$: of('en-US')
      };
      const spy = jasmine.createSpy();
      service = new TranslocoLocaleService(translocoService, LANG_LOCALE_MOCK, DEFAULT_LOCALE_MOCK);
      service.localeChanges$.subscribe(spy);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('en-US');
    });

    it('should call subscription with the default language locale', () => {
      const translocoService: any = {
        langChanges$: of('en')
      };
      const spy = jasmine.createSpy();
      service = new TranslocoLocaleService(translocoService, LANG_LOCALE_MOCK, DEFAULT_LOCALE_MOCK);
      service.localeChanges$.subscribe(spy);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith('en-US');
    });

    it('should call subscription after lang change', fakeAsync(() => {
      const translocoService: any = {
        langChanges$: of('en', 'es').pipe(delay(100))
      };
      const spy = jasmine.createSpy();
      service = new TranslocoLocaleService(translocoService, LANG_LOCALE_MOCK, DEFAULT_LOCALE_MOCK);
      service.localeChanges$.subscribe(spy);
      tick(100);
      expect(spy).toHaveBeenCalledTimes(2);
    }));

    it('should call subscription after setting locale', () => {
      const translocoService: any = {
        langChanges$: of()
      };
      const spy = jasmine.createSpy();
      service = new TranslocoLocaleService(translocoService, LANG_LOCALE_MOCK, DEFAULT_LOCALE_MOCK);
      service.localeChanges$.subscribe(spy);
      service.setLocale('en-US');
      expect(spy).toHaveBeenCalledWith('en-US');
    });
  });
});
