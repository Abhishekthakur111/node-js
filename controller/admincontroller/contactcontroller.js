const helper = require('../../helper/helper');
const db = require('../../models');
const { Validator } = require('node-input-validator');

module.exports = {

    createcontactus: async (req, res) => {
        try {
            const data = await db.contacts.create({
                name: req.body.name,
                email:req.body.email,
                phone_no:req.body.phone_no,
                location:req.body.location,
              
            });
            req.flash("success", "Contact added successfully");
          res.redirect('contacts');
        } catch (error) {
           console.error("Error creating contactus", error);
            return helper.error(res, "Internal server error");
        }
    },
    getcontacts:async(req,res)=>{
        try {
            if (!req.session.admin) return res.redirect("/login");
            const data = await db.contacts.findAll({});
            res.render("contactus/contactus.ejs", {
                title: "Contacts",
                data,
                session: req.session.admin,
              });
        } catch (error) {
            console.error("Error ", error);
            return helper.error(res, "Internal server error"); 
        }
    },
    deletecontact: async (req, res) => {
        try {
            if (!req.params.id) {
                return res.status(400).json({ success: false, message: "contact ID is required" });
            }
            const contact = await db.contacts.findByPk(req.params.id);
            if (!contact) {
                return res.status(404).json({ success: false, message: "contact not found" });
            }
            await db.contacts.destroy({ where: { id: req.params.id } });
            console.log()

            return res.json({ success: true, message: "contact deleted successfully" });
        } catch (error) {
            console.error("Error deleting contact:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    contactview: async(req,res)=>{
        try {
            if (!req.session.admin) return res.redirect("/login");
          const data = await db.contacts.findOne({
            where:{id:req.params.id}});
        
          res.render("contactus/contactview.ejs", {
            title: "Contact Detail",
            data,
            session: req.session.admin,
          });
        } catch (error) {
          console.error("Error view", error);
          res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    contactadd:async(req,res)=>{
        try {
            if (!req.session.admin) return res.redirect("/login");
            res.render("contactus/contactadd.ejs", {
                title: "Add Contact",
                session: req.session.admin,
              });
        } catch (error) {
            console.error("Error for add", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

}