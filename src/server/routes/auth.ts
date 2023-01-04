"use strict";
import express, { NextFunction } from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../../database/models/user";
// const User = {}
export const router = express.Router();

/* GET home page. */
router.get("/whoami", async (req: Request, res: Response, next: NextFunction) => {
  // return res.status(200).json({ testData: "Hi" });
  // to  make use of redirect like this
  // use form post instead of ajax/xhr on react
  // return res.redirect("/");
  return res.json({ ...req.session.user });
});

router.post("/register", async (req: Request, res: Response) => {
  const { email, password, username } = req.body;

  /** ---------------------------------------------------------------
   *    Check if Email or Username is not already existing
   * --------------------------------------------------------------- */

  const matchedEmail = await User.findOne({
    where: { email: email }
  });

  const matchedUsername = await User.findOne({
    where: { username: username }
  });

  if (matchedEmail) return res.status(500).send({ error: `email "${email}" already exist` });
  if (matchedUsername) return res.status(500).send({ error: `user "${username}" already exist` });

  /** ---------------------------------------------------------------
   *    Create hash password and save user
   * --------------------------------------------------------------- */

  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(password, salt);
  await User.create({
    username: username,
    email: email,
    password: hashedPassword
    // firstName: firstName,
    // lastName: lastName,
  })
    // eslint-disable-next-line prettier/prettier
    .then((createdUserCallback) => {
      // creating email token/url
      // const emailToken = jwt.sign(
      //   { userEmail: userFetchFromDB.email },
      //   process.env.EMAIL_TOKEN_HASH_SECRET,
      //   {
      //     expiresIn: '5h'
      //   }
      // )

      // const emailLink = `${process.env.BASE_URL}/api/register-confirm/${emailToken}`

      // const msg = {
      //   to: email, // Change to your recipient
      //   from: 'norelpy.mailer@gmail.com', // Change to your verified sender
      //   subject: 'Account Verification',
      //   html: `Please click this link to confirm your email <a href="${emailLink}">${emailLink}</a>`
      // }

      // UNCOMMENT TO ACTIVATE EMAIL VERIFICATION
      // SEND GRID API Allows free 100 email per month
      // Disabling for development purposes

      /* Delete this line after enable email verify */
      // return res.status(302).json({ redirect: '/register-confirm' })
      return res.redirect("/");

      // Send email
      // sgMail
      //   .send(msg)
      //   .then(() => {
      //     console.log(`Verification Email sent to ${userFetchFromDB.email}`)
      //     // return res.status(200).send('Email Sent Check Inbox Valid for "_" hours')
      //     return res.status(302).json({ redirect: '/register-confirm' })
      //   })
      //   .catch((error) => {
      //     console.error(error)
      //     return res.status(500).json({ error })
      //   })
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({ error: error });
    });

  // then redirect to home
  // res.redirect('/api/whoami')
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password, username } = req.body;
  const { attemptedUrl } = req.body;
  try {
    const isUserLoggedIn = req?.session?.user ? true : false;
    if (isUserLoggedIn) {
      return res.status(302).json({
        redirect: "/",
        loginStatus: isUserLoggedIn,
        sessionUser: req.session.user || null,
        successLoginRedirect: true
      });
    }

    const foundUser: any = await User.findOne({ where: { email: email } }).catch(err => {
      return res.status(500).json({ error: err });
    });

    if (!foundUser) {
      console.log("Email not Found");
      return res.status(500).json({ error: "Invalid email or password" });
    }

    const dBHashedPassword = foundUser.password;
    bcrypt.compare(password, dBHashedPassword, (err, result) => {
      if (result === true) {
        // after a success password match check if the user is verified if not redirect to confirmation page
        // if (foundUser.verified === false) {
        //   return res.status(302).json({ redirect: '/register-confirm', error: 'Account not verified' })
        // }
        req.session.user = { id: foundUser.id, email: foundUser.email, username: foundUser.username };
        // Success
        // attemptedURL is set when react router locked route is triggered
        // lastBrowserPath is set On every axios request in interceptor (/client/App.jsx)
        res
          .status(302)
          .json({ redirect: attemptedUrl || req.headers.lastbrowserpath || "/", successLoginRedirect: true });
      } else {
        // comparision failed
        res.status(500).send({ error: err || "Invalid email or password" });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error });
  }
});

router.get("/logout", (req: Request, res: Response) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  const username = req.session.user?.username;
  req.session.destroy(() => console.log(`${username} has logged out`));
  return res.redirect("/");
});

export default router;
