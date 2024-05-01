var BASE = {
  /**
   * @description api请求基础路径
   */
  API_DEV: {
    common: "http://localhost:8890",
    buyer: "http://localhost:8888",
    seller: "http://localhost:8889",
    manager: "http://localhost:8887"
      // common: "https://common-api.weeesell.com",
      // buyer: "https://buyer-api.weeesell.com",
      // seller: "https://store-api.weeesell.com",
      // manager: "https://admin-api.weeesell.com"
    },
    API_PROD: {
      common: "https://common-api.weeesell.com",
      buyer: "https://buyer-api.weeesell.com",
      seller: "https://store-api.weeesell.com",
      manager: "https://admin-api.weeesell.com"
    },

  /**
   * @description // 跳转买家端地址 pc端
   */
  PC_URL: "https://pc-b2b2c.weeesell.com",
  /**
   * @description  // 跳转买家端地址 wap端
   */
  WAP_URL: "https://m-b2b2c.weeesell.com",
  /**
   *  @description api请求基础路径前缀
   */
  PREFIX: "/store",
};
