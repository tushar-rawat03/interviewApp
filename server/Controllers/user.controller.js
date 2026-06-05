import User from "../Models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId; // ✅ req not res
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user does not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `failed to get current User ${error}` });
  }
};
