const qrCodeService = require("../../services/qrCode/qrCodeService");

module.exports = {
   getQRCode: async (req, res) => {
    try {
      const body = {
      //   ...req.body,
      //   ...req.params,
        _id: req.params.cust_id,
        user_type: req.user.user_type,
      };
      const qrCode = await qrCodeService.getQRCode(body);
      if (qrCode)
        return helper.apiResponse(
          res,
          false,
          "QR Code Fetch Successfully",
          qrCode
        );
      return helper.apiResponse(res, true, "No QR Code Data Found", null);
    } catch (err) {
      const statusCode = err.status || "INTERNAL_SERVER_ERROR";
      return helper.apiResponse(res, true, err.message, null, statusCode);
    }
  },

};
