import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService, Course } from '../../services/course.service';

@Component({
  selector: 'app-manage-courses',
  standalone: true,
  templateUrl: './manage-cources.component.html',
  styleUrls: ['./manage-cources.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ManageCoursesComponent implements OnInit {
  courses: Course[] = [];

  // form fields
  title = '';
  description = '';
  price: number = 0;
  teacherId: string = '';

  // hold files separately
  files: { image: File | null; video: File | null } = {
    image: null,
    video: null,
  };

  teachers: any[] = []; // you’ll fill this with API call later

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
    this.loadTeachers();

    // TODO: fetch teachers if you have an endpoint for them
  }

  loadCourses() {
    this.courseService.getCourses().subscribe((c) => (this.courses = c));
  }

  // handle file input changes
  onFileChange(event: any, type: 'image' | 'video') {
    if (event.target.files && event.target.files.length > 0) {
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
    formData.append('image', this.files.image, this.files.image.name);  // 👈 image
    formData.append('video', this.files.video, this.files.video.name);  // 👈 video
  
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
    this.courseService.deleteCourse(id).subscribe(() => {
      this.loadCourses();
    });
  }
  loadTeachers() {
    this.courseService.getTeachers().subscribe({
      next: (res) => {
        this.teachers = res;
      },
      error: (err) => {
        console.error('❌ Failed to load teachers:', err);
      }
    });
  }  
}
