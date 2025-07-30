import { Component, Inject, OnInit } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, RouterModule,TranslateModule]
})export class HomeComponent implements OnInit {
  currentLang: string = 'en';

  constructor(
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('lang') || this.translate.getBrowserLang() || 'en';
      this.switchLang(savedLang);
    }

    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });

    this.currentLang = this.translate.currentLang || 'en';
  }

  switchLang(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;

    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('lang', lang);
    }
  }

  scrollLeft(id: string): void {
    const container = document.getElementById(id);
    if (container) container.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight(id: string): void {
    const container = document.getElementById(id);
    if (container) container.scrollBy({ left: 300, behavior: 'smooth' });
  }
}
