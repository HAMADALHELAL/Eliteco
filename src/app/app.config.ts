import { ApplicationConfig, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";
import { routes } from "./app.routes";

import {
  HttpClient,
  HttpClientModule,
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { provideAnimations } from "@angular/platform-browser/animations";
import { provideClientHydration } from "@angular/platform-browser";

import { environment } from "../environments/environments";
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { HttpLoaderFactory } from "./shared/translation/translate-loader";

/* === ADDED IMPORTS (keep everything else as-is) === */
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./auth.interceptor";
/* === END ADDED IMPORTS === */

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        defaultLanguage: "en",
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
    provideClientHydration(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),

    /* === ADDED PROVIDER (register JWT interceptor) === */
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    /* === END ADDED PROVIDER === */
  ],
};
