// src/app/services/course.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

export interface Course {
  _id: string;
  title: string;
  description?: string;
  price: number;
  teacher: { username: string; email: string };
  media: {
    imageUrl?: string;
    videos?: {
      url: string;
      cloudinaryPublicId: string;
    }[];
    videoUrl?: string; // ✅ keep for backward compatibility
    cloudinaryPublicId?: string;
  };
}



@Injectable({ providedIn: 'root' })
export class CourseService {
  private http = inject(HttpClient);
  private base = `${environment.apiBase}/courses`;

  // ✅ Public – fetch all courses from `courses` collection
  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(this.base);
  }

  // ✅ Protected – add course
  addCourse(data: FormData): Observable<Course> {
    return this.http.post<Course>(this.base, data);
  }

  // ✅ Protected – delete course
  deleteCourse(courseId: string): Observable<any> {
    return this.http.delete(`${this.base}/${courseId}`);
  }

  // ✅ Protected – student subscribe
  subscribeCourse(courseId: string): Observable<any> {
    return this.http.post(`${this.base}/subscribe/${courseId}`, {});
  }

  getTeachers(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiBase}/users/teachers`);
  }
  getCourseById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.base}/${id}`);
  }
  
}
