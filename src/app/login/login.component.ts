import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};
const BACKEND_URL = 'http://localhost:3000';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  constructor(private router: Router, private httpClient: HttpClient) {}
  onSubmit() {
    let user = { email: this.email, password: this.password };
    this.httpClient
      .post(BACKEND_URL + '/api/auth', user, httpOptions)
      .subscribe((data: any) => {
        console.log(JSON.stringify(user));
        console.log(JSON.stringify(data));
        if (data.valid) {
          sessionStorage.setItem('current_user', data.userInfo);
          console.log(data.userInfo);
          this.router.navigate(['/chat']);
        } else {
          this.errorMessage = data.errorMessage;
          console.log(this.errorMessage);
        }
      });
  }
}
