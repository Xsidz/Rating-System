export const handleError = (res, error, context, statusCode = 500) => {
  console.log(`Error in ${context}:`, error.message);
  return res.status(statusCode).json({ message: "Internal Server Error" });
};

export const handleValidationError = (res, message) => {
  return res.status(400).json({ message });
};

export const handleNotFoundError = (res, message) => {
  return res.status(404).json({ message });
};

export const handleUnauthorizedError = (res, message) => {
  return res.status(403).json({ message });
};
