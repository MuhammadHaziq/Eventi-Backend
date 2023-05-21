const Event = require("../../models/Events");
const ObjectId = require("mongoose").Types.ObjectId;

const error = new Error();
error.status = "NOT_FOUND";
error.message = null;
error.data = null;

const eventFilters = (filters, user_id) => {
  if (filters) {
    if (filters.event_name) {
      filters.event_name = { $regex: filters.event_name, $options: "i" };
    } else {
      delete filters.event_name;
    }
    if (filters.event_location) {
      filters.event_location = {
        $regex: filters.event_location,
        $options: "i",
      };
    } else {
      delete filters.event_location;
    }
    if (filters.phone_number) {
      filters.phone_number = { $regex: filters.phone_number, $options: "i" };
    } else {
      delete filters.phone_number;
    }
    if (filters.special_request) {
      filters.special_request = {
        $regex: filters.special_request,
        $options: "i",
      };
    } else {
      delete filters.special_request;
    }
  }

  return { ...filters, created_by: user_id, deleted_at: null };
};

module.exports = {
  addEvent: async (body) => {
    const {
      event_name,
      event_date,
      event_location,
      vendor_id,
      type_of_event,
      expected_attendence,
      phone_number,
      equipments,
      security,
      special_request,
      user_id,
    } = body;

    const addEvent = new Event({
      created_by: user_id,
      event_name,
      event_date,
      event_location,
      vendor_id,
      type_of_event,
      expected_attendence,
      phone_number,
      equipments,
      security,
      special_request,
    });
    return await addEvent.save();
  },

  getEvents: async (body) => {
    const { user_id, perPage, page, tableFilters, sort } = body;
    const sorter = sort ? JSON.parse(sort) : null;
    const filters = tableFilters ? JSON.parse(tableFilters) : null;
    const startIndex = ((page || 1) - 1) * (perPage || 10);
    const totalRecord = await Event.find(
      eventFilters(filters, user_id)
    ).count();
    const tableRows = helper.pagination(totalRecord, page || 1, perPage || 10);
    const record = await Event.find(eventFilters(filters, user_id))
      .sort({ [sorter?.value || "createdAt"]: sorter?.state || -1 })
      .skip(startIndex)
      .limit(perPage || 10)
      .lean();
    tableRows.data = record;
    return tableRows;
  },

  getEvent: async (body) => {
    const { eventId } = body;

    return await Event.findOne({
      _id: new ObjectId(eventId),
      deleted_by: null,
    }).lean();
  },

  updateEvent: async (body) => {
    const {
      eventId,
      user_id,
      event_name,
      event_date,
      event_location,
      vendor_id,
      type_of_event,
      expected_attendence,
      phone_number,
      equipments,
      security,
      special_request,
    } = body;
    console.log(eventId, "eventId");
    return await Event.findOneAndUpdate(
      { _id: eventId },
      {
        event_name,
        event_date,
        event_location,
        vendor_id,
        type_of_event,
        expected_attendence,
        phone_number,
        equipments,
        security,
        special_request,
        updated_by: user_id,
      },
      { new: true }
    ).lean();
  },

  deleteEvent: async (body) => {
    const { user_id, eventId } = body;
    return await Event.findOneAndUpdate(
      { _id: new ObjectId(eventId), deleted_by: null },
      { deleted_by: user_id, deleted_at: new Date() }
    ).lean();
  },
};
