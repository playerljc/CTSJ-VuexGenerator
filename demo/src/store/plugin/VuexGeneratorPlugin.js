import VuexGenerator from '@ctsj/vuexgenerator';

import UserModel from '../modules/user';
import PersonModel from '../modules/person';

function serviceRegister() {
  const requireComponent = require.context('../../service', false, /.*\.(js)$/);

  const services = {};
  requireComponent.keys().forEach((fileName) => {
    const serviceKey = fileName.substring(2, fileName.length - 3);
    services[serviceKey] = requireComponent(fileName);
  });

  return services;
}

// 创建VuexGeneratorPlugin插件
export default VuexGenerator(serviceRegister(), {
  user: UserModel,
  person: PersonModel,
});
