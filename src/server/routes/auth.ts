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
  return res.json({ ...req.session });
});

router.post('/register', async (req: Request, res: Response) => {
  const { email, password, username, firstName, lastName } = req.body;

  /** ---------------------------------------------------------------
   *    Check if Email or Username is not already existing
   * --------------------------------------------------------------- */

  const matchedEmail = await User.findOne({
    where: { email: email }
  })

  const matchedUsername = await User.findOne({
    where: { username: username }
  })

  if (matchedEmail) return res.status(500).send({ error: `email "${email}" already exist` })
  if (matchedUsername) return res.status(500).send({ error: `user "${username}" already exist` })

  /** ---------------------------------------------------------------
   *    Create hash password and save user
   * --------------------------------------------------------------- */

  const salt = await bcrypt.genSalt()
  const hashedPassword = await bcrypt.hash(password, salt)
  await User.create({
    username: username,
    email: email,
    password: hashedPassword
    // firstName: firstName,
    // lastName: lastName,
  })
    .then((userFetchFromDB) => {
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
    .catch((error) => {
      console.log(error)
      return res.status(500).json({ error: error })
    })

  // then redirect to home
  // res.redirect('/api/whoami')
})


export default router;
