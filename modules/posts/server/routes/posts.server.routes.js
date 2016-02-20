'use strict';

/**
 * Module dependencies.
 */
var postsPolicy = require('../policies/posts.server.policy'),
    posts = require('../controllers/posts.server.controller');

module.exports = function (app) {

  // Posts collection routes
  app.route('/posts').all(postsPolicy.isAllowed)
      .get(posts.list)
      .post(posts.create);

  app.route('/posts/postCount').all()
      .get(posts.countPosts);

  app.route('/posts/postCountToday').all()
      .get(posts.countPostsToday);

  app.route('/posts/custCountCoffee')
      .get(posts.custCountCoffee);

  app.route('/posts/custCountCoupon')
      .get(posts.custCountCoupon);

  app.route('/api/posts/of/:userid').get(posts.listOf);

  app.route('/posts/usersCommentsPostedTotal/:userIdStringComment')
      .get(posts.usersCommentsPostedTotal);




  // Single post routes
  app.route('/posts/:postId').all(postsPolicy.isAllowed)
      .get(posts.read)
      .put(posts.update)
      .delete(posts.delete);

  // Finish by binding the post middleware
  app.param('postId', posts.postByID);
  app.param('userIdStringComments', posts.usersCommentsPostedTotal);

  //app.route('/api/posts')
  //    .get(posts.list);
  //
  //app.route('/api/posts/picture')
  //    .post(posts.changeProductPicture);
  //
  //app.route('/api/posts/:postId')
  //    .get(posts.read);



};
