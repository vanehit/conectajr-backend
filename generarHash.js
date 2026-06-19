import bcrypt from "bcryptjs";

const password = "conectajr2024"; 
const saltRounds = 8;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log("Hash generado:", hash);
});
