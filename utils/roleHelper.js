export const getRoleName = (roleId) => {
  switch (roleId) {
    case "student":
      return "Student";
    case "teacher":
      return "Teacher";
    case "parent":
      return "Parent";
    default:
      return "Unknown";
  }
};
