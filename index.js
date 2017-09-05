var through = require('through2');
var path = require('path');
var gulp = require('gulp-util')
var Snoowrap = require('snoowrap');

module.exports = function redeploy(options) {
  options = options || {}
  var subreddit = options.subreddit || process.env.REDDIT_SUB;
  var message = options.message || 'Updated by redeploy.';

  var reddit = new Snoowrap({
    userAgent: options.userAgent || 'redeploy (https://github.com/VolunteerLiveTeam/redeploy)',
    clientId: options.clientID || process.env.REDDIT_CLIENT_ID,
    clientSecret: options.clientSecret || process.env.REDDIT_CLIENT_SECRET,
    username: options.username || process.env.REDDIT_USERNAME,
    password: options.password || process.env.REDDIT_PASSWORD
  });

  redeploy = {}

  function validate(file, callback) {
    if (!subreddit)
      return callback(new gulp.PluginError('redeploy', 'No subreddit specified! Pass in the "subreddit" option or use the REDDIT_SUB environment variable.'));
    if (!file || !file.contents)
      return callback(null, file);
    if (file.isStream())
      return callback(new gulp.PluginError('redeploy', 'File streaming is not supported.'));
  }

  redeploy.css = function css() {
    return through.obj(function(file, encoding, callback) {
      validate(file, callback);

      reddit.getSubreddit(subreddit)
        .updateStylesheet({
            css: String(file.contents),
            reason: message
        }).then(function() {
          gulp.log('deployed', file.relative, 'to /r/' + subreddit)
          return callback(null, file);
        }, function(error) {
          return callback(new gulp.PluginError('redeploy', 'Error deploying to /r/' + subreddit + ': ' + error));
        });
    });
  }

  redeploy.images = function images() {
    return through.obj(function(file, encoding, callback) {
      validate(file, callback);

      imagePath = path.parse(file.path);

      if (!['.jpg', '.png'].includes(imagePath.ext))
        return callback(new gulp.PluginError('redeploy', 'Unable to deploy images that are not .png or .jpg.'))

      reddit.getSubreddit(subreddit)
        .uploadStylesheetImage({
          name: imagePath.name,
          file: file.path,
          imageType: imagePath.ext
        }).then(function() {
          gulp.log('uploaded', file.relative, 'to /r/' + subreddit)
          return callback(null, file);
        }, function(error) {
          return callback(new gulp.PluginError('redeploy', 'Error deploying ' + file.relative + ' to /r/' + subreddit + ': ' + error));
        });
      });
    }

  return redeploy;
}