import express from "express";
import {
  addTask,
  getTasks,
  getTask,
  editTask,
  deletetask,
  signUp,
  login,
  getUsers,
  getDueTasks,
  followUser,
} from "../controller/user-controller.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Namaste Bharat!");
});

router.get("/getTasks/:id", getTasks);
router.get("/getUsers", getUsers);
router.get("/:id", getTask);
router.get("/getDueTasks/:id", getDueTasks);

router.post("/add", addTask);

router.put("/:id", editTask);
router.delete("/:id", deletetask);

router.post("/signup", signUp);
router.post("/login", login);
router.post("/follow",followUser)

export default router;
