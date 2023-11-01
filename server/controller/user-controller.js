import { postTask, User } from "../schema/user-schema.js";
import { generateToken } from "../auth/auth.js";

export const addTask = async (req, res) => {
  const task = req.body;

  const newTask = new postTask(task);

  try {
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await postTask.find();
    res.status(200).json({ tasks, message: "Data found" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getTask = async (req, res) => {
  console.log(req.params.id);
  try {
    const task = await postTask.find({ _id: req.params.id });
    res.status(200).json(task);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const editTask = async (req, res) => {
  console.log(req.body, "<<==== edit");
  const updatedtask = req.body;
  console.log(req.params.id, "<= id");
  try {
    await postTask.updateOne({ _id: req.params.id }, { $set: updatedtask });
    res.status(200).json({ message: "task updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletetask = async (req, res) => {
  try {
    await postTask.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "task updated successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message + " operation failed" });
  }
};

export const signUp = async (req, res) => {
  const { username, password, role } = req.body;

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    res.status(400).json({
      error: "Username is already taken. Please choose a different username.",
    });
  } else {
    const newUser = new User({ username, password, role });
    console.log("newUser =====>>>>> ", newUser);

    try {
      await newUser.save();
      res.status(201).json({ message: "User created successfully", newUser });
    } catch (error) {
      res.status(500).json({ error: "Error creating user" });
    }
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (user && password === user.password) {
      const token = generateToken(user);
      res
        .status(200)
        .json({ message: "Login successful", token, username, id: user._id });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
      console.error("Login faild:");
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }, { username: 1, _id: 1 });

    const formattedUsers = users.map((user) => ({
      id: user._id,
      name: user.username,
    }));

    const sortableUsers = formattedUsers.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    res.status(200).json({ sortableUsers, message: "Data found" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getDueTasks = async (req, res) => {
  try {
    const tasks = await postTask.find();

    const dueTasks = tasks.filter((task) =>
      task.taskStatus.some(
        (status) => status.username === "vaibhav" && status.status === "due"
      )
    );

    res.status(200).json({ dueTasks, message: "Data found" });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const followUser = async (req, res) => {

  const username = req.body.username;

  // Create a list of the 25 Instagram accounts to use
  const accountList = [
    {
      username: "account1_username",
      password: "account1_password"
    },
    {
      username: "account2_username",
      password: "account2_password"
    },
  ];

  // Follow the target account with 25 accounts
  for (const account of accountList) {
    await bot.login(account.username, account.password);
    await bot.follow(username);
    await bot.logout();
  }

  // Send a response to the frontend confirming that the target account has been followed
  res.send("Success!");
}
