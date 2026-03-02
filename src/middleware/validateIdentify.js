const validateIdentify = (req, res, next) => {
  const { email, phoneNumber } = req.body;

  // At least one must be provided
  if (!email && !phoneNumber) {
    return res
      .status(400)
      .json({ error: "Either email or phoneNumber is required" });
  }

  // Validate email format if provided
  if (email) {
    if (typeof email !== "string") {
      return res.status(400).json({ error: "Email must be a string" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (email.length > 255) {
      return res.status(400).json({ error: "Email is too long" });
    }
  }

  // Validate phoneNumber if provided
  if (phoneNumber) {
    const phoneStr = phoneNumber.toString();
    if (phoneStr.length > 20) {
      return res.status(400).json({ error: "Phone number is too long" });
    }

    const phoneRegex = /^\+?[\d\s\-()]+$/;
    if (!phoneRegex.test(phoneStr)) {
      return res.status(400).json({ error: "Invalid phone number format" });
    }
  }

  next();
};

export default validateIdentify;
