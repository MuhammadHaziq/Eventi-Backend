const userService = require("../../services/User/userServices");

module.exports = {
    addUser:async(req, res)=> {
        try{
            const body = {...req.body, ...req.params};
            const newUser = await userService.addUser(body);
            if(newUser) helper.apiResponse(res, false, "User Created Successfully", newUser);
            helper.apiResponse(res, true, "User Not Created Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    getUsers:async(req, res) => {
        try{
            const body = {...req.body, ...req.params};
            const users = await userService.getUsers(body);
            if(users) helper.apiResponse(res, false, "Users Fetch Successfully", users);
            helper.apiResponse(res, true, "Users Not Fetch Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    getUser:async(req, res) => {
        try{
            const body = {...req.body, ...req.params};
            const user = await userService.getUser(body);
            if(user) helper.apiResponse(res, false, "User Fetch Successfully", user);
            helper.apiResponse(res, true, "User Not Fetch Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    updateUser:async(req, res) => {
        try{
            const body = {...req.body, ...req.params};
            const updatedProduct = await userService.updateUser(body);
            if(updatedProduct) helper.apiResponse(res, false, "User Updated Successfully", updatedProduct);
            helper.apiResponse(res, true, "User Not Updated Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    deleteUser:async(req, res) => {
        try{
            const body = {...req.body, ...req.params};
            const deletedUser = await userService.deleteUser(body);
            if(deletedUser) helper.apiResponse(res, false, "User Deleted Successfully", deletedUser);
            helper.apiResponse(res, true, "User Not Deleted Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },
}