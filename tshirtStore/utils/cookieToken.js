const cookieToken = (user, res) => {
  const token = user.getJwtToken();
  const options = {
    expiry: new Date(Date.now() + process.env.COOKIE_EXPIRY * 24 * 60 * 1000),
    httpOnly: true,
  };

  res.status(200).cookie("token", token, options).json({
    success: true,
    token,
    user,
  });
};

module.exports = cookieToken;
