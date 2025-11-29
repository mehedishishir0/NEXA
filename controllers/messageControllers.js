import cloudinary from "../lib/cloduinary.js";
import Message from "../models/messageModel.js";
import User from "../models/userModel.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;


    const filterUsers = await User.find({ _id: { $ne: userId } })
      .select("-password");

    const unseenMessages = {};

    const promises = filterUsers.map(async (user) => {
      const messages = await Message.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });

      if (messages.length > 0) {
        unseenMessages[user._id] = messages.length;
      }
    });

    await Promise.all(promises);

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: filterUsers,
      unseenMessages,
    });

  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: error.message });
  }
};

export const getMessage = async (req,res) => {
    try {
       const {id} = req.params;
       const myId = req.user._id;

       const messages = await Message.find({
        $or:[
            {senderId:id,receiverId:myId},
            {senderId:myId,receiverId:id}
        ]
       })
      await Message.updateMany({senderId:id,receiverId:myId},{seen:true})
      res.json({success:true,message:"Messages fetched successfully",data:messages})
    } catch (error) {
        console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

export const markMessageAsSeen = async (req,res) => {
    try {
        const {id} = req.params;

        await Message.findByIdAndUpdate(id,{seen:true});
        res.json({success:true,message:"Message marked as seen successfully"})
    } catch (error) {
         console.log(error.message);
        return res.json({ success: false, message: error.message });
    }
}

export const sendMessage = async (req,res) => {
  try {
    const {text} = req.body;
    const image = req.file?.path;
    const receiverId = req.params.id;
    const senderId = req.user._id;

    let imageUrl;
    if(image){
      const upload = await cloudinary.uploader.upload(image);
      imageUrl = upload.secure_url;
    }

  } catch (error) {
      console.log(error.message);
      return res.json({ success: false, message: error.message });
  }
}