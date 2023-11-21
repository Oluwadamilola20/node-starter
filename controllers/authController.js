import bcryptjs from "bcryptjs";
import User from "../models/User.js";
import {validateSignin, validateSignup} from "../lib/validations/userValidation.js"

//Signin
// @description: User signin
// @Method: POST
// @Endpoint: api/auth/signin
// @AccessType: public
const signin = async (req, res) => {
    // validation
    const error = await validateSignin(req.body);
    if (error) {
      return res.status(400).json({ msg: error });
    }
  
    res.json({ msg: "Signin successful" });

 // Check if user have an account
 const user = await User.findOne({ email });
 if (!user) {
   return res.status(400).json({ msg: "Invalid email or password" });
 }

 // Check if password is equal
 const isValid = await bcryptjs.compare(password, user.password);
 if (!isValid) {
   return res.status(400).json({ msg: "Invalid email or password" });
 }
 const payload = {
    _id: user._id,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
  };

const token = genJWT(payload);

  res.json({ token, msg: "Login successful" });
};
  
//Signup
// @description: User signup
// @Method: POST
// @Endpoint: api/auth/signup
// @AccessType: public
const signup = async (req, res) => {
  // validation
  const error = await validateSignup(req.body);
  if (error) {
    return res.status(400).json({ msg: error });
  }

  const { email, firstName, lastName, password, phone } = req.body;

  // Check if user exist
  const phoneExist = await User.findOne({ phone });
  if (phoneExist) {
    return res.status(400).json({ msg: "Phone number already exist" });
  }
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    return res.status(400).json({ msg: "Email already exist" });
  }

  // Hash the password
  const salt = await bcryptjs.genSalt(10);
  const hashedPassword = await bcryptjs.hash(password, salt);

  // Create the user
  const newUser = new User({
    firstName,
    lastName,
    phone,
    email,
    password: hashedPassword,
  });

  
  const activationToken = generateUniqueChars(80)
  const activationTokenExpires = Date.now() + 30 * 60 * 1000;

  newUser.activationToken = activationToken;
  newUser.activationTokenExpires = activationTokenExpires;

  await newUser.save();

  await sendActivationLink({ email, lastName, activationToken });

  res.status(201).json({ msg: "Sign up successful" });
};

// @description: User activate
// @Method: GET
// @Endpoint: api/auth/activate/:activationToken
// @AccessType: public
const activate = async (req, res) => {
  const activationToken = req.params.activationToken;

  const user = await User.findOne({ activationToken });
  if (!user) {
    return res.status(400).json({ msg: "Invalid activation token" });
  }

  if (Date.now() > user.activationTokenExpires) {
    return res.status(400).json({ msg: "Activation token expired" });
  }

  user.isActivate = true;
  user.activationToken = undefined;
  user.activationTokenExpires = undefined;

  await user.save();

  res.status(200).json({ msg: "Account activated successfully" });
};

export  { signin, signup, activate };
  