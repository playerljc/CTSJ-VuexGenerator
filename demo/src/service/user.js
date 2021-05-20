import faker from 'faker';

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
                key: `${index + 1}`,
                name: faker.name.findName(),
                age: faker.random.number(),
                address: faker.address.streetAddress(),
                tags: [faker.name.findName(), faker.name.findName()],
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
