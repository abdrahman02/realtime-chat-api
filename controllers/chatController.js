import chatModel from "../models/chatModel.js";

// create chat
export const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;
  try {
    const chat = await chatModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    if (chat)
      return res
        .status(200)
        .json({ msg: "Chat already exists", success: true, data: chat });

    const newChat = new chatModel({ members: [firstId, secondId] });
    await newChat.save();
    return res
      .status(200)
      .json({ msg: "Chat created successfully", success: true, data: newChat });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message, success: false });
  }
};

// find user chats
export const findUserChats = async (req, res) => {
  const { userId } = req.params;

  try {
    const chats = await chatModel.find({
      members: { $in: [userId] },
    });

    if (!chats)
      return res.status(400).json({ msg: "Chats not found", success: false });

    return res
      .status(200)
      .json({ msg: "Chats found successfully", success: true, data: chats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message, success: false });
  }
};

// find chat
export const findChat = async (req, res) => {
  const { firstId, secondId } = req.params;

  try {
    const chats = await chatModel.find({
      members: { $all: [firstId, secondId] },
    });

    if (!chats)
      return res.status(400).json({ msg: "Chats not found", success: false });

    return res
      .status(200)
      .json({ msg: "Chats found successfully", success: true, data: chats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: error.message, success: false });
  }
};
