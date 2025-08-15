import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { InMemoryScrollingFeature, InMemoryScrollingOptions, provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { tokenHandlerInterceptor } from './core/interceptors/token-handler.interceptor';
import { LOCALE_ID } from '@angular/core';
import { loaderInterceptor } from './core/interceptors/loader.interceptor';
import { errorHttpInterceptor } from './core/interceptors/error-http.interceptor';

const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled'
}

const inMemoryScrollingFeture: InMemoryScrollingFeature = withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes, inMemoryScrollingFeture), 
    provideClientHydration(), 
    provideHttpClient(withFetch(), withInterceptors([tokenHandlerInterceptor, loaderInterceptor]))
  ]
};
