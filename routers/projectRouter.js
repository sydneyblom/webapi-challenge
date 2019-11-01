//import express
const express = require("express");
const router = express.Router();

//importing needed db
const projectDB = require("../data/helpers/projectModel.js");

router.post("/", validateProjectInfo, (req, res) => {
  const { name, description } = req.body;
  projectDB
    .insert({ name, description })
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json({ message: "Error inserting project" });
    });
});

router.get("/:id", validateProjectId, (req, res) => {
  projectDB
    .get(req.params.id)
    .then(project => {
      res.status(200).json(project);
    })
    .catch(error => {
      console.log("get error", error);
      res
        .status(500)
        .json({
          error: "There was an error retrieving the project from the database."
        });
    });
});

router.put("/:id", validateProjectId, validateProjectInfo, (req, res) => {
  projectDB
    .update(req.params.id, req.body)
    .then(updatedProject => {
      res.status(200).json(updatedProject);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: "Error updating project."
      });
    });
});

router.delete("/:id", validateProjectId, (req, res) => {
  projectDB
    .remove(req.params.id)
    .then(resp => res.sendStatus(204))
    .catch(resp => res.sendStatus(500));
});

//middleware
function validateProjectId(req, res, next) {
  projectDB.get(req.params.id).then(project => {
    if (project) {
      next();
    } else {
      res
        .status(404)
        .json({ message: "A project with that id does not exist." });
    }
  });
}

function validateProjectInfo(req, res, next) {
  const projectObject = req.body;
  const projectName = projectObject.name;
  const description = projectObject.description;

  if (!projectObject) {
    res.status(400).json({ message: "Missing project data." });
  } else if (!projectName) {
    res.status(400).json({ message: "Missing required project name." });
  } else if (!description) {
    res.status(400).json({ message: "Missing required project description." });
  } else {
    next();
  }
}
//export
module.exports = router;
