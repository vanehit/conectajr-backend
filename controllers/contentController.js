import mongoose from "mongoose";
import Content from "../models/Content.js";

export const getContents = async (req, res) => {
  try {
    const now = new Date();
    const userId = req.user?._id
      ? new mongoose.Types.ObjectId(req.user._id)
      : null;

    const contents = await Content.aggregate([
      { $match: { published: true } },

      { $sort: { order: 1 } },

      // 🔥 Join con likes
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "content",
          as: "likesData"
        }
      },

      // 🔢 Conteo total de likes
      {
        $addFields: {
          likes: { $size: "$likesData" }
        }
      },

      // ❤️ Saber si el usuario actual dio like
      {
        $addFields: {
          liked: userId
            ? {
                $gt: [
                  {
                    $size: {
                      $filter: {
                        input: "$likesData",
                        as: "like",
                        cond: { $eq: ["$$like.user", userId] }
                      }
                    }
                  },
                  0
                ]
              }
            : false
        }
      },

      {
        $project: {
          likesData: 0
        }
      }
    ]);

    // 🔐 Lógica de acceso (fuera del pipeline porque depende de req.user)
    const formatted = contents.map((content) => {
      const isPremiumActive =
        req.user &&
        req.user.premiumUntil &&
        req.user.premiumUntil > now;

      const hasAccess =
        content.accessLevel === "free" ||
        (content.accessLevel === "premium" && isPremiumActive) ||
        (content.accessLevel === "pro" && req.user?.tier === "pro");

      return {
        ...content,
        locked: !hasAccess
      };
    });

    res.json(formatted);

  } catch (error) {
    res.status(500).json({ error: "Error obteniendo contenido" });
  }
};