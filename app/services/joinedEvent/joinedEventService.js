const appConfig = require("../../../config/appConfig");
const JoinedEvent = require("../../models/joinedEvents");
const eventService = require("../event/eventServices");
const ObjectId = require("mongoose").Types.ObjectId;
const error = new Error();
error.status = "NOT_FOUND";
error.message = null;
error.data = null;

const productFilters = (filters, user_type, authAccount) => {
  if (filters) {
    if (filters.product_name) {
      filters.product_name = { $regex: filters.product_name, $options: "i" };
    } else {
      delete filters.product_name;
    }
    if (!filters.product_price) {
      delete filters.product_price;
    }
    if (!filters.product_quantity) {
      delete filters.product_quantity;
    }
  }

  if (user_type !== "admin") {
    filters = { created_by: authAccount };
  }

  return { ...filters, deleted_by: { $eq: null } };
};

const joinedEventService = {
  addVendorJoinedEvent: async (body) => {
    const { account_id, event_id, products, authAccount } = body;
    const joinedEvent = await joinedEventService.checkEventJoined(body);
    if (!joinedEvent) {
      await eventService.joinEvent(body);
      const newJoinedVendor = new JoinedEvent({
        event_id,
        account_id,
        products,
        created_by: authAccount,
      });
      return await newJoinedVendor.save();
    }
    error.status = "VALIDATION_ERR";
    error.message = "Event Already Joined";
    throw error;
  },

  getJoinedEvent: async (body) => {
    const { account_id, event_id } = body;
    return await JoinedEvent.findOne({
      event_id: new ObjectId(event_id),
      account_id: account_id,
      deleted_by: { $eq: null },
    }).lean();
  },

  //   getJoinedVendor: async (body) => {
  //     const {
  //       authAccount,
  //       perPage,
  //       page,
  //       tableFilters,
  //       sort,
  //       user_type,
  //       no_limit,
  //     } = body;
  //     const sorter = sort ? JSON.parse(sort) : null;
  //     const filters = tableFilters ? JSON.parse(tableFilters) : null;
  //     const totalRecord = await JoinedEvent.find(
  //       productFilters(filters, user_type, authAccount)
  //     ).count();
  //     const startIndex = ((page || 1) - 1) * (perPage || 10);
  //     const tableRows = helper.pagination(totalRecord, page || 1, perPage || 10);
  //     const record = await JoinedEvent.find(
  //       productFilters(filters, user_type, authAccount)
  //     )
  //       .sort({ [sorter?.value || "createdAt"]: sorter?.state || -1 })
  //       .skip(startIndex)
  //       .limit(no_limit ? "" : perPage || 10)
  //       .lean();
  //     tableRows.data = record;
  //     return tableRows;
  //   },

  //   getProduct: async (body) => {
  //     const { authAccount, product_id } = body;
  //     return await Product.findOne({
  //       _id: product_id,
  //       created_by: authAccount,
  //       deleted_at: { $eq: null },
  //     }).lean();
  //   },

  updateJoinedEvent: async (body) => {
    const { products, authAccount, joined_event_id } = body;
    const updatedJoinedEvent = await JoinedEvent.findOneAndUpdate(
      { _id: joined_event_id, deleted_at: { $eq: null } },
      {
        products,
        updated_by: authAccount,
      },
      { new: true }
    ).lean();
    return updatedJoinedEvent;
  },

  //   deleteProduct: async (body) => {
  //     const { authAccount, product_id } = body;
  //     return await Product.findOneAndUpdate(
  //       { _id: product_id, deleted_at: { $eq: null } },
  //       { deleted_by: authAccount, deleted_at: new Date() },
  //       { new: true }
  //     ).lean();
  //   },

  checkEventJoined: async (body) => {
    const { event_id, account_id } = body;
    return await JoinedEvent.findOne({
      event_id: event_id,
      account_id: account_id,
    }).lean();
  },
};
module.exports = joinedEventService;
