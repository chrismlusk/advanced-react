const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomBytes } = require('crypto');
const { promisify } = require('util');

const Mutations = {
  async createItem(parent, args, ctx, info) {
    // TODO: Check if user is logged in

    try {
      const item = await ctx.db.mutation.createItem(
        { data: { ...args } },
        info
      );

      return item;
    } catch (err) {
      console.error(err);
    }
  },

  updateItem(parent, args, ctx, info) {
    // first, make a copy of the updates
    const updates = { ...args };
    // remove the ID from the updates because we won't update that
    delete updates.id;
    // run the update method
    return ctx.db.mutation.updateItem(
      {
        data: updates,
        where: { id: args.id }
      },
      info
    );
  },

  async deleteItem(parent, args, ctx, info) {
    const where = { id: args.id };
    // 1. Find the item.
    const item = await ctx.db.query.item({ where }, `{ id, title }`);
    // 2. Check if they own the item or have permissions.
    // TOOD
    // 3. Delete it!
    return ctx.db.mutation.deleteItem({ where }, info);
  },

  async signup(parent, args, ctx, info) {
    // 1. ensure consistent formatting
    args.email = args.email.toLowerCase();

    // 2. hash user's password
    const password = await bcrypt.hash(args.password, 10);

    // 3. create user in the db
    const user = await ctx.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ['USER'] }
        }
      },
      info
    );

    // 4. create JWT for the user
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // 5. set JWT as a cookie on the response
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
    });

    // 6. return user to the client
    return user;
  },

  async signin(parent, args, ctx, info) {
    const { email, password } = args;

    // 1. check if a user exists with that email
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) throw new Error(`No such user found for email ${email}`);

    // throwing new errors here will be caught by the Query or Mutation
    // component in the front end and will display the `<ErrorMessage>`.

    // 2. check if the password is correct
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error('Invalid password');

    // 3. generate a JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // 4. set cookie with the token
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
    });

    // 5. return the user
    return user;
  },

  signout(parent, args, ctx, info) {
    ctx.response.clearCookie('token');
    return { message: 'Goodbye!' };
  },

  async requestReset(parent, args, ctx, info) {
    const { email } = args;

    // 1. check if this is a real user
    const user = await ctx.db.query.user({ where: { email } });
    if (!user) throw new Error(`No such user found for email ${email}`);

    // 2. set a reset token and expiry on that user
    const randomBytesPromisified = promisify(randomBytes);
    const resetToken = (await randomBytesPromisified(20)).toString('hex');
    const resetTokenExpiry = Date.now() + (1000 * 60 * 60); // 1 hour from now
    const res = await ctx.db.mutation.updateUser({
      where: { email },
      data: { resetToken, resetTokenExpiry }
    });
    console.log(res);
    return { message: 'Thanks' };

    // 3. email them that reset token
  },

  async resetPassword(parent, args, ctx, info) {
    const { password, confirmPassword, resetToken } = args;

    // 1. check if the passwords match
    if (password !== confirmPassword) {
      throw new Error(`Your passwords don't match!`);
    }

    // 2. check if reset token is legit and not expired
    const [user] = await ctx.db.query.users({
      where: {
        resetToken,
        resetTokenExpiry_gte: Date.now() - (1000 * 60 * 60)
      }
    });
    if (!user) throw new Error(`This token is either invalid or expired!`);

    // 3. hash the new password
    const newPassword = await bcrypt.hash(password, 10);

    // 4. save the new password and remove old resetToken fields
    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: {
        password: newPassword,
        resetToken: null,
        resetTokenExpiry: null
      }
    });

    // 5. generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);

    // 6. set the JWT cookie
    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    });

    // 7. return the new user
    return updatedUser;
  }
};

module.exports = Mutations;
