import asyncHandler from "express-async-handler";
import { emailRegex, passwordRegax } from "../config/const.js";
import User from "../model/userModel.js";
import generateToken from "../utils/generateToken.js";

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword, visaType } =
    req.body;
  if (!emailRegex.test(email)) {
    res.status(201).json({
      Success: false,
      Data: {},
      Error: {
        State: "email",
        Msg: "Please enter a valid email address.",
      },
    });
  } else {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(201).json({
        Success: false,
        Data: {},
        Error: {
          State: "email",
          Msg: "This user is already exist!",
        },
      });
    } else {
      if (!passwordRegax.test(password)) {
        res.status(201).json({
          Success: false,
          Data: {},
          Error: {
            State: "password",
            Msg: `Passwords must be 6-8 chracters long and must contain a number, an uppercase & lowercase letter.`,
          },
        });
      } else if (password !== confirmPassword) {
        res.status(201).json({
          Success: false,
          Data: {},
          Error: {
            State: "password",
            Msg: "Password did not match.",
          },
        });
      } else {
        const user = await User.create({
          firstName,
          lastName,
          email,
          password,
          visaType,
        });

        console.log("here: ", user)

        if (user) {
          res.status(201).json({
            Success: true,
            Data: {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              token: generateToken(user._id),
            },
            Error: {},
          });
        } else {
          res.status(400);
          throw new Error("Invalid user data");
        }
      }
    }
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.status(201).json({
      Success: true,
      Data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        token: generateToken(user._id),
      },
      Error: {},
    });
  } else {
    res.status(401).json({
      Success: false,
      Data: {},
      Error: {
        State: "password",
        Msg: "Invalid email or password",
      },
    });
  }
});

export { loginUser, registerUser };
