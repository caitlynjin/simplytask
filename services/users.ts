import {
  setDoc,
  doc,
  collection,
  getDocs
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';

export class User {
  userId: string;
  email: string;
  tasksCompleted: number;

  constructor(
    userId: string,
    email: string,
    tasksCompleted: number
  ) {
    this.userId = userId;
    this.email = email;
    this.tasksCompleted = tasksCompleted;
  }
}

export const createUser = async (userId: string, email: string) => {
  try {
    const userRef = doc(db, "users", userId)
    await setDoc(userRef, {
      email: email,
      userId: userId
    });
  } catch (error) {
    console.error("Error creating user", error);
  }
};

export const getCompletedTasks = async (userId: string) => {
  try {
    const tasksRef = collection(db, "users", userId, "tasks");
    const tasksSnap = await getDocs(tasksRef);
    const tasks = tasksSnap.docs.map((taskDoc) => taskDoc.data());

    const completedTasks = tasks.filter((task) => task.completed);
    return completedTasks;
  } catch (error) {
    console.log("Error getting all completed tasks of user", userId, error);
    return [];
  }
}

export const getAllUsersSorted = async () => {
  try {
    // Get the list of users and the amount of tasks completed
    const usersRef = collection(db, "users");
    const usersSnap = await getDocs(usersRef);
    const users = usersSnap.docs.map(async (userDoc) => {
      const taskCount = (await getCompletedTasks(userDoc.id)).length;
      return (
        new User(
          userDoc.id,
          userDoc.get("email"),
          taskCount
        )
      );
    });
    const usersWithTasks = await Promise.all(users);

    // Sort the list of users by their tasks completed in descending order
    const usersSorted = usersWithTasks.sort((user1, user2) => {
      return user2.tasksCompleted - user1.tasksCompleted;
    });
    return usersSorted;
  } catch (error) {
    console.log("Error getting all users sorted by number of completions", error);
    return [];
  }
}