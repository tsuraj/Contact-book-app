const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Contact = require('../models/contact');

//list down all the contacts
router.get('/',(req,res,next)=>{
    Contact.find()
        .select("name email _id")
        .exec()
        .then(docs=>{
           
                //pagination
                const page  = req.query.page?req.query.page:1;
                const limit = 10;
                const startIndex = (page-1)* limit;
                const endIndex = page*limit < docs.length?page*limit: docs.length;
                const result_docs = docs.slice(startIndex,endIndex);
                const response = {
                total_count: docs.length,
                count: result_docs.length,
                contacts: result_docs.map(doc=>{
                    return {
                        name: doc.name,
                        email: doc.email,
                        _id: doc._id
                    }
                })

            }
            res.status(200).json(response);
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
    });

//add contacts
router.post('/',(req,res,next)=>{
     console.log(req.body);
    const contact = new Contact({
        _id: new mongoose.Types.ObjectId(),
       name: req.body.name,
       email: req.body.email
    });
    console.log(req.body.email);
    contact
        .save()
        .then(result =>{
            console.log(result);
            res.status(201).json({
                message: "Contact is added",
                AddedContact:{
                    name: result.name,
                    email: result.email,
                    _id: result._id,
                }
            })
            
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error: err});
        });
})

//search contacts
router.get('/:search_param',(req, res, next) =>{
   
    
    search_param_ = req.params.search_param;
    //check if searching parameter is email or name
    if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(search_param_)){
        Contact.find({"email" : search_param_})
        .select()
        .exec()
        .then(doc =>{
            console.log("From database",doc);
            if(doc && doc.length!=0){
                res.status(200).json({
                    contact_details: doc
                });
            }else{
                res.status(404).json({message: "contact is not found"});
            }
        })
        .catch(err=>{
            console.log(err);
            res.status(500).json({error: err});
        });
    }else{
        Contact.find({"name" : search_param_})
            .select()
            .exec()
            .then(doc =>{
                console.log("From database",doc);
                if(doc && doc.length!=0){
                    res.status(200).json({
                        contact_details:  doc
                       
                    });
                }else{
                    res.status(404).json({message: "contact is not found"});
                }
            })
            .catch(err=>{
                console.log(err);
                res.status(500).json({error: err});
            });
    }
    
});

//updating the contact

router.patch('/:name',(req, res, next)=>{
    const name_ = req.params.name;
    console.log(name_);
   
    Contact.updateOne({name:name_},{$set: {name: req.body.name, email: req.body.email}})
        .exec()
        .then(result =>{
            console.log(result);
            res.status(200).json({
                message: `Contact of ${name_} is updated`
            });
        })
        .catch(error=>{
            console.log(error);
            res.status(500).json({
                error: err
            });
        });
});


//const checkAuth = require('../middleware/check-auth');const contact = require('../models/contact');

module.exports = router;

