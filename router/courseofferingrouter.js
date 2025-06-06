const express = require("express");
const router = express.Router();
const CourseOffering = require("../models/courseoffering");

router.get("/", async (req, res) => {
  try {
    const offerings = await CourseOffering.findAll();
    res.status(200).json(offerings);
  } catch (err) {
    console.error("query error", err);
    res.status(500).json({ err: "cannot get offerings" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const offering = await CourseOffering.findByPk(req.params.id);
    if (!offering) {
      return res.status(404).json({ err: "offering not found" });
    }
    res.status(200).json(offering);
  } catch (err) {
    console.error("query error", err);
    res.status(500).json({ err: "cannot get offering" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newOffering = await CourseOffering.create(req.body);
    res.status(201).json(newOffering);
  } catch (err) {
    console.error("query error", err);
    res.status(400).json({ err: "cannot create offering" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const offering = await CourseOffering.findByPk(req.params.id);
    if (!offering) {
      return res.status(404).json({ err: "offering not found" });
    }
    await offering.update(req.body);
    res.status(200).json(offering);
  } catch (err) {
    console.error("query error", err);
    res.status(400).json({ err: "cannot update offering" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const offering = await CourseOffering.findByPk(req.params.id);
    if (!offering) {
      return res.status(404).json({ err: "offering not found" });
    }
    await offering.destroy();
    res.status(200).json({ msg: "offering deleted" });
  } catch (err) {
    console.error("query error", err);
    res.status(400).json({ err: "cannot delete offering" });
  }
});

module.exports = router;
