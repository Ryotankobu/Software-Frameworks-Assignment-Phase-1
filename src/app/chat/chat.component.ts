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

  // For assigning rooms
  targetUserEmail: string = "";
  roomToAssign: string = "";

  constructor(private socketservice: SocketService, private router: Router) { }

ngOnInit() {
  const currentUserData = sessionStorage.getItem('current_user');
  if (currentUserData) {
    this.user = JSON.parse(currentUserData);
    this.canCreateGroup = this.user.canCreateGroup;

    // Log the user's groups to verify they are correctly retrieved
    console.log('User groups after login:', this.user.groups);
  } else {
    console.error('No current user found in session storage');
    this.router.navigate(['/login']);
    return; // Early exit to prevent further execution
  }

  this.socketservice.initSocket();
  this.setupSocketListeners();
}

setupSocketListeners() {
  this.socketservice.getMessage((m) => { this.messages.push(m); });

  this.socketservice.reqroomList();
  this.socketservice.getroomList((msg) => {
    console.log('All rooms received from server:', msg);
    console.log('User groups:', this.user.groups);
    this.rooms = JSON.parse(msg).filter((room: string) => this.user.groups.includes(room));
    console.log('Filtered rooms for the user:', this.rooms);
  });

  this.socketservice.notice((msg) => { this.roomnotice = msg; });
  this.socketservice.joined((msg) => {
    this.currentroom = msg;
    this.isinRoom = this.currentroom !== "";
  });
}



  // joinroom() {
  //   if (this.roomslist && this.user.groups.includes(this.roomslist)) {
  //     this.socketservice.joinroom(this.roomslist);
  //     this.socketservice.reqnumbers(this.roomslist);
  //     this.socketservice.getnumusers((res) => { this.numusers = res; });
  //   } else {
  //     console.error("You do not have access to this room.");
  //     this.roomnotice = "Access Denied: You do not have access to this room.";
  //   }
  // }
  joinroom() {
  if (!this.roomslist) {
    console.error("No room selected.");
    this.roomnotice = "Please select a room to join.";
    return;
  }

  if (this.user.groups.includes(this.roomslist)) {
    this.socketservice.joinroom(this.roomslist);
    this.socketservice.reqnumbers(this.roomslist);
    this.socketservice.getnumusers((res) => {
      this.numusers = res;
    });
    this.roomnotice = ""; // Clear any previous notices if the room is joined successfully
  } else {
    console.error("You do not have access to this room.");
    this.roomnotice = "Access Denied: You do not have access to this room.";
  }
}


  clearnotice() {
    this.roomnotice = "";
  }

  leaveroom() {
    this.socketservice.leaveroom(this.currentroom);
    this.socketservice.reqnumbers(this.currentroom);
    this.socketservice.getnumusers((res) => { this.numusers = res; });
    this.currentroom = "";
    this.isinRoom = false;
    this.numusers = 0;
    this.roomnotice = "";
    this.messages = [];
  }

  createroom() {
    if (!this.canCreateGroup) {
      console.log('You do not have permission to create a group.');
      this.roomnotice = "You do not have permission to create a group.";
      return;
    }

    const groupName = this.newroom.trim();
    if (groupName) {
      this.socketservice.createroom(groupName);
      this.socketservice.reqroomList();
      this.newroom = "";
    } else {
      console.error('Room name cannot be empty.');
      this.roomnotice = "Room name cannot be empty.";
    }
  }

deleteGroup(groupName: string) {
  const currentUserData = sessionStorage.getItem('current_user');
  if (currentUserData) {
    const user = JSON.parse(currentUserData);
    const requestBody = { email: user.email, groupName: groupName };

    this.socketservice.deleteGroup(requestBody).subscribe(
      (response) => {
        console.log('Group deleted successfully:', response);
        this.rooms = this.rooms.filter(room => room !== groupName); // Remove the deleted group from the displayed list
      },
      (error) => {
        console.error('Error deleting group:', error);
      }
    );
  } else {
    console.error('No current user found in session storage');
  }
}



  chat() {
    if (this.messageContent) {
      this.socketservice.sendMessage(this.messageContent);
      this.messageContent = "";
    } else {
      console.log('No Message');
    }
  }

  backLogin() {
    this.router.navigate(['/login']);
  }

assignRoomToUser() {
  const currentUserData = sessionStorage.getItem('current_user');
  if (currentUserData) {
    const user = JSON.parse(currentUserData);
    const requestBody = {
      email: this.targetUserEmail.trim(),  
      roomName: this.roomToAssign.trim(),  
    };

    if (!requestBody.email || !requestBody.roomName) {
      console.error('Email or room name is missing.');
      this.roomnotice = 'Please provide both email and room name.';
      return;
    }

    this.socketservice.assignRoom(requestBody).subscribe(
      (response) => {
        console.log('Room assigned successfully:', response);
        this.roomnotice = `Room ${requestBody.roomName} assigned to ${requestBody.email}.`;
      },
      (error) => {
        console.error('Error assigning room:', error);
        this.roomnotice = 'Failed to assign room. Please try again.';
      }
    );
  } else {
    console.error('No current user found in session storage');
    this.roomnotice = 'Session expired. Please log in again.';
  }
}


}
