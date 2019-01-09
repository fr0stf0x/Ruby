export const createQuotation = navigation =>
  navigation.navigate("CreateQuotation");

export const goToDetail = agencyId => navigation =>
  navigation.navigate("QuotationDetail", { id: agencyId });
