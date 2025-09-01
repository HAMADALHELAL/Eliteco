import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourseService, Course } from '../../services/course.service';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  course: Course | null = null;

  constructor(private route: ActivatedRoute, private courseService: CourseService) {}

  ngOnInit(): void {
    const courseId = this.route.snapshot.paramMap.get('id');
    if (courseId) {
      this.courseService.getCourseById(courseId).subscribe({
        next: (c) => (this.course = c),
        error: (err) => console.error('❌ Failed to load course:', err)
      });
    }
  }
}
