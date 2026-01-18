const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            message: "Username and password are required"
        });
    }

    let check = users.filter(
        user => user.username.toLowerCase() === username.toLowerCase()
    );

    if (check.length > 0) {
        return res.status(409).json({
            message: "User already exists"
        });
    }

    users.push({ username, password });

    return res.status(200).json({
        message: "User successfully registered"
    });
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
    try {
        const getBooks = new Promise((resolve, reject) => {
            resolve(books);
        });

        const result = await getBooks;
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn;

    try {
        const getBookByISBN = new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject("Book not found");
            }
        });

        const result = await getBookByISBN;
        res.status(200).json(result);
    } catch (err) {
        res.status(404).json({ message: err });
    }
});
  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    const author = req.params.author;

    try {
        const getBooksByAuthor = new Promise((resolve, reject) => {
            const result = Object.values(books).filter(
                book => book.author.toLowerCase() === author.toLowerCase()
            );
            resolve(result);
        });

        const result = await getBooksByAuthor;
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});

// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    const title = req.params.title;

    try {
        const getBooksByTitle = new Promise((resolve, reject) => {
            const result = Object.values(books).filter(
                book => book.title.toLowerCase() === title.toLowerCase()
            );
            resolve(result);
        });

        const result = await getBooksByTitle;
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: "Error retrieving books" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    let review = books[isbn].reviews;

    return res.send(review)
});


module.exports.general = public_users;
