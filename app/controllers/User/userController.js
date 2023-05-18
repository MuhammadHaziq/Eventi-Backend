const userService = require("../../services/User/userServices");

module.exports = {
    login:async(req, res) => {
        try{
            const body = {...req.body, ...req.params};
            const token = await userService.login(body);
            if(token) return helper.apiResponse(res, false, "User Login Successfully", token);
            return helper.apiResponse(res, true, "User Not Login Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    addUser:async(req, res)=> {
        try{
            const body = {...req.body, ...req.params};
            const newUser = await userService.addUser(body);
            if(newUser) return helper.apiResponse(res, false, "User Created Successfully", newUser);
            return helper.apiResponse(res, true, "User Not Created Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    getUsers:async(req, res) => {
        try{
            const body = {...req.body, ...req.params, user_id:req.user_id};
            const users = await userService.getUsers(body);
            if(users) return helper.apiResponse(res, false, "Users Fetch Successfully", users);
            return helper.apiResponse(res, true, "Users Not Fetch Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    getUser:async(req, res) => {
        try{
            const body = {...req.body, ...req.params, user_id:req.user_id};
            const user = await userService.getUser(body);
            if(user && user?.length >0) return helper.apiResponse(res, false, "User Fetch Successfully", user);
            return helper.apiResponse(res, true, "User Not Fetch Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    updateUser:async(req, res) => {
        try{
            const body = {...req.body, ...req.params, user_id:req.user_id};
            const updatedProduct = await userService.updateUser(body);
            if(updatedProduct) return helper.apiResponse(res, false, "User Updated Successfully", updatedProduct);
            return helper.apiResponse(res, true, "User Not Found", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    deleteUser:async(req, res) => {
        try{
            const body = {...req.body, ...req.params, user_id:req.user_id};
            const deletedUser = await userService.deleteUser(body);
            if(deletedUser) return helper.apiResponse(res, false, "User Deleted Successfully", deletedUser);
            return helper.apiResponse(res, true, "User Not Found", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },
}