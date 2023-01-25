import { Request } from "express";
import * as yup from "yup";
import _ from "lodash";

export const registerBodySchema: yup.AnyObjectSchema = yup.object({
  url: yup.string().url().required(),
  title: yup.string().min(8).max(32).required(),
  content: yup.string().min(8).max(255).required(),
  contact: yup.string().email().required()
});

const exampleRequestWithYup = yup.object({
  body: registerBodySchema,
  params: yup.object({
    username: yup.string()
  })
});

export const registerRequestValidation = (req: Request): boolean => {
  // only grab wanted keys
  const { username, password, email } = req.body;
  // ensure url params is empty we are not expecting anything to be passed
  const emptyURLParams = _.isEmpty(req.params);

  if (
    username &&
    email &&
    password &&
    typeof username === "string" &&
    typeof email === "string" &&
    typeof password === "string" &&
    emptyURLParams
  ) {
    return true;
  } else {
    return false;
  }
};
