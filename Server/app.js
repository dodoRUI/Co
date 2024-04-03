var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var JWT = require('./utils/JWT')

const userRouter = require('./routes/admin/userRouter');
const noticeRouter = require('./routes/admin/noticeRouter');
const clubRouter = require('./routes/admin/clubRouter');
const activityRouter = require('./routes/admin/activityRouter');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// token刷新
app.use((req, res, next) => {
  // 排除login相关路由和接口，否则会一直重定向陷入循环
  if (req.url.includes("login")) {
    next()
    return
  }

  const token = req.headers.authorization?.split(" ")[1]  // 这里authorization首字母必须小写，因为接收到所有的req请求头属性都会变成小写
  if (token) {
    const payload = JWT.verify(token)
    if (payload) {
      // 重新计算token过期时间
      const newToken = JWT.generate({
        id: payload.id,

        username: payload.username,
        password: payload.password,
      }, "1h")
      res.header("authorization", newToken)
      next()
    } else {
      res.status(401).send({ errCode: -1, errInfo: "token过期" })
    }
  } else {
    next()
  }
})

app.use(userRouter)
app.use(noticeRouter)
app.use(clubRouter)
app.use(activityRouter)


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
