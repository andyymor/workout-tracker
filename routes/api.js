const router = require("express").Router();
const Workouts = require("../models/workout.js");

router.post("/api/workouts", (req, res) => {
    Workouts.create({})
      .then(dbWorkout => {
        res.json(dbWorkout);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  });

  router.put("/api/workouts/:id", ({body, params}, res) => {
    Workouts.findByIdAndUpdate(
        params.id,
        {$push:{exercises:body}},
        {new:true, runValidators: true}
        )
      .then(dbWorkout => {
        res.json(dbWorkout);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  });
//getting exercises
  router.get("/api/workouts", (req, res) => {
    Workouts.aggregate([
        {
            $addFields:{
                totalDuration:{
                    $sum:'$exercise.duration',
                },
            },
        },
    ])
      .then(dbWorkout => {
        res.json(dbWorkout);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  });

  //range
  router.get("/api/workouts/range", (req, res) => {
    Workouts.aggregate([
        {
            $addFields:{
                totalDuration:{
                    $sum:'$exercise.duration',
                },
            },
        },
     ])
     .sort({_id:-1})
     .limit(6)
      .then(dbWorkout => {
        res.json(dbWorkout);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  });

  //delete
  router.delete("/api/workouts", ({body}, res) => {
    Workouts.findByIdAndDelete(body.id)
      .then(() => {
        res.json(true);
      })
      .catch(err => {
        res.status(400).json(err);
      });
  });

  //exporting
  module.exports = router;
