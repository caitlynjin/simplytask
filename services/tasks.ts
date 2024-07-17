import {
  doc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export class Task {
  id: string;
  completed: boolean;
  description: string;
  name: string;

  constructor(
    id: string,
    completed: boolean,
    description: string,
    name: string
  ) {
    this.id = id;
    this.completed = completed;
    this.description = description;
    this.name = name;
  }
}

export const createTask = async (
  userId: string,
  name: string,
  description: string
) => {
  try {
    const userRef = doc(db, "users", userId);
    const tasksRef = collection(userRef, "tasks");
    addDoc(tasksRef, {
      completed: false,
      description: description,
      name: name,
    })
    .then((taskRef) => {
      updateDoc(taskRef, {
        id: taskRef.id
      });
    });
  } catch (error) {
    console.error("Error creating task", error);
  }
};

export const getAllTasks = async (userId: string) => {
  try {
    const userTasksRef = collection(db, "users", userId, "tasks");
    const userTasksSnap = await getDocs(userTasksRef);
    const tasks = userTasksSnap.docs.map((taskDoc) =>
      new Task(
        taskDoc.get("id"),
        taskDoc.get("completed"),
        taskDoc.get("description"),
        taskDoc.get("name")
      )
    );
    return tasks;
  } catch (error) {
    console.error("Error getting all tasks", error);
  }
};

export const updateTask = async (
  userId: string,
  task: Task,
  completed?: boolean,
  description?: string,
  name?: string
) => {
  try {
    const taskRef = doc(db, "users", userId, "tasks", task.id);
    updateDoc(taskRef, {
      completed: completed !== undefined ? completed : task.completed,
      description: description ? description : task.description,
      name: name ? name : task.name,
    });
  } catch (error) {
    console.error("Error updating task", error);
  }
};

export const deleteTask = async (userId: string, task: Task) => {
  try {
    const taskRef = doc(db, "users", userId, "tasks", task.id);
    deleteDoc(taskRef);
  } catch (error) {
    console.error("Error updating task", error);
  }
}