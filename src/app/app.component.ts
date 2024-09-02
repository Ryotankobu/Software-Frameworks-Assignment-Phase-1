import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat/chat.component'; 
import { LoginComponent } from './login/login.component'; 
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ChatComponent, LoginComponent, RouterModule], 
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 

})
export class AppComponent {
  constructor(private router: Router) {}

  logout() {
    // Clear session storage
    sessionStorage.clear();

    // Redirect to the login page
    this.router.navigate(['/login']);
  }
}