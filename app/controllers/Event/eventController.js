const eventService = require("../../services/Event/eventServices");

module.exports = {
    addEvent:async(req, res)=> {
        try{
            const body = {...req.body, ...req.params};
            const newEvent = await eventService.addEvent(body);
            if(newEvent) helper.apiResponse(res, false, "Event Created Successfully", newEvent);
            helper.apiResponse(res, true, "Event Not Created Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    getEvents:async(req, res) => {
        try{
            const body = {...req.body, ...req.params};
            const events = await eventService.getEvents(body);
            if(events) helper.apiResponse(res, false, "Events Fetch Successfully", events);
            helper.apiResponse(res, true, "Events Not Fetch Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    getEvent:async(req, res) => {
        try{
            const body = {...req.body, ...req.params};
            const event = await eventService.getEvent(body);
            if(event) helper.apiResponse(res, false, "Event Fetch Successfully", event);
            helper.apiResponse(res, true, "Event Not Fetch Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    updateEvent:async(req, res) => {
        try{
            const body = {...req.body, ...req.params};
            const updatedEvent = await eventService.updateEvent(body);
            if(updatedEvent) helper.apiResponse(res, false, "Event Updated Successfully", updatedEvent);
            helper.apiResponse(res, true, "Event Not Updated Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },

    deleteEvent:async(req, res) => {
        try{
            const body = {...req.body, ...req.params};
            const deletedEvent = await eventService.deleteEvent(body);
            if(deletedEvent) helper.apiResponse(res, false, "Event Deleted Successfully", deletedEvent);
            helper.apiResponse(res, true, "Event Not Deleted Successfully", null);
        }catch(err){
            const statusCode = err.status || 'INTERNAL_SERVER_ERROR';
            return helper.apiResponse(res, true, err.message, null, statusCode);
        }
    },
}