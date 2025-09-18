import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { isOffline } from "../utils/offlineHelper";

export default function OfflineNotice() {
  const [offline, setOffline] = useState(isOffline());

  useEffect(() => {
    const interval = setInterval(() => setOffline(isOffline()), 3000);
    return () => clearInterval(interval);
  }, []);

  if (!offline) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>You are currently offline. Some features may be limited.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#f44336", padding: 10, alignItems: "center" },
  text: { color: "#fff" },
});
