import { CustomText } from "@/components/CustomText";
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { getAllUsersSorted } from '@/services/users';

type User = {
  userId: string,
  email: string,
  tasksCompleted: number
}

const LeaderboardScreen = () => {
  const [selectedFilter, setSelectedFilter] = useState("All Time");
  const [users, setUsers] = useState<User[]>([]);

  const filters = ["All Time", "Daily", "Weekly", "Monthly"];

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [selectedFilter]);

  const fetchUsers = async () => {
    await getAllUsersSorted()
    .then((fetchedUsers) => {
      setUsers(fetchedUsers)
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <CustomText type="title">Leaderboard</CustomText>
      </View>

      <ScrollView style={styles.contentContainer}>
        {/* Filter UI */}
        <View style={styles.filterContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter)}
            >
              <View style={[
                styles.filter,
                selectedFilter === filter
                  ? styles.filterSelected
                  : styles.filterUnselected
              ]}>
                <CustomText type="mediumTitle">{filter}</CustomText>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* User leaderboard UI */}
        {users.map((user) => (
          <View key={user.userId}>
            <View style={styles.userContainer}>
              <CustomText type="mediumTitle">
                {user.email.split("@")[0]}
              </CustomText>

              <CustomText type="mediumTitle">
                {user.tasksCompleted} tasks
              </CustomText>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  headerContainer: {
    height: 150,
    width: "100%",
    justifyContent: "flex-end",
    backgroundColor: "gray",
    paddingHorizontal: 32,
    paddingBottom: 12
  },
  contentContainer: {
    paddingHorizontal: 32,
    marginTop: 32,
    marginBottom: 96
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  filter: {
    padding: 8,
    borderRadius: 8,
  },
  filterSelected: {
    backgroundColor: "#AEAEAE"
  },
  filterUnselected: {
    backgroundColor: "#F1F1F1"
  },
  userContainer: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#D9D9D9",
  },
});

export default LeaderboardScreen;