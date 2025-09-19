import cloudinary from "../config/cloudinary.js";
import { Feedback } from "../model/Index.js";

async function uploadFile(file) {
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: "MyApp/FeedBack_File",
    });
    console.log("File URL: ", result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.log("Upload error: ", error);
    throw error;
  }
}

export const writeFeedBack = async (req, res) => {
  try {
    const { text, url, file} = req.body;

    if(file){
      console.log("File reach Backend");
    }else{
      console.log("File Not");
    }
    const userid = req.user.sub; 
    let fileUrl = null;
    if (file) {
      fileUrl = await uploadFile(file);
    }

    const feedback = await Feedback.create({
      User_Id: userid,          
      User_Text: text || null,  
      Input_Url: url || null,   
      Input_FileUrl: fileUrl || null,   
    });

    return res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      data: feedback,
    });
  } catch (error) {
    console.error("Error writing feedback:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit feedback",
      error: error.message,
    });
  }
};
