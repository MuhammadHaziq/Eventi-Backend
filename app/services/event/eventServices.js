const Event = require("../../models/events");
const {
  uploadImages,
  removeFiles,
  removeAllFiles,
} = require("../../../utils/fileHandler");
const Payment = require("../../models/payment");
const ObjectId = require("mongoose").Types.ObjectId;
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

const eventService = {
  addEvent: async (body) => {
    const {
      event_name,
      event_date,
      amount,
      event_location,
      type_of_event,
      expected_attendence,
      phone_number,
      equipments,
      security,
      special_request,
      authAccount,
    } = body;
    try {
      const addEvent = new Event({
        created_by: authAccount,
        event_name,
        event_date,
        amount,
        event_location,
        type_of_event,
        expected_attendence,
        phone_number,
        equipments,
        security,
        special_request,
      });

      const insertedEvent = await addEvent.save();
      if (insertedEvent) {
        const bannerImages = body.files ? body.files.banner_images : null;
        const eventId = insertedEvent?._id;
        console.log(eventId, "eventId");
        const images = await eventService.saveImages(bannerImages, eventId);
        console.log(images, "images");
        return await Event.findOneAndUpdate(
          {
            _id: eventId,
          },
          {
            banner_images: images,
            updated_by: authAccount,
          },
          { new: true }
        ).lean();
      }
    } catch (err) {
      error.status = "BAD_REQUEST";
      error.message = err?.message;
      error.data = null;
      throw error;
    }
  },

  getEvents: async (body) => {
    const { authAccount, perPage, page, tableFilters, sort } = body;
    const sorter = sort ? JSON.parse(sort) : null;
    const filters = tableFilters ? JSON.parse(tableFilters) : null;
    const startIndex = ((page || 1) - 1) * (perPage || 10);
    /** Query Filters */
    const eventFilter = eventFilters(filters, authAccount);
    const totalRecord = await Event.find(eventFilter).count();
    const tableRows = helper.pagination(totalRecord, page || 1, perPage || 10);
    /** Query Get Record */
    const record = await Event.find(eventFilter)
      .sort({ [sorter?.value || "createdAt"]: sorter?.state || -1 })
      .skip(startIndex)
      .limit(perPage || 10)
      .lean();
    tableRows.data = record;
    return tableRows;
  },

  getEvent: async (body) => {
    const { eventId, user_type } = body;
    if (user_type !== "vendor") {
      return await Event.findOne({
        _id: new ObjectId(eventId),
        deleted_by: { $eq: null },
      })
        .populate("joined_customers.customer_id")
        .populate("joined_vendors.vendor_id")
        .lean();
    }
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
      amount,
      event_location,
      type_of_event,
      expected_attendence,
      phone_number,
      equipments,
      security,
      special_request,
      removed_files,
    } = body;

    try {
      /** Delete Files First */
      if (JSON.parse(removed_files) && JSON.parse(removed_files)?.length > 0) {
        await eventService.deleteImages(JSON.parse(removed_files), eventId);
      }

      const bannerImages = body.files ? body.files.banner_images : null;
      let images = await eventService.saveImages(bannerImages, eventId);

      const dbImages =
        (await eventService.getEventImages(eventId))?.[0]?.banner_images || [];

      images = [
        ...(images || []),
        ...(dbImages || []).filter(function (obj) {
          return (removed_files || []).indexOf(obj) == -1;
        }),
      ];
      return await Event.findOneAndUpdate(
        { _id: eventId },
        {
          event_name,
          event_date,
          amount,
          event_location,
          banner_images: images,
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
    } catch (err) {
      error.status = "BAD_REQUEST";
      error.message = err?.message;
      error.data = null;
      throw error;
    }
  },

  deleteEvent: async (body) => {
    const { authAccount, eventId } = body;
    await eventService.deleteAllImages(eventId);
    return await Event.findOneAndUpdate(
      { _id: new ObjectId(eventId), deleted_by: { $eq: null } },
      { deleted_by: authAccount, deleted_at: new Date() },
      { new: true }
    ).lean();
  },

  getEventImages: async (eventId) => {
    return Event.find({ _id: new ObjectId(eventId) }).select("banner_images");
  },

  deleteImages: async (fileNames, eventId) => {
    let response = await removeFiles(fileNames, `eventImage/${eventId}`);
    if (response.success === true) {
      return response.images;
    } else {
      error.status = "BAD_REQUEST";
      error.message = response?.message;
      error.data = null;
      throw error;
    }
    return [];
  },

  saveImages: async (files, eventId) => {
    const bannerImages = files ? files : null;
    if (bannerImages) {
      let response = await uploadImages(bannerImages, `eventImage/${eventId}`);
      if (response.success === true) {
        return response.images;
      } else {
        error.status = "BAD_REQUEST";
        error.message = response?.message;
        error.data = null;
        throw error;
      }
    } else {
      return [];
    }
  },

  deleteAllImages: async (eventId) => {
    return await removeAllFiles(`eventImage/${eventId}`);
  },

  joinEvent: async (body) => {
    const { account_id, event_id, status } = body;
    if (status === "remove") {
      return await Event.updateOne(
        { _id: new ObjectId(event_id) },
        {
          $pull: {
            "joined_vendors.vendor_id": new ObjectId(account_id),
          },
        }
      );
    } else if (status === "Request To Join") {
      return await Event.updateOne(
        { _id: new ObjectId(event_id) },
        {
          $push: {
            joined_vendors: {
              vendor_id: new ObjectId(account_id),
              event_status: status,
            },
          },
        }
      );
    } else {
      return await Event.updateOne(
        {
          _id: new ObjectId(event_id),
          "joined_vendors.vendor_id": new ObjectId(account_id),
        },
        {
          $set: {
            "joined_vendors.$.event_status": status,
          },
        }
      );
    }
  },

  customerJoinEvent: async (body) => {
    const { account_id, eventId, status } = body;
    if (status === "remove") {
      return await Event.updateOne(
        { _id: new ObjectId(eventId) },
        {
          $pull: {
            "joined_customers.customer_id": new ObjectId(account_id),
          },
        }
      );
    } else if (status === "Request To Join") {
      return await Event.updateOne(
        { _id: new ObjectId(eventId) },
        {
          $push: {
            joined_customers: {
              customer_id: new ObjectId(account_id),
              event_status: status,
            },
          },
        }
      );
    } else {
      return await Event.updateOne(
        {
          _id: new ObjectId(eventId),
          "joined_customers.customer_id": new ObjectId(account_id),
        },
        {
          $set: {
            "joined_customers.$.event_status": status,
          },
        }
      );
    }
  },

  updateCustomerStatus: async (body) => {
    const { authAccount, eventId, status, customer_id } = body;
    if (status === "remove") {
      return await Event.updateOne(
        { _id: new ObjectId(eventId) },
        {
          $pull: {
            "joined_customers.customer_id": new ObjectId(customer_id),
          },
        }
      );
    } else if (status === "Request To Join") {
      return await Event.updateOne(
        { _id: new ObjectId(eventId) },
        {
          $push: {
            joined_customers: {
              customer_id: new ObjectId(customer_id),
              event_status: status,
            },
          },
        }
      );
    } else {
      return await Event.updateOne(
        {
          _id: new ObjectId(eventId),
          "joined_customers.customer_id": new ObjectId(customer_id),
        },
        {
          $set: {
            "joined_customers.$.event_status": status,
            "joined_customers.$.approved_by": new ObjectId(authAccount),
          },
        }
      );
    }
  },

  approvedCustomerStatus: async (body) => {
    const {
      authAccount,
      eventId,
      status,
      customer_id,
      amount,
      currency,
      payment_id,
    } = body;
    if (status === "Approved") {
      const addPayment = new Payment({
        account_id: customer_id,
        event_id: eventId,
        amount: amount,
        currency: currency,
        payment_id: payment_id,
        updated_by: authAccount,
      });
      await addPayment.save();
      return await Event.updateOne(
        { _id: new ObjectId(eventId) },
        {
          $push: {
            joined_customers: {
              customer_id: new ObjectId(customer_id),
              event_status: status,
              approved_by: new ObjectId(authAccount),
            },
          },
        }
      );
      // return await Event.findOneAndUpdate(
      //   {
      //     _id: new ObjectId(eventId),
      //     "joined_customers.customer_id": new ObjectId(customer_id),
      //   },
      //   {
      //     $set: {
      //       "joined_customers.$.event_status": status,
      //       "joined_customers.$.approved_by": new ObjectId(authAccount),
      //     },
      //   },
      //   { upsert: true }
      // );
    }
    error.status = "BAD_REQUEST";
    error.message = "Status Not Updated";
    error.data = null;
    throw error;
  },

  updateVendorStatus: async (body) => {
    const { authAccount, eventId, status, vendor_id } = body;
    if (status === "remove") {
      return await Event.updateOne(
        { _id: new ObjectId(eventId) },
        {
          $pull: {
            "joined_vendors.vendor_id": new ObjectId(vendor_id),
          },
        }
      );
    } else if (status === "Request To Join") {
      return await Event.updateOne(
        { _id: new ObjectId(eventId) },
        {
          $push: {
            joined_vendors: {
              vendor_id: new ObjectId(vendor_id),
              event_status: status,
            },
          },
        }
      );
    } else {
      return await Event.updateOne(
        {
          _id: new ObjectId(eventId),
          "joined_vendors.vendor_id": new ObjectId(vendor_id),
        },
        {
          $set: {
            "joined_vendors.$.event_status": status,
            "joined_vendors.$.approved_by": new ObjectId(authAccount),
          },
        }
      );
    }
  },

  approvedVendorStatus: async (body) => {
    const {
      authAccount,
      eventId,
      status,
      vendor_id,
      amount,
      currency,
      payment_id,
    } = body;
    if (status === "Approved") {
      const addPayment = new Payment({
        account_id: vendor_id,
        event_id: eventId,
        amount: amount,
        currency: currency,
        payment_id: payment_id,
        updated_by: authAccount,
      });
      await addPayment.save();
      return await Event.updateOne(
        {
          _id: new ObjectId(eventId),
          "joined_vendors.vendor_id": new ObjectId(vendor_id),
        },
        {
          $set: {
            "joined_vendors.$.event_status": status,
            "joined_vendors.$.approved_by": new ObjectId(authAccount),
          },
        }
      );
    }
    error.status = "BAD_REQUEST";
    error.message = "Status Not Updated";
    error.data = null;
    throw error;
  },
};

module.exports = eventService;
