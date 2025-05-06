const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide an email address"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
    },
    role: { type: String, enum: ["user", "admin", "owner"], default: "user" },
    isVerified: {
      type: Boolean,
      default: false,
    },
    investableBalance: { type: Number, default: 0 },
    withdrawableBalance: { type: Number, default: 0 },
    withdrawalAddresses: [
      {
        tokenType: {
          // Token type (TRC20, BEP20, etc.)
          type: String,
          enum: ["TRC-20", "BEP-20"], // List of allowed token types
        },
        address: {
          // Address field
          type: String,
        },
      },
    ],
    lastWithdrawnAt: { type: Date },
    emailVerificationToken: String,
    emailVerificationTokenExpires: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.verifyPassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
