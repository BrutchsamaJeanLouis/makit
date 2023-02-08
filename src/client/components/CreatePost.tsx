import axios, { AxiosError } from "axios";
import { Formik } from "formik";
import React, { MutableRefObject, useRef, useState } from "react";
import { connect } from "react-redux";
import { ProjectPhase, ProjectVisibility } from "../../utils/enums";
import Dropdown from "react-bootstrap/Dropdown";
import { DropdownButton } from "react-bootstrap";
import { createProjectFormSchema } from "../../utils/validation-schemas/schema-create-post";
import { useNavigate } from "react-router-dom";
import { LoadingSpinnerComponent } from "./LoadingSpinners";

const CreatePost = props => {
  const navigateToPage = useNavigate();
  const [isAddingHashTag, setIsAddingHashTag] = useState(false);
  const hashtagInputRef: MutableRefObject<HTMLInputElement | null> = useRef(null);

  const postProject = async (values: any) => {
    const response = await axios
      .post("/api/project/create", values)
      .then(res => {
        console.log("success /api/project/create", res.data);
        navigateToPage(`/project/${res.data.newProject.id}`);
      })
      .catch((err: AxiosError) => console.log("error /api/project/create", err.response?.data));
  };

  const formatMyHashTags = (tags: string[]): string[] => {
    const formattedTags = tags.map(currentTag => {
      let format;

      // if the user only entered #
      if (currentTag === "#" || currentTag === "") {
        //return nothing (don't add to array)
        return;
      }
      // if tag doesn't starts with # symbol
      if (currentTag.charAt(0) !== "#") {
        // add the # symbol
        format = "#" + currentTag;
        return format;
      } else {
        // else return the tag as is
        return currentTag;
      }
    });

    // map replacing empty return with an index of undefined;\
    return formattedTags.filter(t => t !== undefined);
  };

  const defaultVisibility = ProjectVisibility.PUBLIC;
  const defaultPhase = ProjectPhase.IDEA;

  return (
    <Formik
      initialValues={{ title: "", description: "", tags: [], visibility: defaultVisibility, phase: defaultPhase }}
      validationSchema={createProjectFormSchema}
      validate={values => {
        // free to directly mutate object here
        const errors: any = {};
        // eslint-disable-next-line no-constant-condition
        if (!"a value errors") {
          errors.myValue = "Required";
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          postProject(values);
          setSubmitting(false);
        }, 500);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
        setFieldValue
        /* and other goodies */
      }) => (
        <form
          onSubmit={handleSubmit}
          className="col-md-12"
          style={{ margin: "10px", minWidth: "300px", paddingBottom: "40px" }}
        >
          <div
            className="card mb-3 px-2 pt-3 mx-auto"
            style={{ backgroundColor: "#efefef", maxWidth: "850px", borderTop: "5px solid #ec5f5f" }}
          >
            {JSON.stringify(errors)}
            <span className="text-center">
              <h5>Create New Post</h5>
            </span>
            <div className="input-group input-group-lg">
              <span
                className="input-group-text"
                style={{ borderTopLeftRadius: "30px", borderBottomLeftRadius: "30px" }}
                id="inputGroup-sizing-lg"
              >
                Title
              </span>
              <input
                type="text"
                className="form-control"
                style={{ borderTopRightRadius: "30px", borderBottomRightRadius: "30px" }}
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="card-body" style={{ borderTopRightRadius: "50px" }}>
              <div className="tags py-2 ps-4 mb-2 fs-5 bg-white rounded-pill">
                <span style={{ fontSize: "1.1rem" }}>Hashtags:</span>
                {/* List of hashtags forEach */}
                {values.tags.map((tagValue, i) => (
                  <span key={i} className="badge rounded-pill palette-pink mx-1">
                    {tagValue}
                    {/* Start Remove a hashTag icon */}
                    <i
                      className="bi bi-x point border-start ms-2"
                      onClick={() => {
                        const hashTagsWithoutUnwanted = values.tags.filter(h => h !== tagValue);
                        setFieldValue("tags", hashTagsWithoutUnwanted);
                      }}
                    />
                  </span>
                ))}
                <span className="badge rounded-pill palette-pink mx-1" onClick={() => setIsAddingHashTag(true)}>
                  {isAddingHashTag ? (
                    <input
                      onKeyDown={e => {
                        if (e.key === "Enter") {
                          const formattedHashtags = formatMyHashTags([...values.tags, e.currentTarget.value]);
                          setFieldValue("tags", formattedHashtags);
                          hashtagInputRef.current!.value = "";
                        }
                      }}
                      style={{ fontSize: "0.9rem" }}
                      ref={hashtagInputRef}
                      onBlur={e => {
                        setIsAddingHashTag(false);
                        const formattedHashtags = formatMyHashTags([...values.tags, e.target.value]);
                        setFieldValue("tags", formattedHashtags);
                      }}
                      className="palette-pink text-white p-0 no-input-border"
                      type="text"
                      autoFocus
                    />
                  ) : (
                    <i className="bi bi-plus-lg" />
                  )}
                </span>
              </div>
              <div className="phase d-flex mt-4">
                <span className="text-center">Current Phase:</span>
                <Dropdown className="ms-3" onSelect={value => setFieldValue("phase", value)}>
                  <Dropdown.Toggle
                    variant="secondary"
                    className="opacity-50 text-black bg-light"
                    id="dropdown-basic"
                    size="sm"
                  >
                    {values.phase.charAt(0).toUpperCase() + values.phase.slice(1)}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item eventKey="idea">Idea</Dropdown.Item>
                    <Dropdown.Item eventKey="planning">Planning</Dropdown.Item>
                    <Dropdown.Item eventKey="creation">Creation</Dropdown.Item>
                    <Dropdown.Item eventKey="launch">Launch</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <textarea
                className="form-control mt-5"
                id="exampleFormControlTextarea1"
                rows={4}
                name="description"
                value={values.description}
                onBlur={handleBlur}
                onChange={handleChange}
              />
            </div>
            <div className="card-footer">
              <div className="float-end">
                <button type="button" className="btn btn-secondary">
                  <i className="bi bi-paperclip" />
                  Add attachments
                </button>
              </div>
            </div>
            <div className="card-footer">
              {/* <span style={{whiteSpace: 'nowrap'}}>
              <input className='form-control form-control-lg' placeholder='comment' style={{ display: 'inline' }}/>
              <button className='btn btn-primary' style={{display: 'inline' }}>Post</button>
            </span> */}

              <div className="input-group mb-3">
                <div className="input-group-prepend" style={{ alignItems: "center", display: "flex" }}>
                  <button className="btn btn-primary" type="submit" style={{ marginLeft: "10px" }}>
                    Publish
                  </button>
                </div>
                <Dropdown className="ms-3" onSelect={value => setFieldValue("visibility", value)}>
                  <Dropdown.Toggle variant="secondary" className="opacity-50" id="dropdown-basic">
                    Settings
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item eventKey="public" className={`${values.visibility === "public" && "fw-bold fs-5"}`}>
                      <i className="bi bi-globe" /> Public
                    </Dropdown.Item>
                    <Dropdown.Item
                      eventKey="private"
                      className={`${values.visibility === "private" && "fw-bold fs-5"}`}
                    >
                      <i className="bi bi-people" /> Private
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="hidden" className={`${values.visibility === "hidden" && "fw-bold fs-5"}`}>
                      <i className="bi bi-eye-slash" /> Hidden
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
          <hr />
        </form>
      )}
    </Formik>
  );
};

export default connect()(CreatePost);
