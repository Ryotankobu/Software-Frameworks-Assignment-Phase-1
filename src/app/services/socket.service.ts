import { Injectable } from '@angular/core';
import io from 'socket.io-client';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const SERVER_URL = 'http://localhost:3000/chat';
const BACKEND_URL = 'http://localhost:3000';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: any;

  constructor(private http: HttpClient) { }

  initSocket(): void {
    this.socket = io(SERVER_URL);
  }

  joinroom(selroom: string): void {
    console.log('Joining room:', selroom);
    this.socket.emit("joinRoom", selroom);
  }

  leaveroom(selroom: string): void {
    this.socket.emit("leaveRoom", selroom);
  }

  joined(next: (res: any) => void): void {
    this.socket.on('joined', (res: any) => next(res));
  }

  createroom(newroom: string): void {
    console.log('Creating room:', newroom);
    this.socket.emit('newroom', newroom);
  }

  deleteGroup(data: any) {
    return this.http.post(`${BACKEND_URL}/api/deletegroup`, data, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }


  reqnumbers(selroom: string): void {
    this.socket.emit("numbers", selroom);
  }

  getnumusers(next: (res: any) => void): void {
    this.socket.on('numbers', (res: any) => next(res));
  }

  reqroomList(): void {
    console.log('Requesting room list');
    this.socket.emit('roomlist', 'list please');
  }

  getroomList(next: (res: any) => void): void {
    this.socket.on('roomlist', (res: any) => {
      console.log('Received room list:', res);
      next(res);
    });
  }

  notice(next: (res: any) => void): void {
    this.socket.on('notice', (res: any) => next(res));
  }

  sendMessage(message: string): void {
    this.socket.emit('message', message);
  }

  getMessage(next: (message: any) => void): void {
    this.socket.on('message', (message: any) => next(message));
  }

assignRoom(requestBody: any) {
  return this.http.post(`${BACKEND_URL}/api/assignroom`, requestBody, httpOptions);
}

}
