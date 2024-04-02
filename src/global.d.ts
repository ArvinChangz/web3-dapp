interface Window {
    ethereum?: {
      request: (request: { method: string, params?: Array<any> }) => Promise<any>;
      // 添加您需要使用的其他ethereum属性和方法的类型定义
    };
  }