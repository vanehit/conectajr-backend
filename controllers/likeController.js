import Like from "../models/Like.js";

export const toggleLike = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Auth required" });
    }

    const { contentId } = req.params;

    const existing = await Like.findOne({
      user: req.user._id,
      content: contentId
    });

    if (existing) {
      await existing.deleteOne();
      return res.json({ liked: false });
    }

    await Like.create({
      user: req.user._id,
      content: contentId
    });

    res.json({ liked: true });

  } catch (error) {
    res.status(500).json({ error: "Error toggling like" });
  }
};
