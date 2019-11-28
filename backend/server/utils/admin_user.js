require('../config/config');
const User = require('../models/user');

createAdminUser = async () => {
    try {
        const userDB = await User.findOne({
            username: 'dxestion'
        });
        if (userDB) {
            console.log('Admin user already exists');
        } else {
            let user = new User({
                name: 'dxestion',
                email: 'soporte@dxestion.com',
                password: 'Dxestion0180',
                username: 'dxestion',
                database_url: '-',
                database_name: '-',
                database_port: '-',
                database_username: '-',
                database_password: '-',
                role: 'ADMIN_ROLE'
            });

            const savedUser = await user.save();
            if (savedUser) {
                /* All OK */
                console.log('Admin user created sucessfully');
            } else {
                console.log('Error saving admin user');
            }
        }
    } catch (err) {
        console.log('Error creating admin user');
    }
};

module.exports = createAdminUser();