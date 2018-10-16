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

  items: forwardTo('db')

  // async items(parent, args, ctx, info) {
  //   try {
  //     const items = await ctx.db.query.items();
  //     return items;
  //   } catch (err) {
  //     console.error(err);
  //   }
  // }
};

module.exports = Query;
