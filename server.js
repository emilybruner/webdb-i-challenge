const express = require('express');

const db = require('./data/dbConfig.js');

const server = express();

server.use(express.json());

// Get List of Accounts

server.get("/api", (req, res) => {
    db.select("*")
    .from("accounts")
    .then(accounts => {
        res.status(200).json(accounts);
    })
    .catch(err => {
        console.log("Error getting accounts", err);
        res.status(500).json({message: "Error getting accounts"})
    })
})


// Get by ID

server.get("/api/:id", (req, res) => {
    db('accounts')
    .where({id: req.params.id})
    .first()
    .then(accounts => res.status(200).json(accounts))
    .catch(error => res.status(500).json({errorMessage: "Could not get account"}))
})

// Add an account

server.post("/api", (req, res) => {
    const accountData = req.body;
    (!accountData.name || !accountData.budget) ? res.status(400).json({errorMessage: "Please provide name and budget for the account"})
    : db('accounts')
    .insert(accountData, 'id')
    .then(([id]) => {
        db('accounts')
        .where({id})
        .first()
        .then(account => {
            res.status(200).json(account)
        })
    })
    .catch(err => res.status(500).json({message: 'Error adding account'}))
})

server.put('/api/:id', (req, res) => { 
    const accountChanges = req.body;
    db('accounts')
        .where('id', req.params.id)
        .update(accountChanges)
        .then(response => res.status(200).json({ message: 'Account updated' }))
        .catch(err => res.status(500).json({ message: 'Error adding account' }))
});

server.delete('/api/:id', (req, res) => {
    db('accounts')
    .where({id: req.params.id})
    .del()
    .then(count => res.status(200).json({message: `Deleted records: ${count}`}))
    .catch(err => res.status(500).json({message: 'Failed to delete account'}))
})

module.exports = server;