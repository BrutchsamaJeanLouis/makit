import * as yup from "yup";
import _ from "lodash";
import { ProjectPhase, ProjectVisibility } from "../enums";

export const createProjectFormSchema: yup.AnyObjectSchema = yup.object({
  title: yup.string().min(3).max(255).required(),
  description: yup.string().min(15).required(),
  tags: yup.array().of(yup.string().min(3)).max(5).compact(),
  //                oneOf the enum from ../enums/ProjectVisibility
  visibility: yup.string().oneOf(Object.values(ProjectVisibility)),
  phase: yup.string().oneOf(Object.values(ProjectPhase)),
  polls: yup
    .array()
    .of(
      yup.object().shape({
        question: yup.string().required(),
        choices: yup.array().of(yup.string().min(1)).required()
      })
    )
    .max(7)
    .compact()
});

export const createPostRequestSchema = yup.object({
  body: createProjectFormSchema,
  params: yup.object().shape({}).noUnknown(),
  query: yup.object().shape({}).noUnknown()
});
