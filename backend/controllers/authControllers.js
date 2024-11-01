import catchAsyncErrors from "../middleWares/catchAsyncErrors.js";
import User from "../models/user.js";
import { getResetPasswordTemplates } from "../utils/emailTamplates.js";
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";
import { delete_file, upload_file } from "../utils/cloudinary.js";

//Register user => /api/v1/register
export const registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  sendToken(user, 201, res);
});

// Login  user => /api/v1/login
export const loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("please enter email and pessword", 400));
  }

  // find user in the database

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler(" invalid- email or pessword", 401));
  }
  // check if password is correct

  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler(" invalid email or pessword", 401));
  }

  sendToken(user, 200, res);
});

// logout  user => /api/v1/logout
export const logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    message: "logged Out",
  });
});

// upload  user avatar=> /api/v1/me/upload_avatar
export const uploadAvatar = catchAsyncErrors(async (req, res, next) => {
  const avatarResponse = await upload_file(req.body.avatar, "shopit/avatars");

  // remove previous avatar
  if (req?.user?.avatar?.url) {
    await delete_file(req?.user?.avatar?.public_id);
  }

  const user = await User.findByIdAndUpdate(req?.user?._id, {
    avatar: avatarResponse,
  });
  res.status(200).json({
    user,
  });
});

// forgot ppassword => /api/v1/password/forgot
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  // find user in the database

  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorHandler(" user not found with this email", 404));
  }
  // get reset password token
  const resetToken = user.getResetPasswordToken();

  await user.save();

  // create reset password url
  const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;

  const message = getResetPasswordTemplates(user?.name, resetUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: " Shopit password recovery",
      message,
    });

    res.status(200).json({
      message: `Email send to ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    return next(new ErrorHandler(error?.message, 500));
  }
});

// reset password => /api/v1/password/reset/:id
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  // hash  the url
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Password reset token is invalid or has been TokenExpiredError",
        400
      )
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new Error("password does not match", 400));
  }

  // set the password

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, 200, res);
});

// get current user profile => /api/v1/me

export const getUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req?.user?._id);

  res.status(200).json({
    user,
  });
});

// Update Password  => /api/v1/Password/update

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req?.user?._id).select("+password");

  // check the previous password
  const isPasswordMatch = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("old password is incorrect", 400));
  }

  console.log("===========");
  console.log(req.body.oldPassword);
  console.log(req.body.password);
  console.log("==============");

  user.password = req.body.password;
  user.save();

  res.status(200).json({
    success: true,
  });
});

// Update user Profile  => /api/v1/me/update

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
  });

  res.status(200).json({
    user,
  });
});

// Get all Users -ADMIN  => /api/v1/admin/users

export const allUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    users,
  });
});

// Get User Details -ADMIN  => /api/v1/admin/users/:id

export const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404)
    );
  }
  res.status(200).json({
    user,
  });
});

// Update user Details - Admin  => /api/v1/admin/users/:id

export const updateUser = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
  });

  res.status(200).json({
    user,
  });
});

// Delete User -ADMIN  => /api/v1/admin/users/:id

export const delateUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User not found with id: ${req.params.id}`, 404)
    );
  }

  

  // TODO - Remove avatar from cloudinary

  if (user?.avatar?.public_id) {
    await delete_file(user?.avatar?.public_id);
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
  });
});
