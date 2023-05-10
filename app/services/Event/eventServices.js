const Event = require("../../models/Events");

const error = new Error();
error.status = 'NOT_FOUND';
error.message = null;
error.data = null;

module.exports = {
    addEvent:async(body)=> {
        const { event_name, event_date, event_location, vendor_id, type_of_event, expected_attendence, phone_number, equipments, security, special_request, user_id} = body;
        
        const addEvent = new Event({
            created_by:user_id, event_name, event_date, event_location, vendor_id, type_of_event, expected_attendence, phone_number, equipments, security, special_request
        });
        return await addEvent.save();
    },

    getEvents:async()=> {
        return await Event.find({deleted_by:null}).sort({createdAt:-1}).lean()
    },

    getEvent:async(body)=> {
        const {eventId} = body;
        return await Event.find({_id:eventId, deleted_by:null}).lean()
    },

    updateEvent:async(body) => {
        const {eventId, user_id, event_name, event_date, event_location, vendor_id, type_of_event, expected_attendence, phone_number, equipments, security, special_request} = body;
       return await Event.findOneAndUpdate({_id:eventId, created_by:user_id},{ event_name, event_date, event_location, vendor_id, type_of_event, expected_attendence, phone_number, equipments, security, special_request },{new:true}).lean();
    },

    deleteEvent:async(body)=> {
        const {user_id, eventId} = body;
        return await Event.findOneAndUpdate({_id:eventId}, {deleted_by:user_id, deleted_at:new Date()}).lean();
    }
}