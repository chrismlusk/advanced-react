const { forwardTo } = require('prisma-binding');
const { isLoggedIn, hasPermission } = require('../utils');

const Query = {
  //
  // 👻 👻 👻
  //
  // Hot tip! If your Yoga query is the exact same as the Prisma query, then
  // you can use the `prisma-binding` module's `forwardTo` method. That means
  // anytime someone requests a list of items, we'll forward it to the database
  // to be handled. No need to rewrite the query resolver!
  // ==========================================================================

  items: forwardTo('db'),
  item: forwardTo('db'),
  itemsConnection: forwardTo('db'),
  me(parent, args, ctx, info) {
    const { userId } = ctx.request;
    // Important to return null and not throw an error.
    if (!userId) return null;
    return ctx.db.query.user({ where: { id: userId } }, info);
  },
  async users(parent, args, ctx, info) {
    // 1. check if user is logged in
    isLoggedIn(ctx.request.user);

    // 2. check if user has the right permissions
    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSIONUPDATE']);

    // 3. if yes, query all the users
    return ctx.db.query.users({}, info);
  },
};

module.exports = Query;
