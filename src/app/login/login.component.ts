import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { addIcons } from "ionicons";

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
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  constructor(private router: Router, private httpClient: HttpClient) {}

onSubmit() {
  let user = { username: this.username, password: this.password };
  this.httpClient
    .post(BACKEND_URL + '/api/auth', user, httpOptions)
    .subscribe((data: any) => {
      console.log(data)
      if (data.valid) {
        sessionStorage.setItem('current_user', data.userInfo);
        this.router.navigate(['/chat']);
      } else {
        this.errorMessage = data.message;
      }
    });
}



}
