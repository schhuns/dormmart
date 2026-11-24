import mongoose from "mongoose";

/**
 * User Schema — Master Prompt Section 11.1
 * Privacy-First: NEVER contains studentId, university, school, or room number.
 */
const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      sparse: true,
      index: true,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      default: "",
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    contacts: {
      zalo: { type: String, default: "" },
      telegram: { type: String, default: "" },
      messenger: { type: String, default: "" },
      phone: { type: String, default: "" },
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    accountStatus: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ fullName: 1 }, { unique: true, collation: { locale: "en", strength: 2 } });

// Method to return public safe profile (never exposes private email or unshared contacts)
userSchema.methods.toPublicProfile = function () {
  return {
    _id: this._id,
    fullName: this.fullName,
    profileImage: this.profileImage,
    role: this.role,
    createdAt: this.createdAt,
  };
};

// Method to return contact channels for "Contact Seller" modal
userSchema.methods.toSellerContacts = function () {
  const available = {};
  if (this.contacts?.zalo) available.zalo = this.contacts.zalo;
  if (this.contacts?.telegram) available.telegram = this.contacts.telegram;
  if (this.contacts?.messenger) available.messenger = this.contacts.messenger;
  if (this.contacts?.phone) available.phone = this.contacts.phone;

  return {
    _id: this._id,
    fullName: this.fullName,
    profileImage: this.profileImage,
    contacts: available,
  };
};

const User = mongoose.model("User", userSchema);
export default User;
