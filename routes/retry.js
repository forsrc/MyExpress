var express = require('express');
var router = express.Router();


router.get('/:count', function (req, res, next) {
  var count = req.params.count || 1;

  retry(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let r = Math.random();
        r > .5 ? resolve(r) : reject("<=0.5")
      }, 300);
    })
  }, count)
  .then(res => {
    console.log('resolve', res);
  }).catch(err => {
    console.log('reject', err);
  });

  res.send({retry: count});
});

retry = function(fn, limit) {
  let i = 0;
  return new Promise((resolve, reject) => {
    function todo() {
      console.log("todo", i);
      fn()
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
          if (i++ > limit - 1) {
            reject(err);
            return;
          }
          todo();
      });
    }
    todo();
  })

}


module.exports = router;
