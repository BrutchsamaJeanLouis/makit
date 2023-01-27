import axios from "axios";
import { Formik } from "formik";
import React from "react";
import { connect } from "react-redux";

const CreatePost = props => {
  const postProject = async (values: any) => {
    const response = await axios
      .post("/api/project/create", values)
      .then(res => console.log("success /api/project/create", res.data))
      .catch(err => console.log("error /api/project/create", err));
  };

  return (
    <Formik
      initialValues={{ title: "", description: "", tags: [] }}
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
        isSubmitting
        /* and other goodies */
      }) => (
        <form
          onSubmit={handleSubmit}
          className="col-md-12"
          style={{ margin: "10px", minWidth: "300px", paddingBottom: "40px" }}
        >
          <div className="card mb-3 px-2 pt-3 mx-auto" style={{ backgroundColor: "#efefef", maxWidth: "1050px" }}>
            <span className="text-center">
              <h5>Create New Post</h5>
            </span>
            <div className="input-group input-group-lg">
              <span className="input-group-text" id="inputGroup-sizing-lg">
                Title
              </span>
              <input
                type="text"
                className="form-control"
                name="title"
                value={values.title}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
            <div className="card-body" style={{ borderTopRightRadius: "50px" }}>
              <textarea
                className="form-control"
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
                  Add attachment
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
