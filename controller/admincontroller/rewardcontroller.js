const helper = require('../../helper/helper');
const db = require('../../models');
const { Validator } = require('node-input-validator');


module.exports ={

    createreward: async (req, res) => {
        try {
            const data = await db.rewards.create({
                amount: req.body.amount,
                points: req.body.points
            });  
            req.flash("success", "Reward added successfully");
            res.redirect('/rewards');
        } catch (error) {
            console.error("Error", error);
            return helper.error(res, "Internal server error");
        }
    },
    
    rewards:async(req,res)=>{
        try {
            if (!req.session.admin) return res.redirect("/login");
            const data = await db.rewards.findAll({});
            res.render("rewards/rewards.ejs", {
                title: "Rewards",
                data,
                session: req.session.admin,
              });
        } catch (error) {
            console.error("Error ", error);
            return helper.error(res, "Internal server error"); 
        }
    },
    rewardview: async(req,res)=>{
        try {
            if (!req.session.admin) return res.redirect("/login");
          const data = await db.rewards.findOne({
            where:{id:req.params.id}});
        
          res.render("rewards/rewardview", {
            title: "Reward Detail",
            data,
            session: req.session.admin,
          });
        } catch (error) {
          console.error("Error view", error);
          res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    deletereward: async (req, res) => {
        try {
            if (!req.params.id) {
                return res.status(400).json({ success: false, message: "reward ID is required" });
            }
            const reward = await db.rewards.findByPk(req.params.id);
            if (!reward) {
                return res.status(404).json({ success: false, message: "reward not found" });
            }
            await db.rewards.destroy({ where: { id: req.params.id } });
            console.log()

            return res.json({ success: true, message: "reward deleted successfully" });
        } catch (error) {
            console.error("Error deleting contact:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    rewardadd:async(req,res)=>{
        try {
            if (!req.session.admin) return res.redirect("/login");
            res.render("rewards/rewardadd.ejs", {
                title: "Add Reward",
                session: req.session.admin,
              });
        } catch (error) {
            console.error("Error ", error);
            return helper.error(res, "Internal server error"); 
        }
    },
    reward_edit_get:async(req,res)=>{
        try {
            if (!req.session.admin) return res.redirect("/login");
            const data = await db.rewards.findOne({
                where: { id: req.params.id }
            });
    
            res.render("rewards/edit.ejs", {
                title: "Edit Reward",
                data,
                session: req.session.admin,
              });
        } catch (error) {
            console.error("Error ", error);
            return helper.error(res, "Internal server error"); 
        }
    },
    reward_edit_post: async (req, res) => {
        try {
            if (!req.session.admin) return res.redirect("/login");
            
            const reward = await db.rewards.findOne({ where: { id: req.params.id } });
            if (!reward) {
                return res.status(404).json({ success: false, message: "Reward not found" });
            }
            
            const data= await db.rewards.update({
              amount:req.body.amount,
              points:req.body.points,
            }, {
                where: { id: req.params.id }
            });
            req.flash("success", "Reward updated successfully");
            res.redirect("/rewards");
    
        } catch (error) {
            console.error("Error editing reward:", error);
            return helper.error(res, "Internal server error");
        }
    }
}