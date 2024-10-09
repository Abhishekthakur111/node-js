const db = require('../../models');
const bcrypt = require('bcrypt');
const path = require('path');
const helper = require('../../helper/helper');


module.exports = {
    provider_list: async (req, res) => {  
        try {
          if (!req.session.admin) return res.redirect("/login");
          const data = await db.users.findAll({
            where: {
              role: "2",
            },
            raw: true,
          });
          res.render("admin/providerlist", {
            title: "Providers",
            data,
            session: req.session.admin,
          });
        } catch (error) {
          console.error("Error fetching user list:", error);
          res.status(500).json({ message: "Internal server error" });
        }
    },
}