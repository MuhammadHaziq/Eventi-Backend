const ObjectId = require("mongoose").Types.ObjectId;
const mongoose = require("mongoose")
const Events = require("../../models/events");
 

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
const dashboardService = {
   getCustomerDashboard: async (body) => {
      
      try {
         
         const { event_id, customer_id } = body;

         if (!mongoose.Types.ObjectId.isValid(event_id) || !ObjectId.isValid(customer_id)) {
            
            throw ({ message: "event_id or customer_id is not valid" })
         
         }
         
        
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
          const customerData = response.joined_customers.find(customer => 
            customer.customer_id._id.toString() === customer_id
          );
          if (customerData) {
            const totalPoints =
              parseInt(customerData.customer_consumed_point) +
              parseInt(customerData.points_available);
            customerData.totalPoints = totalPoints;
    
            // Filter and keep only the desired fields
            const filteredData = {
              points_available: customerData.points_available,
              customer_consumed_point: customerData.customer_consumed_point,
              totalPoints: customerData.totalPoints,
            };
    
            return filteredData;
          } else {
            return null; // Customer not found in joined_customers array
          }
        } else {
          return null; // Event not found
        }
      } catch (error) {
         throw error;
       
        console.log(error);
      }
    },
    
    
//    getCustomerDashboard: async (body) => {
//       try {
//          const { event_id, customer_id } = body;
//          const response = await Events.findOne({
//            _id: new ObjectId(event_id),
//            "joined_customers.customer_id": new ObjectId(customer_id),
//            event_start_date: { $lte: getCurrentDate() },
//            event_end_date: { $gte: getCurrentDate() },
//            deleted_at: { $eq: null },
//          })
//            .populate("joined_customers.customer_id")
//            .lean();
//          if (response) {
//            const joined_customer_data = JSON.parse(JSON.stringify(response.joined_customers));
//            joined_customer_data.filter(customer => {
//              if (customer.customer_id._id == new mongoose.Types.ObjectId(customer_id)) {
//                const totalPoints = parseInt(customer.customer_consumed_point) + parseInt(customer.points_available)
//                 customer.totalPoints = totalPoints;
//                return customer
//              };
//            })
//            return joined_customer_data;
//          } else {
//            return null;
//          }
//        }
//        catch (error) {
//          console.log(error)
//        }
//   },
};
module.exports = dashboardService;
