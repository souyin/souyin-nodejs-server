const DB = require('../db');
const res = require('./res');

module.exports = function() {
  return async function(req, res, next) {
    if (req.originalUrl.indexOf('/wx/login') !== -1) {
      next();
      return;
    }
    let skey = '';
    if (req.method === 'GET') {
      skey = req.query.skey;
    } else if (req.method === 'POST') {
      skey = req.body.skey;
    }
    // 微信登录
    if (skey) {
      let userInfo;
      try {
        userInfo = await DB.instance('r').query(
          `select * from users where wx_skey = "${skey}"`
        );
        // 验证通过
        if (userInfo.length > 0 && userInfo[0].wx_skey === skey) {
          req.openid = userInfo[0].openid;
          next();
          // 验证不通过
        } else {
          res.resError('微信 session 验证失败');
        }
      } catch (err) {
        res.resError(err.message);
      }
      // 非微信登录
    } else {
      next();
    }
  };
};
