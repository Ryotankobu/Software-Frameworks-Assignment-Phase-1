// module.exports = {
//   connect: function (io, PORT) {
//     var rooms = ["room1", "room2", "room3", "room4"];
//     var socketRoom = [];
//     var socketRoomnum = [];

//     const chat = io.of("/chat");

//     chat.on("connection", (socket) => {
//       socket.on("message", (message) => {
//         for (let i = 0; i < socketRoom.length; i++) {
//           if (socketRoom[i][0] == socket.id) {
//             chat.to(socketRoom[i][1]).emit("message", message);
//           }
//         }
//       });

//       socket.on("newroom", (newroom) => {
//         if (rooms.indexOf(newroom) == -1) {
//           rooms.push(newroom);
//           chat.emit("roomlist", JSON.stringify(rooms));
//         }
//       });

//       socket.on("numbers", (room) => {
//         var usercount = 0;
//         for (let i = 0; i < socketRoomnum.length; i++) {
//           if (socketRoomnum[i][0] == room) {
//             usercount = socketRoomnum[i][1];
//           }
//         }
//         chat.in(room).emit("numbers", usercount);
//       });

//       socket.on("joinRoom", (room) => {
//         if (rooms.includes(room)) {
//           socket.join(room, () => {
//             var inroomSocketarray = false;
//             for (let i = 0; i < socketRoom.length; i++) {
//               if (socketRoom[i][0] == socket.id) {
//                 socketRoom[i][1] = room;
//                 inroomSocketarray = true;
//               }
//             }

//             if (inroomSocketarray == false) {
//               socketRoom.push([socket.id, room]);
//               var hasroomnum = false;
//               for (let j = 0; j < socketRoomnum.length; j++) {
//                 if (socketRoomnum[j][0] == room) {
//                   socketRoomnum[j][1] += 1;
//                   hasroomnum = true;
//                 }
//               }

//               if (hasroomnum == false) {
//                 socketRoomnum.push([room, 1]);
//               }
//             }

//             chat.in(room).emit("notice", "A new user has joined");
//           });
//           chat.in(room).emit("joined", room);
//         }
//       });

//       // Leave a room
//       socket.on("leaveRoom", (room) => {
//         for (let i = 0; i < socketRoom.length; i++) {
//           if (socketRoom[i][0] == socket.id) {
//             socketRoom.splice(i, 1);
//             socket.leave(room);
//             chat.to(room).emit("notice", "A user has left");
//           }
//         }

//         for (let j = 0; j < socketRoomnum.length; j++) {
//           if (socketRoomnum[j][0] == room) {
//             socketRoomnum[j][1] -= 1;
//             if (socketRoomnum[j][1] == 0) {
//               socketRoomnum.splice(j, 1);
//             }
//           }
//         }
//       });

//       socket.on("disconnect", () => {
//         chat.emit("disconnect");
//         for (let i = 0; i < socketRoom.length; i++) {
//           if (socketRoom[i][0] == socket.id) {
//             socketRoom.splice(i, 1);
//           }
//         }
//         for (let j = 0; j < socketRoomnum.length; j++) {
//           if (socketRoomnum[j][0] == socket.room) {
//             socketRoomnum[j][1] -= 1;
//           }
//         }
//         console.log("Client disconnected");
//       });
//     });
//   },
// };



module.exports = function (io) {
  const chat = io.of("/chat");
  const rooms = ["room1", "room2", "room3", "room4"];
  const socketRoom = [];
  const socketRoomnum = [];

  chat.on("connection", (socket) => {
    console.log("New user connected");

    // Handle user joining a room
    socket.on("joinRoom", (room) => {
      if (rooms.includes(room)) {
        socket.join(room);
        console.log(`${socket.id} joined room: ${room}`);

        // Track the socket and the room it's in
        socketRoom.push([socket.id, room]);

        // Track the number of users in the room
        let hasRoom = false;
        for (let i = 0; i < socketRoomnum.length; i++) {
          if (socketRoomnum[i][0] === room) {
            socketRoomnum[i][1]++;
            hasRoom = true;
            break;
          }
        }
        if (!hasRoom) {
          socketRoomnum.push([room, 1]);
        }

        // Notify users in the room
        chat.in(room).emit("notice", "A new user has joined");
        chat.in(room).emit("joined", room);
      }
    });

    // Handle user leaving a room
    socket.on("leaveRoom", (room) => {
      socket.leave(room);
      console.log(`${socket.id} left room: ${room}`);

      // Update the room tracking data
      for (let i = 0; i < socketRoom.length; i++) {
        if (socketRoom[i][0] === socket.id) {
          socketRoom.splice(i, 1);
          break;
        }
      }

      for (let i = 0; i < socketRoomnum.length; i++) {
        if (socketRoomnum[i][0] === room) {
          socketRoomnum[i][1]--;
          if (socketRoomnum[i][1] === 0) {
            socketRoomnum.splice(i, 1);
          }
          break;
        }
      }

      chat.in(room).emit("notice", "A user has left");
    });

    // Handle new message
    socket.on("message", (message) => {
      let userRoom = socketRoom.find(([id, room]) => id === socket.id);
      if (userRoom) {
        chat.to(userRoom[1]).emit("message", message);
      }
    });

    // Handle room creation
    socket.on("newroom", (newroom) => {
      console.log("New room creation request:", newroom);
      if (!rooms.includes(newroom)) {
        rooms.push(newroom);
        chat.emit("roomlist", JSON.stringify(rooms));
      }
    });

    // Send the list of rooms
    socket.on("roomlist", () => {
      socket.emit("roomlist", JSON.stringify(rooms));
    });

    // Send the number of users in a room
    socket.on("numbers", (room) => {
      let roomData = socketRoomnum.find(([r]) => r === room);
      if (roomData) {
        chat.in(room).emit("numbers", roomData[1]);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("Client disconnected");
      for (let i = 0; i < socketRoom.length; i++) {
        if (socketRoom[i][0] === socket.id) {
          socketRoom.splice(i, 1);
          break;
        }
      }
    });
  });
};
