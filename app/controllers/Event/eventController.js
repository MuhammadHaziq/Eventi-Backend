const eventService = require("../../services/Event/eventServices");

module.exports = {
    addEvent:async(req, res)=> {
        try{
            const body = {...req.body, ...req.params, user_id:req.user_id};
            const newEvent = await eventService.addEvent(body);
            if(newEvent) return helper.apiResponse(res, false, "Event Created Successfully", newEvent);
            return helper.apiResponse(res, true, "Event Not Created Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    getEvents:async(req, res) => {
        try{
            const body = {...req.body, ...req.par, user_id:req.user_id};
            const events = await eventService.getEvents(body);
            if(events) return helper.apiResponse(res, false, "Events Fetch Successfully", events);
            return helper.apiResponse(res, true, "Events Not Fetch Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    getEvent:async(req, res) => {
        try{
            const body = {...req.body, ...req.par, user_id:req.user_id};
            const event = await eventService.getEvent(body);
            if(event) return helper.apiResponse(res, false, "Event Fetch Successfully", event);
            return helper.apiResponse(res, true, "Event Not Fetch Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    updateEvent:async(req, res) => {
        try{
            const body = {...req.body, ...req.par, user_id:req.user_id};
            const updatedEvent = await eventService.updateEvent(body);
            if(updatedEvent) return helper.apiResponse(res, false, "Event Updated Successfully", updatedEvent);
            return helper.apiResponse(res, true, "Event Not Updated Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    deleteEvent:async(req, res) => {
        try{
            const body = {...req.body, ...req.par, user_id:req.user_id};
            const deletedEvent = await eventService.deleteEvent(body);
            if(deletedEvent) return helper.apiResponse(res, false, "Event Deleted Successfully", deletedEvent);
            return helper.apiResponse(res, true, "Event Not Deleted Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },
}