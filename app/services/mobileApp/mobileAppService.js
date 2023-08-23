const ObjectId = require("mongoose").Types.ObjectId;
const Events = require("../../models/events");
const JoinedEvents = require("../../models/joinedEvents");

const error = new Error();
error.status = "NOT_FOUND";
error.message = null;
error.data = null;

const getCurrentDate = () => {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, "0");
  var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
  var yyyy = today.getFullYear();
  today = `${yyyy}-${mm}-${dd}`;
  return today;
};
const mobileAppService = {
  getVendorEvents: async (body) => {
    const { vendor_id } = body;
    const response = await Events.find({
      "joined_vendors.vendor_id": new ObjectId(vendor_id),
      event_start_date: { $lte: getCurrentDate() },
      event_end_date: { $gte: getCurrentDate() },
      deleted_at: { $eq: null },
    })
      .populate("joined_vendors.vendor_id")
      .lean();

    if (response) {
      const data = response.map((event) => {
        return {
          event_id: event._id,
          name: event.event_name,
          event_image: event.banner_images.length > 0 ? 
            `/media/eventImage/${event._id}/${event.banner_images[0]}` : '',
          type: event.type_of_event,
          location: event.event_location,
        };
      });
      return data;
    } else {
      return null;
    }
  },
  getVendorEventProducts: async (body) => {
    const { event_id, vendor_id } = body;

    const response = await JoinedEvents.find({
      event_id: new ObjectId(event_id),
      account_id: new ObjectId(vendor_id),
      deleted_at: { $eq: null },
    }).populate("products.product_id");
    const products = [];
    console.log(response);
    if (response) {
      response.map((joinedEvent) => {
        return joinedEvent.products.map((product) => {
          const prod = product.product_id;
          return products.push({
            id: prod._id,
            name: prod.product_name,
            points: prod.product_points,
            image: prod.product_images.length > 0 ? 
            `/media/productImage/${prod._id}/${prod.product_images[0]}` : '',
            // 
          });
        });
      });
      return products;
    } else {
      return null;
    }
  },
  getCustomer: async (body) => {
    const { event_id, customer_id } = body;
    const response = await Events.findOne({
      _id: new ObjectId(event_id),
      "joined_customers.customer_id": new ObjectId(customer_id),
      event_start_date: { $lte: getCurrentDate() },
      event_end_date: { $gte: getCurrentDate() },
      deleted_at: { $eq: null },
    })
      .populate("joined_customers.customer_id")
      .lean();

    if (response) { 
      const joined_customer = response.joined_customers[0];
      const account = response.joined_customers[0].customer_id;
      const customer = account.user_detail;
      const data = {
        account_id: account._id,
        event_id: response._id,
        event_name: response.event_name,
        event_image: response.banner_images.length > 0 ? 
            `/media/eventImage/${response._id}/${response.banner_images[0]}` : '',
        customer_id: customer._id,
        customer_name: `${customer.first_name} ${customer.last_name}`,
        customer_email: customer.email,
        customer_phone: customer.phone_number,
        customer_pooints_available: joined_customer.points_available,
      };
      return data;
    } else {
      return null;
    }
  },
};
module.exports = mobileAppService;
