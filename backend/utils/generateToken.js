import jwt from "jsonwebtoken";

const generateToken = (res, user) => {
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,   
    secure: false,    
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });

  return token;
};

export default generateToken;
