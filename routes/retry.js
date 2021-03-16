var express = require('express');
var router = express.Router();


router.get('/test1/:count', function (req, res, next) {
  var count = req.params.count || 1;
  console.log("======================");

  retry(() => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        let r = Math.random();
        r > .5 ? resolve(r) : reject("<=0.5")
      }, 300);
    })
  }, count)
    .then(r => {
      console.log('resolve', r);
      res.send({ retry: count, message: r });
    }).catch(err => {
      console.log('reject', err);
      res.send({ retry: count, err: err });
    });

});

router.get('/test2/:count', function (req, res, next) {
  console.log("======================");
  var count = req.params.count || 1;
  new Promise((resolve, reject) => {
    retryable(resolve, reject, (_resolve, _reject) => {
        setTimeout(() => {
          let r = Math.random();
          console.log("-->", r );
          r > .9 ? _resolve(r) : _reject("<=0.9");
        }, 300);
    }, count);
  })
    .then(r => {
      console.log('resolve', r);
      res.send({ retry: count, message: r });
    }).catch(err => {
      console.log('reject', err);
      res.send({ retry: count, err: err });
    });

});

retry = function (fn, limit) {
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

retryable = function (resolved, rejected, fn, limit) {
  var promise = Promise.reject();
  for (var i = 0; i <= limit; i++) {
    const index = i;
    console.log("try...", index);
    promise = promise.catch((res) => {
      console.log("try", index, res);
      return new Promise(fn);
    });
  }
  promise = promise.then((res) => {
    resolved(res); 
  }).catch(function (err) {
    rejected(err)
  });
}

module.exports = router;
