const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  if (!authHeader) {
    res.status(401).json({
      status: "fail",
      message: "Unauthorized",
    });
  } else if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      const decodedUser = jwt.verify(token, "secretkey");
      req.user = decodedUser;
      next();
    } catch (error) {
      res.status(401).json({
        status: "fail",
        message: "Unauthorized! invalid token",
      });
    }
  }
};
