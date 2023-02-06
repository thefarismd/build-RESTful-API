//jshint esversion:6

//---- Modules ----//
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); //


//---- MongoDB-Moongoose Connection DB, Schema & Model ----//
mongoose.set('strictQuery', false);
mongoose.connect('mongodb://127.0.0.1:27017/wikiDB');

const articleSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Article = new mongoose.model('article', articleSchema); //

//---- Chain Route Handlers Using Express ----//
// ---- Request Targeting All Articles ----//
app.route("articles")

    .get(function (req, res) {
        Article.find({}, function (err, foundDocs) {
            if (!err) {
                res.send(foundDocs);
            } else {
                res.send(err);
            }
        });
    })

    .post(function (req, res) {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save(function (err) {
            if (!err) {
                res.send("Successful added a new article.");
            } else {
                res.send(err);
            };
        });
    })//

    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send("Successfully deleted all articles");
            } else {
                res.send(err);
            };
        });
    });

//---- Chain Route Handlers Using Express ----//
// ---- Request Targeting A Articles ----//
app.route("/articles/:articleTitle")

    .get(function (req, res) {
        Article.findOne({ title: req.params.articleTitle }, function (err, foundDoc) {
            if (foundDoc) {
                res.send(foundDoc);
            } else {
                res.send("No article found.");
            };
        });
    })

    .put(function (req, res) {
        Article.findOneAndUpdate(
            { title: req.params.articleTitle },
            { title: req.body.title, content: req.body.content },
            { overwrite: true },
            function (err) {
                if (!err) {
                    res.send("Successfuly updated Article.");
                };
            });
    })

    .patch(function (req, res) {
        Article.findOneAndUpdate(
            { title: req.params.articleTitle },
            { $set: req.body },
            function (err) {
                if (!err) {
                    res.send("The article was updated Successfully")
                };
            });
    })

    .delete(function(req, res){
        Article.deleteOne({title: req.params.articleTitle}, function(err){
            if(!err){
                res.send("Successfully Deleted");
            } else {
                res.send(err);
            };
        });
    });

//---- Server Connection ----//
app.listen(3000, function () {
    console.log("Server started on port 3000");
});//
