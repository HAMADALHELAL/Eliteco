// admin.component.ts
import { Component } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
  imports: [FormsModule, CommonModule],
})
export class AdminComponent {
  email: string = "";
  emailExists: boolean = false;
  teacher: any = null;
  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  checkEmail() {
    if (!this.email) {
      this.emailExists = false;
      this.teacher = null;
      return;
    }

    this.http
      .get<any>(`/api/auth/check-email?email=${this.email}`)
      .subscribe((res) => {
        this.emailExists = res.exists;
        this.teacher = res.user || null;
      });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onSubmit() {
    if (!this.selectedFile || !this.teacher) return;

    const formData = new FormData();
    formData.append("media", this.selectedFile);
    formData.append("teacherUsername", this.teacher.username);

    this.http.post("/media/upload-for-teacher", formData).subscribe(
      (res) => alert("Upload successful!"),
      (err) => alert("Upload failed!")
    );
  }
}
