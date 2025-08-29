import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  isAuthed = false;

  constructor(
    private route: ActivatedRoute,
    private translate: TranslateService,
    private auth: AuthService,              // 👈 inject
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    // language setup
    this.route.fragment.subscribe((fragment) => {
      if (fragment && isPlatformBrowser(this.platformId)) {
        const el = document.getElementById(fragment);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    });

    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('lang') || this.translate.getBrowserLang() || 'en';
      this.switchLang(savedLang);
    }

    // ✅ subscribe to auth state
    this.auth.isAuthed$.subscribe((authed) => {
      this.isAuthed = authed;
    });
  }

  switchLang(lang: string): void {
    this.translate.use(lang);
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      localStorage.setItem('lang', lang);
    }
  }
}
