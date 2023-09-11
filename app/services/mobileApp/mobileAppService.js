const ObjectId = require("mongoose").Types.ObjectId;
const Events = require("../../models/events");
const Orders = require("../../models/order");
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
        customer_points_available: joined_customer.points_available,
        customer_points_consumed: joined_customer.customer_consumed_point,
      };
      return data;
    } else {
      return null;
    }
  },
  consumeCustomerPoints: async (body) => {
    try {
      const { 
        event_id, 
        customer_id, 
        pointsConsumed, items_order } = body;
      
      const itemOrderData = {
        event_id,
        customer_id,
        consumed_points: pointsConsumed,
       items_order
      }

      const itemOrderObj = new Orders(itemOrderData)
      console.log(itemOrderObj)
      await itemOrderObj.save();

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
        const joined_customer_data = JSON.parse(JSON.stringify(response.joined_customers));
        const customerIndex = joined_customer_data.findIndex(customer => customer.customer_id._id == customer_id);
        if (customerIndex !== -1) {
          console.log(customerIndex)
          const customer = joined_customer_data[customerIndex];
  
          if (customer.points_available === customer.customer_consumed_point) {
            return "No more points available";
          } else {
            customer.customer_consumed_point = parseInt(customer.customer_consumed_point) + parseInt(pointsConsumed);
            console.log(customer);
  
            // Update the original data in the array customerIndex=0
            joined_customer_data[customerIndex] = customer;
  
            // Update the database with the modified array
            const data = await Events.updateOne(
              {
                _id: new ObjectId(event_id)
              },
              {
                $set: {
                  "joined_customers": joined_customer_data,
                },
              },
              { upsert: true, new: true }
            );
            return "Data updated successfully";
          }
        } else {
          return "Customer not found in the event";
        }
      } else {
        return "No data found for the event";
      }
    } catch (error) {
      console.log(error);
    }
  }
  
};
module.exports = mobileAppService;
