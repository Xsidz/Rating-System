import jwt from "jsonwebtoken";

export const gennToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "2d",
  });

  res.cookie("jwt", token, {
    maxAge: 2 * 24 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
  });
};
