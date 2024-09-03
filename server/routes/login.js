module.exports = {
  route: (app) => {
    class User {
      constructor(username, birthday, age, email, password, valid, canCreateGroup) {
        this.username = username;
        this.birthday = birthday;
        this.age = age;
        this.email = email;
        this.password = password;
        this.valid = valid;
        this.canCreateGroup = canCreateGroup;
      }

      getUserInfo() {
        return {
          username: this.username,
          birthday: this.birthday,
          age: this.age,
          email: this.email,
          valid: this.valid,
          canCreateGroup: this.canCreateGroup,
        };
      }
    }

    const users = [
      new User("Ryota", "1987-08-18", 37, "ryota@gmail.com", "Ryota", true, true),
      new User("Kaisyu", "1995-02-05", 24, "kaisyu@gmail.com", "Kaisyu", true, false),
      new User("Natsumi","1995-04-06", 29, "natsumi@gmail.com", "Natsumi", true, true),
    ];

    app.post("/api/auth", (req, res) => {
      const { email, password } = req.body;

      // Check if both email and password are provided
      if (!email || !password) {
        return res.status(400).json({ error: "Missing email or password" });
      }

      // Find the user that matches the provided email and password
      const user = users.find(
        (user) => user.email === email && user.password === password
      );

      if (user) {
        // Convert user info to JSON string for client-side storage
        const userInfo = JSON.stringify(user.getUserInfo());

        // Send the user info back to the client (client should store it in sessionStorage)
        res.status(200).json({ valid: true, userInfo });
      } else {
        // If user is not found, return valid: false
        res.status(401).json({ valid: false, message: "Invalid credentials" });
      }
    });


    app.post("/api/create-group", (req, res) => {
      const { email, groupName } = req.body;

      // Find the user by email
      const user = users.find((user) => user.email === email);

      if (!user) {
        return res
          .status(404)
          .json({ valid: false, message: "User not found" });
      }

      if (!user.canCreateGroup) {
        return res
          .status(403)
          .json({
            valid: false,
            message: "You do not have permission to create groups",
          });
      }

      // Logic to create the group...
      res
        .status(200)
        .json({ valid: true, message: "Group created successfully" });
    });

  },
};
