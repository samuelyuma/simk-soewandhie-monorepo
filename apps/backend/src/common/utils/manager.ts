const ResponseManager = {
  createResponseMeta(page: number, totalItems: number, totalPages: number) {
    return {
      current_page: page,
      total_records: totalItems,
      total_pages: totalPages,
      has_next_page: page < totalPages,
      has_prev_page: page > 1,
      next_page: page < totalPages ? page + 1 : null,
      prev_page: page > 1 ? page - 1 : null,
    };
  },
};

export { ResponseManager };
