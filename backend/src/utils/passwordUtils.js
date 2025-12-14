import bcrypt from "bcryptjs";

export const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,16}$/;

export const PASSWORD_VALIDATION_MESSAGE =
  "Password must be 8-16 characters, include at least one uppercase letter and one special character.";

export const validatePassword = (password) => {
  return PASSWORD_REGEX.test(password);
};

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};
