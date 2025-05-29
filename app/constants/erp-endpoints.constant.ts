export const ERP_ENDPOINT = {
  LOGIN: '/res_users/login',
  RESET_PASSWORD: '/res_users/reset_password',
  USERS: (id?: number) => `/users${id ? `/${id}` : ''}`,
  COUNT_CUSTOMERS: () => `/customers/count`,
  CUSTOMERS: (id?: number | string) => `/customers${id ? `/${id}` : ''}`,
  CONFIRM_CUSTOMER_INFO: (id: number | string) =>
    `/customers/${id}/confirm_info_partner`,
  UNCONFIRM_CUSTOMER_INFO: (id: number | string) =>
    `/customers/${id}/unconfirm_info_partner`,
  CUSTOMER_CONTACTS: (id: number | string) => `/customers/${id}/contacts`,
  CUSTOMER_AGENCIES: (id: number | string) => `/customers/${id}/agencies`,
  CUSTOMER_PRODUCTS: (id: number | string) => `/customers/${id}/products`,
  CUSTOMER_TAGS: () => `/customer/tags`,
  CUSTOMER_TOWNS: () => `/customer/towns`,
  CUSTOMER_COUNTRIES: () => `/customers/countries`,
  CUSTOMER_BUSINESS_COUNTRIES: () => `/customer/business_countries`,
  CUSTOMER_BUSINESS_STATES: () => `/customer/business_states`,
  CUSTOMER_BUSINESS_DISTRICTS: () => `/customer/business_districts`,
  CUSTOMER_SOURCES: () => `/customer/sources`,
  CUSTOMER_PRODUCT_CATEGORIES: () => `/customer/product_categories`,
  DISTRIBUTION_CHANNELS: () => `/distribution_channel`,
  CONTACT_LEVELS: () => `/contact_level`,
  LEADS: (id?: number | string) => `/leads${id ? `/${id}` : ''}`,
  LEAD_HISTORIES: (id: number | string) => `/leads/${id}/histories`,
  ROUTERS: (id?: number | string) => `/routers${id ? `/${id}` : ''}`,
  ROUTE_PLANS: (id?: number | string) => `/route_plans${id ? `/${id}` : ''}`,
  UPDATE_ROUTE_PLAN_STATE: (id: number | string, state: string) =>
    `/route_plans/${id}/${state}`,
  DETAIL_ROUTE_PLANS: (id?: number | string) =>
    `/details_route_plans${id ? `/${id}` : ''}`,
  ROUTERS_STORE: (id?: number | string) =>
    `/routers_store${id ? `/${id}` : ''}`,
  GROUP_EXHIBITIONS: (id?: number | string) =>
    `/group_exhibition${id ? `/${id}` : ''}`,
  ROUTE_CONFIG: (id?: number | string) => `/route_config${id ? `/${id}` : ''}`,
  SLA_SHOWCASE: (id?: number | string) => `/sla_showcase${id ? `/${id}` : ''}`,
  SLA_CRITERIA: (id?: number | string) => `/sla_criteria${id ? `/${id}` : ''}`,
  SHOWCASE_DECLARATIONS: (id?: number | string) =>
    `/showcase_declaration${id ? `/${id}` : ''}`,
  CONFIRM_SHOWCASE_DECLARATION: (id: number | string) =>
    `/showcase_declaration/${id}/confirm`,
  CHECK_IN_OUT: (id?: number | string) => `/checkin_out${id ? `/${id}` : ''}`,
  SLA_CHECK_IN: (id?: number | string) => `/sla_checkin${id ? `/${id}` : ''}`,
  STOCK_INVENTORY: (id?: number | string) =>
    `/stock_inventory${id ? `/${id}` : ''}`,
  STOCK_INVENTORY_LINES: (
    stockInventoryId?: number | string,
    lineId?: number | string,
  ) =>
    `/stock_inventory${stockInventoryId ? `/${stockInventoryId}` : ''}/lines${
      lineId ? `/${lineId}` : ''
    }`,
  CONFIRM_STOCK_INVENTORY: (id: number | string) =>
    `/stock_inventory/${id}/confirm`,
  PRODUCTS: (id?: number | string) => `/products${id ? `/${id}` : ''}`,
  CRM_TAGS: () => `/crm_tags`,
  CRM_STAGES: () => `/crm_stage`,
  EMPLOYEE_MAPS: (id?: number | string) =>
    `/employee_maps${id ? `/${id}` : ''}`,
  EMPLOYEE_MAPS_COUNT: () => `/employee_maps/count`,
  POS_ORDERS: (id?: number | string) => `/pos_orders${id ? `/${id}` : ''}`,
  UPDATE_POS_ORDER_STATE: (id: number | string, state: string) =>
    `/pos_orders/${id}/${state}`,
  SALE_ORDERS: (id?: number | string) => `/sale_orders${id ? `/${id}` : ''}`,
  UPDATE_SALE_ORDER_STATE: (id: number | string, state: string) =>
    `/sale_orders/${id}/${state}`,
  SALE_ORDER_CANCEL_REASONS: () => `/sale_order_cancel_reason`,
  PRODUCT_PRICE_LIST: () => `/product_pricelist`,
  STOCK_WAREHOUSES: () => `/stock_warehouse`,
  CRM_GROUPS: () => `/crm_group`,
  ACCOUNT_PAYMENT_TERMS: () => `/account_payment_term`,
  PROMOTION_PROGRAM: (id?: number | string) =>
    `/promotional_program${id ? `/${id}` : ''}`,
  CREATE_CHECK_IN_OUT_EXPLANATION: (id: number | string) =>
    `/checkin_out/${id}/explanation`,
  CHECK_IN_OUT_EXPLANATIONS: (id?: number | string) =>
    `/checkin_out_explanation${id ? `/${id}` : ''}`,
  UPDATE_CHECK_IO_EXPLANATION_STATUS: (id: number | string, status: string) =>
    `/checkin_out_explanation/${id}/${status}`,
  CHECK_IN_OUT_REASONS: () => `/reason_checkin_checkout`,
  VISIT_FREQUENCIES: () => `/frequency_visit`,
  AVAILABLE_INVENTORY_REPORT: () => `/available_inventory_report`,
  ATTENDANCES: (id?: number | string) => `/attendances${id ? `/${id}` : ''}`,
  TIMEKEEPING_EXPLANATIONS: (id?: number | string) =>
    `/timekeeping_explanation${id ? `/${id}` : ''}`,
  UPDATE_TIMEKEEPING_EXPLANATION_STATE: (id: number | string, status: string) =>
    `/timekeeping_explanation/${id}/${status}`,
  SUMMARY_REPORT: () => `/summary_report`,
  POS_ORDER_CANCEL_REASONS: () => `/pos_orders/reason_cancel`,
  POS_ORDER_PRODUCT_GIFT: (id?: number | string) =>
    `/pos_orders/${id}/product_gift`,
  SALE_ORDER_PRODUCT_GIFT: (id?: number | string) =>
    `/sale_orders/${id}/product_gift`,
  DMS_BANK: `/dms_bank`,
  PARTNER_BANK_ACCOUNT: (id?: number | string) =>
    `/partner_account_bank${id ? `/${id}` : ''}`,
  PROPOSAL_PRODUCT_RETURN: (id?: string) =>
    `/dms_proposal_product_returns${id ? `/${id}` : ''}`,
  ACCOUNT_TAX: (id?: number | string) => `/account_tax${id ? `/${id}` : ''}`,
  REASON_RETURN: (id?: number | string) =>
    `/dms_reason_return${id ? `/${id}` : ''}`,
  PROPOSAL_PRODUCT_RETURN_GROUP: () =>
    `/dms_proposal_product_returns/web_read_group`,

  PROPOSAL_PRODUCT_RETURN_CHANGE_STATE: () =>
    `/dms_proposal_product_returns/action`,
};
