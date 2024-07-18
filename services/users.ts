import {
  setDoc,
  doc,
  collection,
  getDocs
} from 'firebase/firestore';
import { db } from '@/firebaseConfig';

/**
 * The model for a user
 */
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
};

/**
 * Create and store this user in Firebase database
 * @param userId The id of this user
 * @param email The email of this user
 */
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

/**
 * Fetches all completed tasks of this user in this time period from Firebase
 * database
 * @param userId The id of this user
 * @param timePeriod The time period to get completed tasks from (Daily, Weekly,
 *                   Monthly, or defaulted to All Time)
 * @returns The list of completed tasks in this time period
 */
export const getCompletedTasksFilteredBy = async (
  userId: string,
  timePeriod: string
) => {
  try {
    const tasksRef = collection(db, "users", userId, "tasks");
    const tasksSnap = await getDocs(tasksRef);
    const tasks = tasksSnap.docs.map((taskDoc) => taskDoc.data());

    const today = new Date();

    switch (timePeriod) {
      case "Daily":
        const dailyCompletedTasks = tasks.filter((task) => {
          const date = task.completedAt.toDate();
          return (
            task.completed
            && date.getFullYear() === today.getFullYear()
            && date.getMonth() === today.getMonth()
            && date.getDate() === today.getDate()
          );
        });
        return dailyCompletedTasks;
      case "Weekly":
        const startOfWeek = today.getDate() - today.getDay();
        const endOfWeek = startOfWeek + 6;

        const weeklyCompletedTasks = tasks.filter((task) => {
          const date = task.completedAt.toDate();
          return (
            task.completed
            && date.getFullYear() === today.getFullYear()
            && date.getMonth() === today.getMonth()
            && date.getDate() >= startOfWeek && date.getDate() <= endOfWeek
          );
        });
        return weeklyCompletedTasks;
      case "Monthly":
        const monthlyCompletedTasks = tasks.filter((task) => {
          const date = task.completedAt.toDate();
          return (
            task.completed
            && date.getFullYear() === today.getFullYear()
            && date.getMonth() === today.getMonth()
          );
        });
        return monthlyCompletedTasks;
      default:
        const completedTasks = tasks.filter((task) => task.completed);
        return completedTasks;
    }
  } catch (_) {
    // In the case that user has not created a task
    return [];
  }
};

/**
 * Fetches all users and creates user objects with the number of completed tasks
 * in this time period from Firebase database
 * database
 * @param timePeriod The time period to get completed tasks from (Daily, Weekly,
 *                   Monthly, or defaulted to All Time)
 * @returns The list of user objects with completed task amounts within this time
 *          period
 */
export const getAllUsersFilteredBy = async(timePeriod: string) => {
  try {
    // Get the list of users and amount of tasks completed
    const usersRef = collection(db, "users");
    const usersSnap = await getDocs(usersRef);
    const usersPromise = usersSnap.docs.map(async (userDoc) => {
      const taskCount = (await getCompletedTasksFilteredBy(
        userDoc.id,
        timePeriod
      )).length;
      return (new User(userDoc.id, userDoc.get("email"), taskCount));
    });
    const users = await Promise.all(usersPromise);

    // Sort the list of users by their tasks completed in descending order
    const usersSorted = users.sort((user1, user2) => {
      return user2.tasksCompleted - user1.tasksCompleted;
    });
    return usersSorted;
  } catch (_) {
    // In the case that user has not created a task
    return [];
  }
};