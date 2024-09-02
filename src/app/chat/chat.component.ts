import { Component, OnInit } from '@angular/core';
import { SocketService } from '../services/socket.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule here
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  private socket: any;
  messageContent: string = ""; // Use consistent naming
  messages: string[] = [];
  rooms: any[] = [];
  roomslist: string = "";
  roomnotice: string = "";
  currentroom: string = "";
  isinRoom = false;
  newroom: string = "";
  numusers: number = 0;

  user: any;

  constructor(private socketservice: SocketService, private router: Router) { }

  ngOnInit() {
    this.socketservice.initSocket();
    this.socketservice.getMessage((m) => { this.messages.push(m) });
    this.socketservice.reqroomList();
    this.socketservice.getroomList((msg) => { this.rooms = JSON.parse(msg) });
    this.socketservice.notice((msg) => { this.roomnotice = msg });
    this.socketservice.joined((msg) => {
      this.currentroom = msg;
      this.isinRoom = this.currentroom !== "";
    });

const userData = sessionStorage.getItem('current_user');
    if (userData) {
      this.user = JSON.parse(userData);
    } else {
      window.location.href = '/login';
    }
    
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

  createroom() {
    console.log(this.newroom);
    this.socketservice.createroom(this.newroom);
    this.socketservice.reqroomList();
    this.newroom = "";
  }

  chat() {
    if (this.messageContent) {
      this.socketservice.sendMessage(this.messageContent);
      this.messageContent = ""; // Reset to an empty string
    } else {
      console.log('No Message');
    }
  }

   backLogin(){
    this.router.navigate(['/login']);

  }
}
