import messageModel from "../models/messageModel.js";

// create message
export const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  try {
    const message = new messageModel({ chatId, senderId, text });
    await message.save();
    return res.status(200).json({
      msg: "Message created successfully",
      success: true,
      data: message,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message, success: false });
  }
};

// get message
export const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await messageModel.find({ chatId });
    return res.status(200).json({
      msg: "Get messages successfully",
      success: true,
      data: messages,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message, success: false });
  }
};
