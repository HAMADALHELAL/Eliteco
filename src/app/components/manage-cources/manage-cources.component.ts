import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService, Course } from '../../services/course.service';
import { AuthService, AuthUser } from '../../services/auth.service';

@Component({
  selector: 'app-manage-courses',
  standalone: true,
  templateUrl: './manage-cources.component.html',
  styleUrls: ['./manage-cources.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ManageCoursesComponent implements OnInit {
  courses: Course[] = [];
  teachers: any[] = [];
  user: AuthUser | null = null;

  // form fields
  title = '';
  description = '';
  price: number = 0;
  teacherId: string = '';

  files: { image: File | null; video: File | null } = { image: null, video: null };

  constructor(private courseService: CourseService, private auth: AuthService) {}

  ngOnInit(): void {
    // load user first
    this.auth.getProfile().subscribe({
      next: (user) => {
        this.user = user;
        if (this.isAdmin) {
          this.loadCourses();
          this.loadTeachers();
        }
      },
      error: (err) => {
        console.error('❌ Failed to load profile:', err);
      }
    });
  }

  get isAdmin(): boolean {
    return this.user?.role === 'admin';
  }

  loadCourses() {
    this.courseService.getCourses().subscribe((c) => (this.courses = c));
  }

  loadTeachers() {
    this.courseService.getTeachers().subscribe({
      next: (res) => (this.teachers = res),
      error: (err) => console.error('❌ Failed to load teachers:', err)
    });
  }

  onFileChange(event: any, type: 'image' | 'video') {
    if (event.target.files?.length > 0) {
      this.files[type] = event.target.files[0];
    }
  }

  addCourse() {
    if (!this.files.image || !this.files.video) {
      alert('Both image and video are required');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('price', this.price.toString());
    formData.append('teacherId', this.teacherId);
    formData.append('image', this.files.image);
    formData.append('video', this.files.video);

    this.courseService.addCourse(formData).subscribe({
      next: () => {
        alert('Course added!');
        this.loadCourses();
      },
      error: (err) => {
        console.error('❌ Upload failed:', err);
        alert('Failed to add course');
      },
    });
  }

  deleteCourse(id: string) {
    this.courseService.deleteCourse(id).subscribe(() => this.loadCourses());
  }
}
