const db = require('../../models');
const helper = require("../../helper/helper");


db.packages.belongsTo(db.users,{
    foreignKey:"user_id",
    as:"data"
  });
  db.packages.belongsTo(db.carrier,{
    foreignKey:"carrier_id",
    as:"carriers"
  });
db.packages.hasMany(db.package_images,{
    foreignKey:"package_id",
    as:'img'
  });
module.exports={

  
    packagelist:async(req,res)=>{
        
        try {
            if (!req.session.admin) return res.redirect("/login");

            const data = await db.packages.findAll({
                include:[{model: db.users, as:'data'},
                    {
                        model:db.carrier,
                        as:"carriers"
                    }
                    
                ]
            });
            
            
            res.render("admin/packeges.ejs", {
                title: "Packges",
                data,
                session: req.session.admin,
            });
        } catch (error) {
            console.error("Error ", error);
            return helper.error(res, "Internal server error,..........");
        }
    },
    pacakge_view:async(req,res)=>{
        try {
            if (!req.session.admin) return res.redirect("/login");
            const view = await db.packages.findOne({
                include:[{model: db.users, as:'data'},
                    {
                        model:db.package_images,
                        as:"img"
                    },   {
                        model:db.carrier,
                        as:"carriers"
                    }
                ],
                where:{id:req.params.id}});
        
            res.render("admin/packageview.ejs", {
                title: "Package Detail",
                view,
                session: req.session.admin,
            });
        } catch (error) {
            console.error("Error ", error);
            return helper.error(res, "Internal server error");
        }
    },
    packagedelete: async (req, res) => {
        try {
            if (!req.params.id) {
                return res.status(400).json({ success: false, message: "package ID is required" });
            }
            const service = await db.packages.findByPk(req.params.id);
            if (!service) {
                return res.status(404).json({ success: false, message: "package not found" });
            }
            await db.packages.destroy({ where: { id: req.params.id } });

            return res.json({ success: true, message: "package deleted successfully" });
        } catch (error) {
            console.error("Error deleting package:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
}