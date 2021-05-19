export const fetchList = (() => {
  return {
    call: () => {
      return new Promise((resolve) => {
        const list = [];
        list.length = 100;
        list.fill(0);

        setTimeout(() => {
          resolve({
            code: 200,
            data: {
              total: 100,
              list: list.map((t, index) => ({
                title: `user ${index + 1}`,
              })),
            },
            message: '',
          });
        }, 3000);
      });
    },
    defaultResult: () => ({
      total: 0,
      list: [],
    }),
  };
})();

export default {
  codeKey: 'code',
  codeSuccessKey: 200,
  dataKey: 'data',
  messageKey: 'message',
};
