import * as yup from "yup";
import _ from "lodash";
import { ProjectVisibility } from "../../database/models/project";

export const createPostBodySchema: yup.AnyObjectSchema = yup.object({
  title: yup.string().min(3).max(255).required(),
  description: yup.string().min(15).required(),
  tags: yup.array().of(yup.string()).max(5),
  visibility: yup.string().oneOf(Object.values(ProjectVisibility))
});

export const createPostRequestSchema = yup.object({
  body: createPostBodySchema,
  params: yup.object().shape({}).noUnknown(),
  query: yup.object().shape({}).noUnknown()
});
