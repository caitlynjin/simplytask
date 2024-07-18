import {
  doc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';

/**
 * The model for a task
 */
export class Task {
  id: string;
  completed: boolean;
  completedAt: Timestamp;
  description: string;
  name: string;

  constructor(
    id: string,
    completed: boolean,
    completedAt: Timestamp,
    description: string,
    name: string
  ) {
    this.id = id;
    this.completed = completed;
    this.completedAt = completedAt;
    this.description = description;
    this.name = name;
  }
}

/**
 * Create and store this task under this user in Firebase database
 * @param userId The id of this user
 * @param name The name of this task
 * @param description The description of this task
 */
export const createTask = async (
  userId: string,
  name: string,
  description: string
) => {
  try {
    const userRef = doc(db, "users", userId);
    const tasksRef = collection(userRef, "tasks");
    await addDoc(tasksRef, {
      completed: false,
      completedAt: null,
      description: description,
      name: name,
    })
    .then(async (taskRef) => {
      await updateDoc(taskRef, {
        id: taskRef.id
      });
    });
  } catch (error) {
    console.error("Error creating task", error);
  }
};

/**
 * Fetches all tasks of this user from Firebase database
 * @param userId The id of this user
 * @returns The list of task objects
 */
export const getAllTasks = async (userId: string) => {
  try {
    const userTasksRef = collection(db, "users", userId, "tasks");
    const userTasksSnap = await getDocs(userTasksRef);
    const tasks = userTasksSnap.docs.map((taskDoc) =>
      new Task(
        taskDoc.get("id"),
        taskDoc.get("completed"),
        taskDoc.get("completedAt"),
        taskDoc.get("description"),
        taskDoc.get("name")
      )
    );
    return tasks;
  } catch (error) {
    console.error("Error getting all tasks", error);
  }
};

/**
 * Updates the existing task of this user in Firebase database
 * @param userId The id of this user
 * @param task The existing task object to update
 * @param completed The new completed state of this task
 * @param description The new description of this task
 * @param name The new name of this task
 */
export const updateTask = async (
  userId: string,
  task: Task,
  completed?: boolean,
  description?: string,
  name?: string
) => {
  try {
    const taskRef = doc(db, "users", userId, "tasks", task.id);
    await updateDoc(taskRef, {
      completed: completed !== undefined ? completed : task.completed,
      description: description ? description : task.description,
      name: name ? name : task.name,
    });
  } catch (error) {
    console.error("Error updating task", error);
  }
};

/**
 * Sets the task of this user as complete or incomplete in Firebase database
 * @param userId The id of this user
 * @param task The task to update
 * @param completed The new completed state of this task
 */
export const completeTask = async (
  userId: string,
  task: Task,
  completed: boolean
) => {
  try {
    const taskRef = doc(db, "users", userId, "tasks", task.id);
    await updateDoc(taskRef, {
      completed: completed,
      completedAt: completed ? new Date() : null
    });
  } catch (error) {
    console.error("Error completing task", error);
  }
}

/**
 * Deletes the task of this user in Firebase database
 * @param userId The id of this user
 * @param task The task to delete
 */
export const deleteTask = async (userId: string, task: Task) => {
  try {
    const taskRef = doc(db, "users", userId, "tasks", task.id);
    await deleteDoc(taskRef);
  } catch (error) {
    console.error("Error updating task", error);
  }
}