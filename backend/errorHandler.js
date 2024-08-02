const emitError = require("./emitters/emitError");
const { errorMessageMap } = require("./errorMessageMap");

const errorHandler = (handler, socketid) => {
  const handleError = (err) => {
    emitError(socketid, errorMessageMap[err.message.trim()]);
  };

  return (...args) => {
    try {
      const ret = handler.apply(this, args);
      if (ret && typeof ret.catch === "function") {
        // async handler
        ret.catch(handleError);
      }
    } catch (e) {
      // sync handler
      handleError(e);
    }
  };
};

module.exports = { errorHandler };
