function isLoggedIn(user = {}) {
  if (!user.id) {
    throw new Error(`You must be logged in to do that!`);
  }
  return true;
}

function hasPermission(user, permissionsNeeded = []) {
  const matchedPermissions = user.permissions.filter(permissionTheyHave =>
    permissionsNeeded.includes(permissionTheyHave)
  );
  if (!matchedPermissions.length) {
    throw new Error(`You do not have sufficient permissions

      : ${permissionsNeeded}

      You Have:

      ${user.permissions}
      `);
  }
}

exports.hasPermission = hasPermission;
exports.isLoggedIn = isLoggedIn;
