import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  private socket: any;
  messageContent: string = "";
  messages: string[] = [];
  rooms: any[] = [];
  roomslist: string = "";
  roomnotice: string = "";
  currentroom: string = "";
  isinRoom = false;
  newroom: string = "";
  numusers: number = 0;
  canCreateGroup: boolean = false; 
  user: any;

  constructor(private socketservice: SocketService, private router: Router) {}

  ngOnInit() {
    const currentUserData = sessionStorage.getItem('current_user');
    if (currentUserData) {
      const currentUser = JSON.parse(currentUserData);
      this.canCreateGroup = currentUser.canCreateGroup;
      this.user = currentUser;
    } else {
      console.error('No current user found in session storage');
      this.router.navigate(['/login']);
      return; // Exit the function to prevent further execution
    }

    this.socketservice.initSocket();
    this.socketservice.getMessage((m) => { this.messages.push(m) });
    this.socketservice.reqroomList();
    this.socketservice.getroomList((msg) => { this.rooms = JSON.parse(msg) });
    this.socketservice.notice((msg) => { this.roomnotice = msg });
    this.socketservice.joined((msg) => {
      this.currentroom = msg;
      this.isinRoom = this.currentroom !== "";
    });
  }

  joinroom() {
    this.socketservice.joinroom(this.roomslist);
    this.socketservice.reqnumbers(this.roomslist);
    this.socketservice.getnumusers((res) => { this.numusers = res });
  }

  clearnotice() {
    this.roomnotice = "";
  }

  leaveroom() {
    this.socketservice.leaveroom(this.currentroom);
    this.socketservice.reqnumbers(this.currentroom);
    this.socketservice.getnumusers((res) => { this.numusers = res });
    this.currentroom = "";
    this.isinRoom = false;
    this.numusers = 0;
    this.roomnotice = "";
    this.messages = [];
  }

  chat() {
    if (this.messageContent) {
      this.socketservice.sendMessage(this.messageContent);
      this.messageContent = ""; // Reset to an empty string
    } else {
      console.log('No Message');
    }
  }

  createroom() {
    if (!this.canCreateGroup) {
      console.log('You do not have permission to create a group.');
      return;
    }

    console.log(this.newroom);
    this.socketservice.createroom(this.newroom);
    this.socketservice.reqroomList();
    this.newroom = "";
  }

  backLogin() {
    this.router.navigate(['/login']);
  }
}
