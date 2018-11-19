const { forwardTo } = require('prisma-binding');

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
  }
};

module.exports = Query;
