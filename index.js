const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const request = require("request");

//connection to mongodb
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/studentDB");
const ObjectId = require('mongoose').Types.ObjectId;


const app = express();
app.use(bodyParser.json());


//Schema for Class--blueprint
const classSchema = new mongoose.Schema({
  std: {
    type: Number
  },
  div: {
    type: String
  }

});

//Schema for Student blueprint
const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  roll_no: {
    type: Number,
    required: true
  },
  mob: {
    type: Number,
    required: true
  },
  class_id: {
    type: String,
    required: true
  },
  standard: classSchema,
  division: classSchema

});
//model for Student
const Student = mongoose.model("Student", studentSchema);
//model for class
const Class = mongoose.model("Class", classSchema);


//Inserting entries to Student
app.post('/student/add', (req, res) => {
  const stud = new Student({
    name: req.body.name,
    roll_no: req.body.roll_no,
    mob: req.body.mob,
    class_id: req.body.class_id,
    standard: {
      std: req.body.std,
      div: req.body.div
    },
    division: {
      std: req.body.std,
      div: req.body.div
    }
  });
  stud.save((err, data) => {
    if (!err) {
      // res.send(data);
      res.status(200).json({
        code: 200,
        message: 'Student Added Successfully',
        addStudent: data
      })
    } else {
      console.log(err);
    }
  });
});


// reading all students in a class with std and div
app.get('/student', (req, res) => {
  Student.find({}, (err, data) => {

    if (!err) {
       res.send(data);

    } else {
      res.send(err);
    }

    // data.forEach(data => {
    //   res.send("Name: " + data.name + " STD:" + data.standard.std + " DIV:" + data.division.div);
    // });
  });
});


//Inserting entries to Class
app.post('/class/add', (req, res) => {
  const cls = new Class({
    std: req.body.std,
    div: req.body.div

  });
  cls.save((err, data) => {
    if (!err) {
      // res.send(data);
      res.status(200).json({
        code: 200,
        message: 'Std and Class Added Successfully',
        addStudent: data
      })
    } else {
      console.log(err);
    }
  });
});


//Reading data from class schema
app.get('/class', (req, res) => {
  Class.find({}, (err, data) => {
    if (!err) {
      res.send(data);
    } else {
      res.send(err);
    }
  });
});

//Updating the entries
app.put('/student/update/:id', (req, res) => {

  const stud1 = {
    name: req.body.name,
    roll_no: req.body.roll_no,
    mob: req.body.mob,
    class_id: req.body.class_id,
    standard: {
      std: req.body.std,
      div: req.body.div
    },
    division: {
      std: req.body.std,
      div: req.body.div
    }
  };

  //updating by ID
  Student.findByIdAndUpdate(req.params.id, {$set: stud1  }, {new: true}, (err, data) => {
    if (!err) {
      res.status(200).json({
        code: 200,
        message: 'Student Updated Successfully',
        updateStudent: data
      })
    } else {
      console.log(err);
    }
  });
});

// Delete Student
app.delete('/student/delete/:id', (req, res) => {

  Student.findByIdAndRemove(req.params.id, (err, data) => {
    if (!err) {
      // res.send(data);
      res.status(200).json({
        code: 200,
        message: 'Student deleted',
        deleteStudent: data
      })
    } else {
      console.log(err);
    }
  });
});

app.listen(3000, function() {
  console.log("Listening to port 3000");
});
