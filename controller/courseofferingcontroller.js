const { CourseOffering } = require("../models");

exports.getAll = async (req, res) => {
  try {
    const offerings = await CourseOffering.findAll();
    res.json(offerings);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.getById = async (req, res) => {
  try {
    const offering = await CourseOffering.findByPk(req.params.id);
    if (!offering) return res.status(404).json({ error: "Not found" });
    res.json(offering);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.create = async (req, res) => {
  try {
    const newOffering = await CourseOffering.create(req.body);
    res.status(201).json(newOffering);
  } catch (err) {
    res.status(400).json({ error: "Bad request" });
  }
};

exports.update = async (req, res) => {
  try {
    const offering = await CourseOffering.findByPk(req.params.id);
    if (!offering) return res.status(404).json({ error: "Not found" });

    await offering.update({
      courseName: req.body.courseName ?? offering.courseName,
      teacherName: req.body.teacherName ?? offering.teacherName,
      semester: req.body.semester ?? offering.semester,
      capacity: req.body.capacity ?? offering.capacity,
      enrolledCount: req.body.enrolledCount ?? offering.enrolledCount,
      location: req.body.location ?? offering.location,
      schedule: req.body.schedule ?? offering.schedule,
      status: req.body.status ?? offering.status,
      updatedBy: req.body.updatedBy ?? offering.updatedBy,
    });

    res.json(offering);
  } catch (err) {
    console.error("Update error:", err);
    res.status(400).json({ error: "Bad request" });
  }
};

exports.remove = async (req, res) => {
  try {
    const offering = await CourseOffering.findByPk(req.params.id);
    if (!offering) return res.status(404).json({ error: "Not found" });
    await offering.destroy();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
