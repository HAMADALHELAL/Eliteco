import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

export function HttpLoaderFactory(http: HttpClient) {
  let baseHref = '/';
  if (typeof document !== 'undefined') {
    baseHref = document.getElementsByTagName('base')[0]?.href || '/';
  }

  return new TranslateHttpLoader(http, `${baseHref}assets/i18n/`, '.json');
}
