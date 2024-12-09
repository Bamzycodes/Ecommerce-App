import express from 'express';
import bcrypt from 'bcryptjs'
import User from '../model/userModel.js';
import { generateToken, isAuth, isAdmin } from '../utils.js';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

const userRouter = express.Router();

userRouter.get(
  "/userlist",
async (req, res) => {
    const users = await User.find({});
    res.send(users);
  }
);

userRouter.get(
  "/:id",
async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  }
);

userRouter.put(
  "/:id",
async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      
      const updatedUser = await user.save();
      res.send({ message: "User Updated", user: updatedUser });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  }
);

userRouter.delete(
  "/:id",
  isAuth,
 async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.remove();
      res.send({ message: "User Deleted" });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  }
);


userRouter.post('/signin', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
      if (bcrypt.compare(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user)
        });
        return;
      }
  }
     res.status(401).send({message: 'invalid email and password'})
}
);

userRouter.post(
  "/signup",
  async (req, res) => {
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password),
    });
    const userExist = await User.findOne({ email: req.body.email });
    if(userExist){
      res.status(400).send({message: "Email already exists..."});
    }

      const user = await newUser.save();
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user),
      });


  }
);

const transporter = nodemailer.createTransport({
  service: 'Gmail', 
  auth: {
    user: "samuelosho83@gmail.com",
    pass: "354657kuit",
  },
});

userRouter.post(
  "/forgot-password", async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }

  // Generate OTP
  const token = crypto.randomBytes(3).toString('hex');
  user.token = token;
  user.tokenExpiry = Date.now() + 10 * 60 * 1000;

  await user.save();

  // Send OTP via email
  const mailOptions = {
    from: "samuelosho303@gmail.com",
    to: user.email,
    subject: 'Password Reset OTP',
    text: `Your OTP for password reset is ${token}. It is valid for 10 minutes.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send({ message: 'Error sending email' });
    }
    res.send({ message: 'OTP sent to your email' });
  });


  })

userRouter.post('/reset-password', async (req, res) => {
  const { email, token, newPassword } = req.body;
  const user = await User.findOne({ email });

  if (!user || user.token !== token || user.tokenExpiry < Date.now()) {
    return res.status(400).send({ message: 'Invalid or expired OTP' });
  }

  // Reset password
  user.password = bcrypt.hashSync(newPassword);
  user.token = undefined; 
  user.tokenExpiry = undefined;
  await user.save();

  res.send({ message: 'Password has been reset successfully' });
});

export default userRouter;