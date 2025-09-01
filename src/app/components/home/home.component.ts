import { Component, Inject, OnInit } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CourseService, Course } from '../../services/course.service';

@Component({
  standalone: true,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [CommonModule, RouterModule, TranslateModule]
})
export class HomeComponent implements OnInit {
  currentLang: string = 'en';
  courses: Course[] = [];

  constructor(
    private translate: TranslateService,
    private courseService: CourseService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.translate.addLangs(['en', 'ar']);
    this.translate.setDefaultLang('en');
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const savedLang = localStorage.getItem('lang') || this.translate.getBrowserLang() || 'en';
      this.switchLang(savedLang);

      this.translate.onLangChange.subscribe((event) => {
        this.currentLang = event.lang;
      });

      this.currentLang = this.translate.currentLang || 'en';
    } else {
      this.currentLang = this.translate.getDefaultLang() || 'en';
    }

    // ✅ load courses from `courses` collection
    this.loadCourses();
  }

  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (courses) => {
        this.courses = courses;
        console.log('✅ Loaded courses:', this.courses);
      },
      error: (err) => {
        console.error('❌ Failed to fetch courses:', err);
      }
    });
  }

  switchLang(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;

    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.lang = lang;
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
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
