const customerNav = [
  { permission: "dashboard" },
  { permission: "customer-list" },
  { permission: "customer-edit" },
  { permission: "event-list" },
  { permission: "event-join" },
];

const vendorNav = [
  { permission: "dashboard" },
  { permission: "vendor-list" },
  { permission: "vendor-edit" },
  { permission: "event-list" },
  { permission: "event-join" },
  { permission: "event-add" },
  { permission: "product-list" },
  { permission: "product-add" },
  { permission: "product-edit" },
  { permission: "product-delete" },
];

const adminNav = [
  { permission: "dashboard" },
  { permission: "customer-add" },
  { permission: "customer-list" },
  { permission: "customer-edit" },
  { permission: "customer-delete" },
  { permission: "vendor-add" },
  { permission: "vendor-list" },
  { permission: "vendor-edit" },
  { permission: "vendor-delete" },
  { permission: "event-add" },
  { permission: "event-list" },
  { permission: "event-join" },
  { permission: "event-delete" },
  { permission: "product-list" },
  { permission: "product-add" },
  { permission: "product-edit" },
  { permission: "product-delete" },
];
module.exports = {
  adminNav,
  customerNav,
  vendorNav,
};