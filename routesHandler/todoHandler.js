const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const todoSchema = require("../schemas/todoSchema");
const Todo = new mongoose.model("Todo", todoSchema);

//GET ALL THE TODOS
router.get("/", async (req, res)=>{
    try{
        const limit = parseInt(req.query.limit) || 5; //This line use for show limit data files
        const resultGet = await Todo.find({status: "active"},"title status date -_id").limit(limit);
            res.status(200).json({
                result: resultGet,
                message: "success!",
            });
       

    }catch(err){
        res.status(500).json({
            error: "There was a server side Error!",
        });
    }

});


// GET TODO BY ID
router.get("/:id", async (req, res) => {
    try {
        const todoId = req.params.id; // Get the ID from the request parameters
        const resultGet = await Todo.findById(todoId, "title status date -_id"); // Retrieve the todo by ID

        if (!resultGet) {
            return res.status(404).json({ message: "Todo not found!" }); // Handle case where todo is not found
        }

        res.status(200).json({
            result: resultGet,
            message: "success!",
        });

    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({
            error: "There was a server side Error!",
        });
    }
});


//post a todo 
router.post("/", async (req, res) => {
    const newTodo = new Todo(req.body);
    try {
        await newTodo.save(); // Correct usage
        res.status(200).json({
            message: "Todo was inserted successfully!",
        });
    } catch (err) {
        res.status(500).json({
            error: "There was a server side ERROR!",
        });
    }
});


//post multiple todo
router.post("/all", async(req, res)=>{
    try{
        const result = await Todo.insertMany(req.body);
        res.status(200).json({
            message: "Todos were inserted successfully!",
            data: result,
        });

    }catch(err){
        res.status(500).json({
            error: "There was a server side error!",
        });
    }
});


// PUT todo
router.put("/:id", async (req, res) => {
    try {
        // Use async/await without the callback
        const result = await Todo.updateOne(
            { _id: req.params.id },
            { $set: { status: "active" } }
        );

        // Check if the update was successful
        if (result.nModified > 0) {
            res.status(200).json({
                message: "Todo was updated successfully!",
            });
        } else {
            res.status(404).json({
                error: "Todo not found or no changes made.",
            });
        }
    } catch (err) {
        // Handle any errors that occur during the update
        res.status(500).json({
            error: "There was a server side error!",
            details: err.message
        });
    }
});


//delete todo
// DELETE TODO BY ID
router.delete("/:id", async (req, res) => {
    try {
        const todoId = req.params.id; // Get the ID from the request parameters
        const resultDelete = await Todo.findByIdAndDelete(todoId); // Delete the todo by ID

        if (!resultDelete) {
            return res.status(404).json({ message: "Todo not found!" }); // Handle case where todo is not found
        }

        res.status(200).json({
            message: "Todo deleted successfully!",
        });

    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({
            error: "There was a server-side error!",
        });
    }
});


module.exports = router;