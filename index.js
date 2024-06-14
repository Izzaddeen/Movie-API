
const express = require("express")
const app = express()
const dotenv = require("dotenv");

const cors = require('cors')



dotenv.config();

const corsConfig = {
    origin:"*",
    Credential:true,
    methods:["GET", "POST", "PUT","DELETE"]
}
app.options("",cors(corsConfig))
app.use(cors(corsConfig))

const mongoose = require("mongoose")
require('dotenv').config();



app.use(express.json());


mongoose.connect(process.env.MONGODB_CONNECT_URL)
.then(() => console.log("mongodb connected"))
.catch((error) => console.log(error));

const UserSchema = new mongoose.Schema({
    title: String,
    releasedate: Number,
    director: String,
    rating: String,
    price: Number,
    poster: String,
    description: String,
    id: Number,
})
const MovieData = mongoose.model("movie", UserSchema);


// app.get('/', (req, res) => {
//     return res.json({ status:200, message: "Server running at " + process.env.PORT })
// })
app.get("/movie",async (req,res) => {

  
    MovieData.find({}).then(function(movie) {
        res.json(movie);
    }).catch(function(err) {
        console.log(err);
    })
});

app.get("/movie/:id", async(req, res) => {

   let id = req.params.id;

    MovieData.findById(id).then(function(movie) {
        res.json(movie);
    }).catch(function(err) {
        console.log(err);
    })
})

app.post("/movie", async (req,res) => {
    console.log("Inside Post Function");

    const movie = new MovieData({
        id:req.body.id,
        title:req.body.title,
        releasedate:req.body.releasedate,
        director:req.body.director,
        rating:req.body.budget,
        price:req.body.price,
        poster:req.body.poster,
        description:req.body.description,
        
    });
    await movie.save();
    res.send("posted");
})

app.put("/updateMovie/:id", async (req, res) => {
    
    const updateId = req.params.id;
    const updateTitle = req.body.title;
    const updateReleaseDate = req.body.releasedate;
    const updateDirector = req.body.director;
    const updateRating = req.body.rating;
    const updatePrice = req.body.price;
    const updatePoster = req.body.poster;
    const updateDescription = req.body.description;

    try {
        const updateMovie = await MovieData.findOneAndUpdate(
            { id: updateId },
            { $set: {
                title:updateTitle,
                releaseDate:updateReleaseDate,
                director:updateDirector,
                rating:updateRating,
                price:updatePrice, 
                poster:updatePoster,
                description:updateDescription,
            } },
            { new: true }
        );

        if (updateMovie) {
            res.json(updateMovie);
        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.delete("/deleteMovie/:id", async (req, res) => {
    const deleteId = req.params.id;

    try {
        const deleteMovie = await MovieData.findOneAndDelete({ id: deleteId });

        if (deleteMovie) {
            res.json(deleteMovie);
        } else {
            res.status(404).send("User not found");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});


// app.listen(process.env.PORT || 3000, () => {
//     console.log(`Server running on ${process.env.PORT || 3000}`);
// });


app.listen(process.env.PORT, () => {
 console.log("server runs on 3000")
})
