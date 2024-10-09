const helper = require('../../helper/helper');
const db = require('../../models');
const { Validator } = require('node-input-validator');

db.servicelist.belongsTo(db.category,{
    foreignKey:"cat_id",
    as:"categories",
  });

module.exports = {
    createservice: async (req, res) => {
        try {
            const v = new Validator(req.body, {
                name: "required",
                price: 'string',
                image: "string", 
                cat_id:"required"  
            });
            let errorsResponse = await helper.checkValidation(v);
            if (errorsResponse) {
                return helper.error(res, errorsResponse);
            }
            if (req.files && req.files.image) {
                let images = await helper.fileUpload(req.files.image);
                req.body.image = images;
            }
            const newService = await db.servicelist.create({
                name: req.body.name,
                price: req.body.price,
                image: req.body.image,
                cat_id: req.body.cat_id
            });
            req.flash("success","Add service successfully");
           res.redirect('/servicelist');
        } catch (error) {
           console.error("Error creating service:", error);
            return helper.error(res, "Internal server error");
        }
    },
    getservice:async(req,res)=>{
        try {
            if (!req.session.admin) return res.redirect("/login");
          const service = await db.servicelist.findAll({
           include:[{model:db.category, as:'categories'}] ,
          
          });
          res.render("service/servicelist", {
            title: "Services",
            service,
            session: req.session.admin,
          });
          
          
         } catch (error) {
            console.error("Error view:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    status: async (req, res) => {
        try {
            const result = await db.servicelist.update(
                { status: req.body.status },
                { where: { id: req.body.id } }
            );
            if (result[0] === 1) {
                res.json({ success: true });
            } else {
                res.json({ success: false, message: "Status change failed" });
            }
        } catch (error) {
            console.error("Error updating status:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
       },
    delete: async (req, res) => {
        try {
            if (!req.params.id) {
                return res.status(400).json({ success: false, message: "Category ID is required" });
            }
            const service = await db.servicelist.findByPk(req.params.id);
            if (!service) {
                return res.status(404).json({ success: false, message: "service not found" });
            }
            await db.servicelist.destroy({ where: { id: req.params.id } });

            return res.json({ success: true, message: "service deleted successfully" });
        } catch (error) {
            console.error("Error deleting service:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    serviceview: async(req,res)=>{
        try {
          const data = await db.servicelist.findOne({
            include:[{model:db.category, as:'categories'}] ,
            where:{id:req.params.id}});
        
          res.render("service/serviceview", {
            title: "Details",
            data,
            session: req.session.admin,
          });
        } catch (error) {
          console.error("Error view", error);
          res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    serviceadd:async(req,res) => {
        try {
            if (!req.session.admin) return res.redirect("/login");

            const data = await db.category.findAll({raw:true});
            res.render('service/serviceadd',{
              session:req.session.admin,
              title:"Add Service",
              data
            });
          } catch (error) {
            console.error("Error view", error);
            res.status(500).json({ success: false, message: "Internal server error" });
          }
    }
 }
       


