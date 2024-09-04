**3813ICT Software Frameworks Assignment Phase 1 (Ryota Ando / s5298111)**
*   **Repository Url:** https://github.com/Ryotankobu/Software-Frameworks-Assignment-Phase-1.git

</br>
</br>

</br>

**Table of Contents:**

- [Description of Git Repository](#description-of-git-repository)
  - [Repository Structures](#repository-structures)
  - [How I used it](#how-i-used-it)
- [Description of Data Structures](#description-of-data-structures)
  - [Server-Side Data Structures](#server-side-data-structures)
  - [Client-Side Data Structures](#client-side-data-structures)
- [Angular Architecture](#angular-architecture)
  - [Components](#components)
  - [Services](#services)
  - [Models](#models)
  - [Routes](#routes)
- [Node Server Architecture](#node-server-architecture)
  - [Modules](#modules)
  - [Files](#files)
  - [Global Variables](#global-variables)
- [List of Server-Side Routes](#list-of-server-side-routes)
- [Client-Server Interaction](#client-server-interaction)
  - [Login Process](#login-process)
  - [Group/Room Management](#group-room-management)
  - [Real-Time Updates](#real-time-updates)
        

## Description of Git Repository
### Repository Structure
**Remote Repository**
*   **master branch**: Used to maintain the latest version of the code.
*   **ryota_edit**: Created because I had the same name for a local branch, though I was unsure of the necessity of keeping it in the remote repository.

**Local Repository**
*   **master branch**: Used to keep the latest version of the local code by pulling updates from the remote master branch and pushing the latest local version of the code to remote. It has also been utilized to identify any conflicts between local branches.
*   **ryota_edit**: Used for code editing, as well as for comparing the latest code with the edited code.


### How I used it
As a practice, I always pull the latest remote code into my local master branch for version control. Then, I switch to my local editing branch (ryota_edit) to make changes. After editing, I merge it into my local master branch to check for any conflicts, even though there were no conflicts since I was the only person working on this project. I followed this by pushing my local master branch to the remote master for version control.

## Description of Data Structures:

### Server-Side Data Structures:

User Class: The User class represents a user in the system with the following attributes:

*   **username**: The user's name.
    
*   **birthday**: The user's date of birth.
    
*   **age**: The user's age.
    
*   **email**: The user's email, used as the unique identifier.
    
*   **password**: The user's password.
    
*   **valid**: A boolean indicating whether the user's account is valid.
    
*   **canCreateGroup**: A boolean indicating whether the user has permission to create groups (or rooms).
    
*   **groups**: An array of strings representing the groups (or rooms) the user is assigned to.
    

**Users Array:** An array that stores instances of the User class. Each user object contains all the necessary information about a user, including their assigned groups.



### Client-Side Data Structures:

User Model: On the client side, the user's information is stored as an object with similar attributes as the server-side User class. This includes:

*   username
    
*   email
    
*   canCreateGroup
    
*   groups
    
*   password
    
*   age
    
*   valid
    

These properties are stored in the sessionStorage after login and are used throughout the application to determine user permissions and groups.

**Room/Group List:** Rooms or groups are stored as arrays of strings representing the names of the rooms that a user can join. This is dynamically updated based on the user’s actions (e.g., creating, deleting, or being assigned to a room).

## Angular Architecture:

### Components:

**LoginComponent:**

*   **Purpose:** Manages user authentication.
    
*   **Template File:** login.component.html
    
*   **Class File:** login.component.ts
    
*   **Key Functions:**
    
    *   Handles user login, form validation, and communication with the server to authenticate the user.
        
    *   Stores authenticated user data in sessionStorage.
        

**ChatComponent:**

*   **Purpose:** Manages chat functionality, room creation, room deletion, and real-time communication.
    
*   **Template File:** chat.component.html
    
*   **Class File:** chat.component.ts
    
*   **Key Functions:**
    
    *   Allows users to join, leave, create, and delete rooms.
        
    *   Provides real-time chat functionality through integration with the Socket.io server.
        
    *   Assigns rooms to users by group admins.
        

### Services:

**SocketService:**

*   **Purpose:** Handles all interactions between the Angular application and the Socket.io server.
    
*   **File:** socket.service.ts
    
*   **Key Functions:**
    
    *   **initSocket():** Initializes the socket connection to the server.
        
    *   **sendMessage():** Sends chat messages to the server.
        
    *   **joinroom():** Sends a request to join a specified room.
        
    *   **leaveroom():** Sends a request to leave a room.
        
    *   **createroom():** Sends a request to create a new room.
        
    *   **deleteGroup():** Sends a request to delete a room.
        
    *   **assignRoom():** Sends a request to assign a room to a user.
        

### Models:

**User Model:** Represents the user data structure used throughout the application.

### Routes:

*   **/login:** Displays the LoginComponent for user authentication.
    
*   **/chat:** Displays the ChatComponent for managing chat and room functionalities.
    

## Node Server Architecture:

### Modules:

**Express.js:**

*   **Purpose:** Handles HTTP requests and responses, serves the API routes for user authentication and room management.
    
*   **File:** server.js
    
*   **Key Functions:**
    
    *   Manages routes like /api/auth, /api/creategroup, /api/deletegroup, and /api/assignroom.
        
    *   Handles middleware and basic server setup.
        

**Socket.io:**

*   **Purpose:** Manages real-time communication between the client and the server.
    
*   **File:** socket.js
    
*   **Key Functions:**
    
    *   Listens to events like message, joinRoom, leaveRoom, newroom, and handles real-time interactions like sending and receiving messages or updating user rooms.
        

### Files:

**server.js:** The main entry point for the server, handling route definitions and middleware configurations.

*   Configures and sets up the Express server.
    

**socket.js:** Manages real-time communication with clients using Socket.io.

*   Listens for and emits events related to chat, rooms, and user activities.
    

**login.js:** Handles user login by validating credentials and returning appropriate responses.

*   Updates user sessions and manages user state on the server.
    

**listen.js:** Starts the server and listens on a specified port.

*   Links to the server.js file to initiate the server setup.
    

### Global Variables:

*   **users array:** Stores the list of all users and their associated data, including the rooms they belong to.
    

## List of Server-Side Routes:

### /api/auth:

*   ***Parameters:*** email, password
    
*   ***Return Value:***
    
    *   **On success:** { valid: true, userInfo: { user details... } }
        
    *   **On failure:** { valid: false, message: "Invalid email or password" }
        
*   **Purpose:** Authenticates a user based on their email and password. Returns user details on successful authentication.
    

### /api/creategroup:

*   **Parameters:** user (from session), groupName
    
*   **Return Value:** { message: "Group created successfully", groups: \[...\] }
    
*   **Purpose:** Allows users with the canCreateGroup privilege to create a new group (or room).
    

### /api/deletegroup:

*   **Parameters:** email, groupName
    
*   **Return Value:** { message: "Group deleted successfully", groups: \[...\] }
    
*   **Purpose:** Allows users with the canCreateGroup privilege to delete an existing group (or room).
    

### /api/assignroom:

*   **Parameters:** email, roomName
    
*   **Return Value:** { message: "Room assigned to user successfully", groups: \[...\] }
    
*   **Purpose:** Allows users with the canCreateGroup privilege to assign a room to another user.
    

## Client-Server Interaction:

### Login Process:

*   **Client Action:** User enters username and password in LoginComponent.
    
*   **Server Response:**
    
    *   If successful: Server returns user details, which are stored in sessionStorage on the client.
        
    *   If unsuccessful: Server returns an error message which is displayed to the user.
        

### Group/Room Management:

**Create Room:**

*   **Client Action:** User with canCreateGroup privilege creates a room via ChatComponent.
    
*   **Server Response:** The server adds the room to the user’s group list and returns the updated list. The client updates the displayed list of rooms.
    

**Delete Room:**

*   **Client Action:** User with canCreateGroup privilege deletes a room via ChatComponent.
    
*   **Server Response:** The server removes the room from the user’s group list and returns the updated list. The client removes the room from the displayed list.
    

**Assign Room:**

*   **Client Action:** User with canCreateGroup privilege assigns a room to another user via ChatComponent.
    
*   **Server Response:** The server adds the room to the specified user’s group list and returns a success message. The client can then update the displayed list of rooms for that user.
    

### Real-Time Updates:

**Messaging:**

*   **Client Action:** User sends a message via the chat interface.
    
*   **Server Response:** The server broadcasts the message to all users in the room.
    
*   **Client Update:** The chat interface updates to display the new message in real-time.
    

**Room Joining/Leaving:**

*   **Client Action:** User joins or leaves a room via the chat interface.
    
*   **Server Response:** The server updates the room’s user list and broadcasts the update.
    
*   **Client Update:** The interface reflects the current room state, including the number of users in the room.