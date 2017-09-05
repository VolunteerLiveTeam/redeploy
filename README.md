# 🎨 redeploy [![npm](https://img.shields.io/npm/dt/redeploy.svg)](https://www.npmjs.com/package/redeploy)

_redeploy_ deploys subreddit stylesheets to reddit.com as part of a gulp pipeline.

## Usage

```shell
# yarn
$ yarn add redeploy

# npm
$ npm install --save redeploy
```

```javascript
var redeploy = require('redeploy')({
  clientID: 'reddit api client id',
  clientSecret: 'reddit api client secret',
  username: 'reddit username',
  password: 'reddit password',
  subreddit: 'subreddit to deploy to (without /r/ prefix)'
})

gulp.task('deploy-css', function() {
  return gulp.src('*.css')
    // you may want to minify your css here
    .pipe(redeploy.css())
});

gulp.task('deploy-images', function() {
  return gulp.src('img/*')
    .pipe(redeploy.images())
});
```
