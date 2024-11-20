const helper = require('../../helper/helper');
const db = require('../../models');
const { Validator } = require('node-input-validator');

module.exports = {

    carrier_add: async (req, res) => {
        try {
            if (!req.session.admin) return res.redirect("/login");
            const session = req.session.admin;

            res.render("admin/carrier/add", {
                title: "Add Carrier",
                session
            });
        } catch (error) {
            console.error("Error view", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    carrier_add_post: async (req, res) => {
        try {
          
            let data = await db.carrier.create({
                name:req.body.name,
                raw: true
            });

            req.flash("success", "Data added successfully");
            res.redirect("/carrierlist");
        } catch (error) {
            console.log(error);

        }
    },
    carrier_list: async (req, res) => {
        try {
            if (!req.session.admin) return res.redirect("/login");
            const session = req.session.admin;

            let data = await db.carrier.findAll({
                raw: true
            });

            
            res.render("admin/carrier/list", {
                session, data,
                title: "Carrier"
            })
        } catch (error) {
            console.log(error);

        }
    },
    carrier_view: async (req, res) => {
        try {
            if (!req.session.admin) return res.redirect("/login");
            const session = req.session.admin;

            const data = await db.carrier.findOne({
                where: { id: req.params.id }
            });

            res.render("admin/carrier/view", {
                title: "Carrier Detail",
                data,
                session
            });
        } catch (error) {
            console.error("Error view", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    carrier_delete: async (req, res) => {
        try {
            if (!req.params.id) {
                return res.status(400).json({ success: false, message: "carrier ID is required" });
            }
            const service = await db.carrier.findByPk(req.params.id);
            if (!service) {
                return res.status(404).json({ success: false, message: "carrier not found" });
            }
            await db.carrier.destroy({ where: { id: req.params.id } });

            return res.json({ success: true, message: "carrier deleted successfully" });
        } catch (error) {
            console.error("Error deleting package:", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },

    carrier_edit_get: async (req, res) => {
        try {
            if (!req.session.admin) return res.redirect("/login");

            const data = await db.carrier.findOne({
                where: { id: req.params.id }
            });

            res.render('admin/carrier/edit', {
                session: req.session.admin,
                title: "Edit Carrier",
                data,

            });
        } catch (error) {
            console.error("Error view", error);
            res.status(500).json({ success: false, message: "Internal server error" });
        }
    },
    carrier_edit_post: async (req, res) => {
        try {
            if (!req.session.admin) return res.redirect("/login");

            const carrier = await db.carrier.findOne({ where: { id: req.params.id } });
            if (!carrier) {
                return res.status(404).json({ success: false, message: "Carrier not found" });
            }

            const data = await db.carrier.update({
                name: req.body.name,
            }, {
                where: { id: req.params.id }
            });
            req.flash("success", "Carrier updated successfully");
            res.redirect("/carrierlist");

        } catch (error) {
            console.error("Error editing carrier:", error);
            return helper.error(res, "Internal server error");
        }
    }

}