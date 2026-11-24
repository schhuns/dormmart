import "../config/env.js";
import { OAuth2Client } from "google-auth-library";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { generateToken } from "../middleware/auth.js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Helper to generate a unique full name / display name across all accounts
 */
export const generateUniqueFullName = async (baseName, excludeUserId = null) => {
  let cleanBase = (baseName || "Dorm Mart User").trim().replace(/\s+/g, " ");
  if (!cleanBase) cleanBase = "Dorm Mart User";

  const escapeRegex = (str) => str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

  const baseQuery = {
    fullName: { $regex: new RegExp(`^${escapeRegex(cleanBase)}$`, "i") },
  };
  if (excludeUserId) {
    baseQuery._id = { $ne: excludeUserId };
  }

  const existing = await User.findOne(baseQuery);
  if (!existing) {
    return cleanBase;
  }

  let suffix = 1;
  while (true) {
    const candidate = `${cleanBase}_${suffix}`;
    const candQuery = {
      fullName: { $regex: new RegExp(`^${escapeRegex(candidate)}$`, "i") },
    };
    if (excludeUserId) {
      candQuery._id = { $ne: excludeUserId };
    }
    const found = await User.findOne(candQuery);
    if (!found) {
      return candidate;
    }
    suffix++;
  }
};

/**
 * EMAIL REGISTER: Create new account with email & password
 * POST /api/auth/register
 */
export const emailRegister = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "Full name, email, and password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanName = fullName.trim().replace(/\s+/g, " ");

    if (!EMAIL_REGEX.test(cleanEmail)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const escapeRegex = (str) => str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    const existingName = await User.findOne({
      fullName: { $regex: new RegExp(`^${escapeRegex(cleanName)}$`, "i") },
    });
    if (existingName) {
      return res.status(409).json({ error: "This display name is already taken. Please choose a different name." });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName: cleanName,
      email: cleanEmail,
      passwordHash,
      role: "USER",
      accountStatus: "ACTIVE",
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        contacts: user.contacts,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Registration failed: " + error.message });
  }
};

/**
 * EMAIL LOGIN: Authenticate with email & password
 * POST /api/auth/login
 */
export const emailLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.passwordHash) {
      return res.status(400).json({
        error: "This account was registered using Google. Please sign in with Google.",
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (user.accountStatus === "SUSPENDED") {
      return res.status(403).json({ error: "Your account has been suspended. Please contact administrator." });
    }

    const token = generateToken(user);

    res.json({
      message: "Signed in successfully",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        contacts: user.contacts,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed: " + error.message });
  }
};

/**
 * GOOGLE SIGN-IN: Primary 1-click authentication (Section 4.1)
 * POST /api/auth/google
 */
export const googleSignIn = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "Google ID token is required" });
    }

    let payload;

    const googleClientId = process.env.GOOGLE_CLIENT_ID;

    if (googleClientId) {
      const client = new OAuth2Client(googleClientId);
      const ticket = await client.verifyIdToken({
        idToken,
        audience: googleClientId,
      });
      payload = ticket.getPayload();
    } else {
      console.warn("⚠️ GOOGLE_CLIENT_ID not configured in .env.");
      return res.status(400).json({
        error: "Google Client ID is not configured on the server. Please add GOOGLE_CLIENT_ID to server/.env",
      });
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!googleId || !email) {
      return res.status(400).json({ error: "Invalid Google credentials payload" });
    }

    let user = await User.findOne({ googleId });

    if (!user) {
      user = await User.findOne({ email: email.toLowerCase() });
      if (user) {
        user.googleId = googleId;
        if (!user.profileImage && picture) user.profileImage = picture;
        await user.save();
      } else {
        // First-time user: Automatic account creation with guaranteed unique display name
        const uniqueFullName = await generateUniqueFullName(name || "Dorm Mart User");
        user = await User.create({
          googleId,
          email: email.toLowerCase(),
          fullName: uniqueFullName,
          profileImage: picture || "",
          role: "USER",
          accountStatus: "ACTIVE",
        });
      }
    }

    if (user.accountStatus === "SUSPENDED") {
      return res.status(403).json({ error: "Your account is suspended. Please contact administrator." });
    }

    const token = generateToken(user);

    res.json({
      message: "Google sign-in successful",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        contacts: user.contacts,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res.status(401).json({ error: "Google authentication failed: " + error.message });
  }
};

/**
 * Get current authenticated user profile
 * GET /api/auth/me
 */
export const getMe = async (req, res) => {
  res.json({
    _id: req.user._id,
    fullName: req.user.fullName,
    email: req.user.email,
    profileImage: req.user.profileImage,
    contacts: req.user.contacts,
    role: req.user.role,
    createdAt: req.user.createdAt,
  });
};

/**
 * Update private profile and external contact handles
 * PATCH /api/auth/profile
 */
export const updateProfile = async (req, res) => {
  try {
    const { fullName, profileImage, contacts } = req.body;

    if (fullName !== undefined) {
      const cleanName = fullName.trim().replace(/\s+/g, " ");
      if (!cleanName) {
        return res.status(400).json({ error: "Display name cannot be empty" });
      }

      const escapeRegex = (str) => str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
      const existingName = await User.findOne({
        _id: { $ne: req.user._id },
        fullName: { $regex: new RegExp(`^${escapeRegex(cleanName)}$`, "i") },
      });
      if (existingName) {
        return res.status(409).json({ error: "This display name is already taken. Please choose another name." });
      }

      req.user.fullName = cleanName;
    }

    if (profileImage !== undefined) req.user.profileImage = profileImage;

    if (contacts && typeof contacts === "object") {
      req.user.contacts = {
        zalo: contacts.zalo ? contacts.zalo.trim() : "",
        telegram: contacts.telegram ? contacts.telegram.trim() : "",
        messenger: contacts.messenger ? contacts.messenger.trim() : "",
        phone: contacts.phone ? contacts.phone.trim() : "",
      };
    }

    await req.user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: req.user._id,
        fullName: req.user.fullName,
        email: req.user.email,
        profileImage: req.user.profileImage,
        contacts: req.user.contacts,
        role: req.user.role,
        createdAt: req.user.createdAt,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
};
