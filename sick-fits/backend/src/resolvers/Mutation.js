const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: Check if user is logged in

    try {
      const item = await ctx.db.mutation.createItem(
        {
          data: {
            ...args
          }
        },
        info
      );

      return item;
    } catch (err) {
      console.error(err);
    }
  }
};

module.exports = Mutations;
