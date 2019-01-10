/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

module.exports = function (app, db) {

  app.route('/api/issues/:project')
  
    .get(function (req, res){
      var project = req.params.project;
      console.log('get query: ' + req.query);
      db.collection(project).find(req.query).toArray((err, docs) => {
        if(err) {
          console.log('get error: ' + err);
        }else {
          res.json(docs);
        }
      })
    })
    
    .post(function (req, res){
      var project = req.params.project;
      const {issue_title, issue_text, created_by, assigned_to, status_text} = req.body;
      if(issue_title == '' && issue_text== '' && created_by == '') {
        return res.json({issue_title: 'required', issue_text: 'required', created_by: 'required'})
      }else {
      db.collection(project).insertOne({issue_title, issue_text, created_by, assigned_to, status_text,
      created_on: Date(), updated_on: Date(), open: true}, (err, doc) => {
        if(err) {
          console.log('post error: ' + err);
        }else {
          //console.log(doc.ops[0]._id);
          res.json({
            issue_title,
            issue_text,
            created_by,
            assigned_to,
            status_text,
            _id: doc.ops[0]._id
          });
        }
      });
    }
    })
    
    .put(function (req, res){
      var project = req.params.project;
      const { issue_title, issue_text, created_by, assigned_to, status_text, open } = req.body;
      if(issue_title == '' && issue_text == '' && created_by == '' && assigned_to == '' && status_text == '') {
        console.log(req.body);
        return res.json({message: 'no updated field sent'})
      }
      else {
      db.collection(project).findOneAndUpdate({_id: new ObjectId(req.body._id)}, { $set: {issue_title, 
        issue_text, created_by, assigned_to, status_text, updated_on: Date(), open} }, (err, results) => {
        if(err) {
          console.log('put error: ' + err);
          res.json({message: 'could not update ' + req.body._id});
        }else {
          //console.log('put results: ' + results);
          console.log(req.body);
          res.json({message: 'successfully updated'});
        }
      });
    }
    })
    
    .delete(function (req, res){
      var project = req.params.project;
      if(!req.body._id) {
        return res.json({message: '_id error'})
      }else {
      db.collection(project).findOneAndDelete({_id: new ObjectId(req.body._id)}, (err, r) => {
        if(err) {
          console.log('delete error: ' + err)
          res.json({message: 'could not delete' + req.body._id});
        }else {
          console.log(req.body);
          res.json({message: 'deleted ' + req.body._id});
        }
      });
    }
    })
  }
