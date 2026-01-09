const express = require("express");
const router = express.Router();
const importController = require("../controllers/importController");

router.post("/trigger", importController.triggerAllImports);
router.get("/logs", importController.getImportLogs);

module.exports = router;
