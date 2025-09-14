import { userInfo } from "./Account/request";

const defaultName = "Guest";
const defaultPhone = "+855";
const defaultPic = "https://res.cloudinary.com/dif1rbrhk/image/upload/v1757832105/images_nusy9z.png";

export async function usersInfo() {
  try {
    const data = await userInfo();
    const user = data?.user || {};

    const proPic = user.picUrl || defaultPic; 
    const proName = user.name || defaultName;
    const proPhone = user.phone_number || defaultPhone;

    return {
      pic_url: proPic,
      name: proName,
      phone_number: proPhone,
    };
  } catch (error) {
    console.error("Error getting user info:", error);

    return {
      pic_url: defaultPic,
      name: defaultName,
      phone_number: defaultPhone,
    };
  }
}
