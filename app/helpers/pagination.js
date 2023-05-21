module.exports = (Total, page, limit) => {
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const tableRows = {};

  tableRows.meta = {
    hasNextPage: false,
    hasPreviousPage: false,
    itemCount: Total,
    page: page,
    pageCount: Math.ceil(Total / limit),
    take: limit,
  };
  if (endIndex < Total) {
    tableRows.meta.hasNextPage = true;
  }
  if (startIndex > 0) {
    tableRows.meta.hasPreviousPage = true;
  }
  return tableRows;
};
