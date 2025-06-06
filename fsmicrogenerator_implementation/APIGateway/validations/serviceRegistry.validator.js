const {
  joiObject,
  stringRequired,
  numberRequired,
  array,
} = require("../middlewares/commonTypesValidation");
const schemaRegister = joiObject({
  serviceName: stringRequired("serviceName"),
  protocol: stringRequired("protocol"),
  host: stringRequired("host"),
  port: numberRequired("port"),
  role: array('role', stringRequired('role item').valid('authentication', 'authorization'))
});

const schemaUnRegister = joiObject({
  serviceName: stringRequired("serviceName"),
  url: stringRequired("url"),
});
const schemaUpdateState = joiObject({
  serviceName: stringRequired("serviceName"),
  url: stringRequired("url"),
  status: stringRequired('status')
})


module.exports = {
  schemaRegister,
  schemaUnRegister,
  schemaUpdateState

};
