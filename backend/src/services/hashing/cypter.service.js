// encrypt data, generate a storable hash
// used this insted of SHA256 'cause is made to avoid rainbow tables attacks
import bcrypt from "bcryptjs";

const salt_rounds = 10;

// encrypt data, generate a storable hash
async function hashData(data) {
  let salt = bcrypt.genSaltSync(salt_rounds);
  let hash = bcrypt.hashSync(data, salt);
  return hash;
}

// compare data with a hash on DB
function compareHash(data, hash) {
  return bcrypt.compareSync(data, hash);
}

export { hashData, compareHash };
