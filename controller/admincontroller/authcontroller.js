const db = require('../../models');
const bcrypt = require('bcrypt');
const helper = require("../../helper/helper");



module.exports = {
  dashboard: async (req, res) => {
    try {
        if (!req.session.admin) return res.redirect("/login");
        const users = await db.users.count({ where: { role: '1' } });
        const carrier = await db.carrier.count({});
        const reward = await db.rewards.count({});
        const contact = await db.contacts.count({});
        const usersByMonth = await db.users.findAll({
            where: { role: '1' },
            attributes: [
                [db.Sequelize.fn('MONTH', db.Sequelize.col('createdAt')), 'month'],
                [db.Sequelize.fn('COUNT', db.Sequelize.col('id')), 'count']
            ],
            group: ['month'],
            order: [[db.Sequelize.fn('MONTH', db.Sequelize.col('createdAt')), 'ASC']],
            raw: true
        });
        const chartData = Array(12).fill(0);
        usersByMonth.forEach(item => {
            chartData[item.month - 1] = parseInt(item.count, 10);
        });

        res.render("dashboard", {
            session: req.session.admin,
            title: "Dashboard",
            users,
            chartData,
            carrier,reward,contact
        });
    } catch (error) {
        console.error('Error rendering dashboard:', error);
        res.status(500).json({ message: "Internal server error" });
    }
},
login: async (req, res) => {
    try {
      res.render('login');
    } catch (error) {
      console.error('Error rendering login page:', error);
      res.status(500).json({ message: "Internal server error" });
    }
},
loginpost: async (req, res) => {
    try {
      
      const { email, password } = req.body;
      const find_user = await db.users.findOne({ where: { email , role:'0'} });
      
      if (!find_user) {
        return res.status(400).json({ message: "User not found" });
      }
      
      const storedHash = find_user.password;
      const is_password = await bcrypt.compare(password, storedHash);

      if (is_password) {
        if (find_user.role == 0) { 
          req.session.admin = find_user;
           req.flash("success", " Your are login succesfully ");
          return res.redirect('/dashboard');
        } else {          
          req.flash("error", "Access denied");
          return res.redirect('/login'); 
        }
      } else {
        req.flash("error", "invalid crentials");
          return res.redirect('/login'); 
      }
    } catch (error) {
      console.error('Error during login:', error);
      req.flash("error", "invalid crentials");
      return res.redirect('/login'); 
    }
},
profile: async (req, res) => {
    try {
      
      if (!req.session.admin) {
        return res.redirect("/login");
      }
      const profile = await db.users.findOne({
        where: { email: req.session.admin.email },
      });
      
        res.render("admin/profile.ejs", {
          session:req.session.admin,
          profile,
          title:"Profile"
        });

    } catch (error) {
      console.error('Error rendering profile:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
},
edit_profile: async (req, res) => {
    try {
      if (!req.session.admin) return res.redirect("/login");
      let updatedata = {...req.body}
      let folder = "admin";
      if (req.files && req.files.image) {
        let images = await helper.fileUpload(req.files.image, folder);
        updatedata.image = images;
      }
      const profile = await db.users.update(updatedata, {
        where: {
          id: req.session.admin.id,
        },
      });
      const find_data = await db.users.findOne({
        where: {
          id: req.session.admin.id,
        },
      });
      req.session.admin = find_data;
      req.flash("success", " Update Profile succesfully ");
      res.redirect("/profile");
    } catch (error) {
      console.log(error);
      return helper.error(res, error);
    }
},
password: async(req,res)=>{
    try {
      if(!req.session.admin)return res.redirect("/login");
      res.render('admin/changepassword',
        {
         session:req.session.admin,
          title:"Change Password"
        });
    } catch (error) {
      console.log(error,'error')
    }
},
updatepassword: async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  try {
    if (!req.session.admin) return res.redirect("/login");
    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (newPassword !== confirmPassword) {
      req.flash("error", "New password and confirm password do not match");
      return res.status(400).json({ message: 'New password and confirm password do not match' });
    }
    const user = await db.users.findOne({ where: { id: req.session.admin.id } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      req.flash("error", "Old password is incorrect");
      return res.status(400).json({ message: 'Old password is incorrect' });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    req.session.admin.password = hashedPassword;
    req.flash("success", "Password updated successfully");
    res.redirect('/login'); 
  } catch (error) {
    console.error('Error updating password:', error);
    req.flash("error", "Server error");
    res.status(500).json({ message: 'Server error' });
  }
},

logout: async (req, res) => {
      try {
        req.session.destroy();
        res.redirect("/login");
      } catch (error) {
        return helper.error(res, error);
      }
},
user_list: async (req, res) => {  
    try {
      if (!req.session.admin) return res.redirect("/login");
      const data = await db.users.findAll({
        where: {
          role: "1",
        },
        raw: true,
      });
      res.render("admin/userlist", {
        title: "Users",
        data,
        session: req.session.admin,
      });
    } catch (error) {
      console.error("Error fetching user list:", error);
      res.status(500).json({ message: "Internal server error" });
    }
},
view: async (req, res) => {
    try {
      if (!req.session.admin) return res.redirect("/login");
 
      let view = await db.users.findOne({
        
        where: {
          id: req.params.id,
        },
      });
      res.render("admin/view.ejs", {
        session: req.session.admin,
        view,
        title:'User Detail',
        
       
      });
    } catch (error) {
      console.error("Error fetching view", error);
      
    }
},
user_delete: async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }
        const user = await db.users.findByPk(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        await db.users.destroy({ where: { id: userId } });

        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
},
user_status: async (req, res) => {
    try {
        const result = await db.users.update(
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

}