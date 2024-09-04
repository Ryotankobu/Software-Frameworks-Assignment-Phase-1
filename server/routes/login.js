module.exports = {
  route: (app) => {
   class User {
     constructor(
       username,
       birthday,
       age,
       email,
       password,
       valid,
       canCreateGroup,
       groups = []
     ) {
       this.username = username;
       this.birthday = birthday;
       this.age = age;
       this.email = email;
       this.password = password;
       this.valid = valid;
       this.canCreateGroup = canCreateGroup;
       this.groups = groups;
     }
   }

   // Example users with assigned rooms
   const users = [
     new User(
       "SuperAdmin",
       "1980-01-01",
       44,
       "superadmin@example.com",
       "123",
       true,
       true,
       ["room1", "room2"]
     ),
     new User(
       "GroupAdmin",
       "1990-01-01",
       34,
       "groupadmin@example.com",
       "123",
       true,
       true,
       ["room1", "room2"]
     ),
     new User(
       "ChatUser",
       "2000-01-01",
       24,
       "chatuser@example.com",
       "123",
       true,
       false,
       ["room2", "room3"]
     ),
   ];


app.post("/api/auth", (req, res) => {
  const { username, password } = req.body;

  // Log received SuperAdmin and password
  console.log("Received login request:", username, password);

  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    console.log("User found:", user);
    res.json({
      valid: true,
      userInfo: JSON.stringify({
        username: user.username,
        birthday: user.birthday,
        age: user.age,
        email: user.email,
        password: user.password,
        valid: user.valid,
        canCreateGroup: user.canCreateGroup,
        groups: user.groups,
      }),
    });
  } else {
    console.log("Invalid login attempt:", username);
    res.status(401).json({
      valid: false,
      message: "Invalid username or password",
    });
  }
});



// backend of group creation
    app.post("/api/creategroup", (req, res) => {
      const { user, groupName } = req.body;

      if (!user.canCreateGroup) {
        return res
          .status(403)
          .json({ message: "You do not have permission to create a group." });
      }

      // Logic to create the group, add it to the user's groups, etc.
      user.groups.push(groupName);

      res
        .status(201)
        .json({
          message: `Group ${groupName} created successfully!`,
          groups: user.groups,
        });
    });



    // backend of group delete
  app.post("/api/deletegroup", (req, res) => {
    const { email, groupName } = req.body;

    const user = users.find((u) => u.email === email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.canCreateGroup) {
      return res
        .status(403)
        .json({ message: "You do not have permission to delete a group." });
    }

    const groupIndex = user.groups.indexOf(groupName);
    if (groupIndex === -1) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Remove the group from the user's groups
    user.groups.splice(groupIndex, 1);

    res.status(200).json({
      message: `Group ${groupName} deleted successfully!`,
      groups: user.groups,
    });
  });



  // room assign for a specific user
      app.post("/api/assignroom", (req, res) => {
        const { email, roomName } = req.body;

        if (!email || !roomName) {
          return res
            .status(400)
            .json({ message: "Email and room name are required" });
        }

        const user = users.find((u) => u.email === email);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        if (user.groups.includes(roomName)) {
          return res
            .status(400)
            .json({ message: "User already assigned to this room" });
        }

        // Add the room to the user's groups
        user.groups.push(roomName);

        res
          .status(200)
          .json({
            message: `Room ${roomName} assigned to user ${email} successfully`,
            groups: user.groups,
          });
          console.log("now this user belongs to", user.groups);
      });

  },
};
