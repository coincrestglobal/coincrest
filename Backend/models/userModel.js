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
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
    },
    role: { type: String, enum: ["user", "admin", "owner"], default: "user" },
    profilePic: {
      url: { type: String, default: null },
      publicId: { type: String, default: null },
    },
    referralCode: {
      type: String,
      unique: true,
      default: null,
    },
    referredBy: {
      type: String,
      default: null,
    },
    referralBonuses: [
      {
        type: {
          type: String,
          required: true,
          enum: ["deposit", "team"],
        },
        milestone: {
          type: Number,
          required: function () {
            return this.type === "team";
          },
        },
        amount: {
          type: Number,
          required: true,
        },
        fromUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    currentLoginToken: {
      type: String,
      default: null,
    },
    investableBalance: { type: Number, default: 0 },
    withdrawableBalance: { type: Number, default: 0 },
    withdrawalAddresses: [
      {
        tokenType: {
          type: String,
          enum: ["BEP-20"], // List of allowed token types
        },
        address: {
          // Address field
          type: String,
        },
      },
    ],
    deposits: [{ type: mongoose.Schema.Types.ObjectId, ref: "Deposit" }],
    withdrawals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Withdrawal" }],
    lastWithdrawnAt: { type: Date },
    investments: [
      {
        name: {
          type: String,
          required: true,
        },
        investedAmount: {
          type: Number,
          required: true,
          min: 0,
        },
        interestRate: {
          type: Number,
          required: true,
        },
        lastInterestCreditedAt: {
          type: Date,
          default: null,
        },
        investDate: {
          type: Date,
          default: Date.now,
        },
        redeemDate: {
          type: Date,
          default: null,
        },
        profit: {
          type: Number,
          default: 0,
        },
        status: {
          type: String,
          enum: ["active", "pending", "redeemed"],
          default: "active",
        },
        redeemDate: { type: Date, default: null },

        isManuallyApproved: { type: Boolean, default: false },
      },
    ],
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
