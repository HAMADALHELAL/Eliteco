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

  // ✅ new fields
  numberOfVideos: number = 0;
  videoFiles: File[] = [];
  files: { image: File | null } = { image: null };

  constructor(private courseService: CourseService, private auth: AuthService) {}

  ngOnInit(): void {
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
      },
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
      error: (err) => console.error('❌ Failed to load teachers:', err),
    });
  }

  // ✅ Handle image or specific video file upload
  onFileChange(event: any, type: 'image' | 'video', index?: number) {
    if (event.target.files?.length > 0) {
      if (type === 'image') {
        this.files.image = event.target.files[0];
      } else if (type === 'video' && index !== undefined) {
        this.videoFiles[index] = event.target.files[0];
      }
    }
  }

  // ✅ Main upload logic
  addCourse() {
    if (!this.files.image) {
      alert('Course image is required');
      return;
    }

    const filledVideos = this.videoFiles.filter((v) => v);
    if (this.numberOfVideos > 0 && filledVideos.length < this.numberOfVideos) {
      alert(`Please upload all ${this.numberOfVideos} videos`);
      return;
    }

    const formData = new FormData();
    formData.append('title', this.title);
    formData.append('description', this.description);
    formData.append('price', this.price.toString());
    formData.append('teacherId', this.teacherId);
    formData.append('image', this.files.image);

    filledVideos.forEach((file) => formData.append('videos', file));

    this.courseService.addCourse(formData).subscribe({
      next: () => {
        alert('✅ Course added successfully!');
        this.loadCourses();
        this.resetForm();
      },
      error: (err) => {
        console.error('❌ Upload failed:', err);
        alert('Failed to add course');
      },
    });
  }

  resetForm() {
    this.title = '';
    this.description = '';
    this.price = 0;
    this.teacherId = '';
    this.numberOfVideos = 0;
    this.videoFiles = [];
    this.files.image = null;
  }

  deleteCourse(id: string) {
    this.courseService.deleteCourse(id).subscribe(() => this.loadCourses());
  }
}
