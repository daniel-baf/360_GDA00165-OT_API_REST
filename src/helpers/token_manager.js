import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const signToken = async (payload) => {
  return jwt.sign({ // TODO: verify the payload data structure
    id: payload.id,
    role: payload.role,
  }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const verifyToken = async (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null; //TODO: handle the error properly        
    }
}