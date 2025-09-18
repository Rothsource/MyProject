import { userUpdate } from "./request";
import { checkPhoneNumber, validatePassword, validateUsername } from "./Signup";

export async function checkUpdate(userName, userPassword, userPic, userPhone) {
  try {
    const updates = {};

    if (userName) {
      const validName = await validateUsername(userName);
      if (!validName.success) return validName; // early return with error
      updates.name = userName;
    }

    if (userPassword) {
      const validPassword = await validatePassword(userPassword);
      if (!validPassword.success) return validPassword;
      updates.password = userPassword;
    }

    if (userPhone) {
      const validPhone = await checkPhoneNumber(userPhone);
      if (!validPhone.success) return validPhone;
      updates.phone = userPhone;
    }

    if (userPic) {
      updates.picUrl = userPic;
    }

    if (Object.keys(updates).length === 0) {
      return { success: false, message: "No fields to update" };
    }

    // Send request
    const response = await userUpdate(updates);
    return response;
  } catch (error) {
    console.error("Update check error:", error);
    return { success: false, message: "Failed to update user" };
  }
}
