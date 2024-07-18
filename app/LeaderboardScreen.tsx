import { CustomText } from "@/components/CustomText";
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl
} from "react-native";
import { User, getAllUsersFilteredBy } from '@/services/users';
import { LeaderboardProp } from "./_layout";

const LeaderboardScreen = ({ navigation }: LeaderboardProp) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All Time");
  const [users, setUsers] = useState<User[]>([]);

  const filters = ["All Time", "Daily", "Weekly", "Monthly"];

  /* Refreshes users list when selecting another filter */
  useEffect(() => {
    fetchUsers();
  }, [selectedFilter]);

  /* Fetches all user objects filtered by the selected filter */
  const fetchUsers = async () => {
    await getAllUsersFilteredBy(selectedFilter)
    .then((fetchedUsers) => {
      setUsers(fetchedUsers)
    });
  };

  /* Refreshes the page */
  const onRefresh = () => {
    setRefreshing(true);
    fetchUsers()
      .then(() => setRefreshing(false));
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <CustomText type="title">Leaderboard</CustomText>
      </View>

      <ScrollView
        style={styles.contentContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Filter buttons */}
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

        {/* List of users on leaderboard */}
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