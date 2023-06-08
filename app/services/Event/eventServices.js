const Event = require("../../models/Events");
const ObjectId = require("mongoose").Types.ObjectId;
const { uploadImages } = require("../../../utils/fileHandler");
const error = new Error();
error.status = "NOT_FOUND";
error.message = null;
error.data = null;

const eventFilters = (filters, authAccount) => {
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
  // created_by: authAccount,
  return { ...filters, deleted_at: { $eq: null } };
};

module.exports = {
  addEvent: async (body) => {
    const {
      event_name,
      event_date,
      event_location,
      banner_images,
      type_of_event,
      expected_attendence,
      phone_number,
      equipments,
      security,
      special_request,
      authAccount,
    } = body;
    let images = null;
    const bannerImages = body.files ? body.files.banner_images : null;
    if (bannerImages) {
      let response = await uploadImages(
        bannerImages,
        `eventImage/${authAccount}`
      );
      if (response.images.length) {
        images = response.images;
      } else {
        error.status = "BAD_REQUEST";
        error.message = response?.message;
        error.data = null;
        throw error;
      }
    }
    const addEvent = new Event({
      created_by: authAccount,
      event_name,
      event_date,
      event_location,
      banner_images: images,
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
    const { authAccount, perPage, page, tableFilters, sort } = body;
    const sorter = sort ? JSON.parse(sort) : null;
    const filters = tableFilters ? JSON.parse(tableFilters) : null;
    const startIndex = ((page || 1) - 1) * (perPage || 10);
    const totalRecord = await Event.find(
      eventFilters(filters, authAccount)
    ).count();
    const tableRows = helper.pagination(totalRecord, page || 1, perPage || 10);
    const record = await Event.find(eventFilters(filters, authAccount))
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
      deleted_by: { $eq: null },
    }).lean();
  },

  updateEvent: async (body) => {
    const {
      eventId,
      authAccount,
      event_name,
      event_date,
      event_location,
      banner_images,
      type_of_event,
      expected_attendence,
      phone_number,
      equipments,
      security,
      special_request,
    } = body;
    let images = null;
    // banner_images && JSON.parse(banner_images);
    const bannerImages = body.files ? body.files.banner_images : null;

    if (bannerImages) {
      let response = await uploadImages(
        bannerImages,
        `eventImage/${authAccount}`
      );
      if (response.images.length) {
        images = { banner_images: response.images };
      } else {
        error.status = "BAD_REQUEST";
        error.message = response?.message;
        error.data = null;
        throw error;
      }
    }
    return await Event.findOneAndUpdate(
      { _id: eventId },
      {
        event_name,
        event_date,
        event_location,
        ...images,
        type_of_event,
        expected_attendence,
        phone_number,
        equipments,
        security,
        special_request,
        updated_by: authAccount,
      },
      { new: true }
    ).lean();
  },

  deleteEvent: async (body) => {
    const { authAccount, eventId } = body;
    return await Event.findOneAndUpdate(
      { _id: new ObjectId(eventId), deleted_by: { $eq: null } },
      { deleted_by: authAccount, deleted_at: new Date() },
      { new: true }
    ).lean();
  },

  joinEvent: async (body) => {
    const { account_id, event_id } = body;
    return await Event.updateOne(
      { _id: new ObjectId(event_id) },
      {
        $push: {
          joined_vendors: new ObjectId(account_id),
        },
      }
    );
  },

  customerJoinEvent: async (body) => {
    const { account_id, eventId } = body;
    return await Event.updateOne(
      { _id: new ObjectId(eventId) },
      {
        $push: {
          joined_customers: new ObjectId(account_id),
        },
      }
    );
  },
};
