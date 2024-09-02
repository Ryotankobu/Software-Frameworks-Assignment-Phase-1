module.exports = {
  route: (app) => {
    class User {
      constructor(username, birthday, age, email, password, valid) {
        this.username = username;
        this.birthday = birthday;
        this.age = age;
        this.email = email;
        this.password = password;
        this.valid = valid;
      }

      getUserInfo() {
        return {
          username: this.username,
          birthday: this.birthday,
          age: this.age,
          email: this.email,
          valid: this.valid,
        };
      }
    }

    const users = [
      new User("Ryota", "1987-08-18", 37, "ryota@gmail.com", "Ryota", true),
      new User("Jam", "2000-08-30", 24, "jam@icloud.com", "Jam", true),
      new User(
        "Nakajima",
        "1975-04-05",
        55,
        "Nakajima@icloud.com",
        "Nakajima",
        true
      ),
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
  },
};
