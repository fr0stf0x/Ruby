const appConstants = {
  mode: {
    MODE_COMPANY: "mode_company",
    MODE_AGENCY: "mode_agency",
    MODE_RETAIL: "mode_retail"
  },
  groupType: {
    COMPANY: "company",
    RETAIL: "retail",
    AGENCY: "agency"
  },
  collection: {
    groupType: {
      company: "companies",
      agency: "agencies",
      retail: "retailers"
    },
    CHILDREN: "children",
    GROUPS: "groups",
    PRODUCTS: "products",
    QUOTATIONS: "quotations",
    ORDERS: "orders",
    USERS: "users"
  },
  dataEndpoint: {
    PARENT: "parent",
    USER_PROFILE: "userProfile",
    GROUP_INFO: "groupInfo"
  },
  productItemContext: {
    IN_CART: "in_cart",
    SHOW: "show",
    ADD_TO_AGENCY: "addProducts",
    QUOTATION: "quotation",
    ORDER: "order"
  }
};

export default appConstants;
