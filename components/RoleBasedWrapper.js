import React from "react";
import { View } from "react-native";
import { getRoleName } from "../utils/roleHelper";

export default function RoleBasedWrapper({ role, children }) {
  if (!role) return null;

  const roleName = getRoleName(role);

  return <View>{children}</View>; // Can add conditional rendering per role if needed
}
