import mail from "../lib/mail.js";
import { upsertStreamUser } from "../lib/stream.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export async function signup(req, res) {
  const { email, password, fullName } = req.body;

  try {
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists, please use a diffrent one" });
    }

    const idx = Math.floor(Math.random() * 100) + 1; // generate a num between 1-100
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      email,
      fullName,
      password,
      profilePic: randomAvatar,
    });

    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.log("Error creating Stream user:", error);
    }

    await mail({
      to: newUser.email,
      subject: "Welcome to Whisp! 🎉",
      body: `<h1>Hello ${newUser.fullName}!</h1>
             <p>Thanks for signing up for Whisp. We're excited to have you on board!</p>
    <p>You can now start exploring, connect with friends, and join calls or chats.</p>
    <p>If you didn’t create this account, please contact our support immediately.</p>
    <hr />
    <p>— The Whisp Team</p>
    `,
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    // res.cookie("jwt", token, {
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    //   httpOnly: true,
    //   sameSite: "none",
    //   secure: process.env.NODE_ENV === "production",
    // });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,       
      sameSite: "none",    
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ success: true, user: newUser });
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    const isPasswordCorrect = await user.matchPassword(password);
    if (!isPasswordCorrect) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    // res.cookie("jwt", token, {
    //   maxAge: 7 * 24 * 60 * 60 * 1000,
    //   httpOnly: true,
    //   sameSite: "none",
    //   secure: process.env.NODE_ENV === "production",
    // });

     res.cookie("jwt", token, {
      httpOnly: true,
      secure: true,       
      sameSite: "none",    
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    await mail({
      to: user.email,
      subject: "New Sign-In Alert 🔔",
      body: `<h1>Hello ${user.fullName}!</h1>
             <p>We noticed a new sign-in to your Whisp account just now.</p>
    <ul>
      <li><strong>Email:</strong> ${user.email}</li>
      <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
    </ul>
    <p>If this was you, no action is needed. ✅</p>
    <p>If you did not sign in, we recommend changing your password immediately.</p>
    <hr />
    <p>— The Whisp Security Team</p>
    `,
    });


    res.status(200).json({ success: true, user });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export function logout(req, res) {
  // res.clearCookie("jwt");
  res.clearCookie("jwt", {
    secure: true,
    sameSite: "none",
  });
  res.status(200).json({ success: true, message: "Logout successful" });
}

export async function onboard(req, res) {
  try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } = req.body;

    if (!fullName || !bio || !nativeLanguage || !learningLanguage || !location) {
      return res.status(400).json({
        message: "All fields are required",
        missingFields: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(`Stream user updated after onboarding for ${updatedUser.fullName}`);
    } catch (streamError) {
      console.log("Error updating Stream user during onboarding:", streamError.message);
    }

    res.status(200).json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}