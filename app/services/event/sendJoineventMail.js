const { generateAndSendEmail } = require("../../util/joinEventEmail");

module.exports = {
  sendJoinEventMail: async (item, eventDetail) => {
    return generateAndSendEmail({
      to: item?.email,
      subject: `Welcome To ${eventDetail?.event_name} Event`,
      title: `${item?.first_name + " " + item?.last_name} is Joining The ${
        eventDetail?.event_name
      }`,
      text: item?.new
        ? `Welcome ${
            item?.first_name + " " + item?.last_name
          } New User Is Created With ${
            item?.email
          } And Your Password Is 12345678.`
        : `${item?.first_name + " " + item?.last_name} Joined The ${
            eventDetail?.event_name
          }`,
      link: `${process.env.CLIENT_URL}#/join-event/${item?.account_id}/${eventDetail?._id}`,
      buttonText: "Check Event Detail",
    });
  },
};
