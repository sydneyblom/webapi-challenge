const express = require("express");
const router = express.Router();
const actionDB = require("../data/helpers/actionModel");


//returns id, project id, desc, notes and completed
//checking to make sure if it returning req object
router.get("/:id", validateAction, (req, res) => {
  actionDB
    .get(req.params.id)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.status(500).json({ error: "There was an error getting actions." });
    });
});

//allows us to update a specific id - within that project can update proj id, des, notes and if it is completed or not
//checking to make sure if it returning req object
//validate action info makes sure it is returning data in the body, desc and notes
router.put("/:id", validateAction, validateActionInfo, (req, res) => {
  const { id } = req.params;
  const { project_id, description, notes, completed } = req.body;
  actionDB
    .update(id, { project_id, description, notes, completed })
    .then(updatedAction => {
      res.status(200).json(updatedAction);
    })
    .catch(error => {
      // log error to server
      console.log(error);
      res.status(500).json({
        message: "Error updating actions."
      });
    });
});


//creating a new post, checking to make sure it has all the info and creating a new post with that info
router.post("/", (req, res) => {
  const actions = req.body;
  actionDB
    .insert(actions)
    .then(actions => {
      res.status(201).json(actions);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: "Error inserting actions." });
    });
});
//check to make sure id exists
//will remove the id listed at the value
router.delete("/:id", validateAction, (req, res) => {
  actionDB
  //will remove the id listed at the value//object containing properties named to rout
    .remove(req.params.id)
    .then(response => {
      res.status(404).json(response);
    })
    .catch(error => {
      res.status(500).json({ message: "Error deleting action" });
    });
});

//middleware

function validateAction(req, res, next) {
  const actionId = req.params.id;
  actionDB
    .get(actionId)
    .then(action => {
      if (action) {
        next();
      } else {
        res
          .status(404)
          .json({ message: "An action with this id does not exist." });
      }
    })
    .catch(error => {
      res
        .status(500)
        .json({
          error: "There was an error retrieving the action from the database."
        });
    });
}

function validateActionInfo(req, res, next) {
  if (!req.body) {
    res.status(400).json({ message: "Missing action data." });
  } else if (!req.body.notes) {
    res.status(400).json({ message: "Missing required action notes." });
  } else if (!req.body.description) {
    res.status(400).json({ message: "Missing required action description." });
  } else {
    next();
  }
}

module.exports = router;
