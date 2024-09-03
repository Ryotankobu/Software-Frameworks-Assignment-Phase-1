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
       "password",
       true,
       true,
       ["room1", "room2"]
     ),
     new User(
       "GroupAdmin",
       "1990-01-01",
       34,
       "groupadmin@example.com",
       "password",
       true,
       true,
       ["room1", "room2"]
     ),
     new User(
       "ChatUser",
       "2000-01-01",
       24,
       "chatuser@example.com",
       "password",
       true,
       false,
       ["room2", "room3"]
     ),
   ];


app.post("/api/auth", (req, res) => {
  const { email, password } = req.body;

  // Log received email and password
  console.log("Received login request:", email, password);

  const user = users.find((u) => u.email === email && u.password === password);

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
    console.log("Invalid login attempt:", email);
    res.status(401).json({
      valid: false,
      message: "Invalid email or password",
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

  },
};
