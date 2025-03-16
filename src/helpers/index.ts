 import crypto from "crypto";

 const SECRET = "IMRAN-REST-API";
// generating encrypted key
 export const authentication = (salt: string, password: string): string => {
   return crypto
     .createHmac("sha256", [salt, password].join("/"))
     .update(SECRET)
     .digest("hex");
 };

//  crypto is the Node.js built-in module for cryptographic operations.
//  crypto.randomBytes(128) generates a buffer containing 128 random bytes.
//  .toString("base64"): The generated random bytes are then converted to a base64-encoded string using the toString method with the argument "base64".

 export const random = () => crypto.randomBytes(128).toString("base64");