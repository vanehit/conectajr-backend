import Visit from "../models/Visit.js";

export const registerVisit = async (req, res) => {
  try {
    const { userId } = req.body;

    if (userId) {
      const todayStart = new Date();
      todayStart.setHours(0,0,0,0);

      const existingVisit = await Visit.findOne({
        userId,
        timestamp: { $gte: todayStart }
      });

      if (existingVisit) {
        const total = await Visit.countDocuments();
        return res.json({ message: "Visita ya registrada hoy", total });
      }
    }

    const visit = new Visit({ userId });
    await visit.save();

    const total = await Visit.countDocuments();
    res.json({ message: "Visita registrada", total });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
