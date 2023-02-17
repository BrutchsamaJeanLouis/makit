import axios, { AxiosError } from "axios";
import { Formik } from "formik";
import React, { MutableRefObject, useCallback, useMemo, useRef, useState } from "react";
import { connect } from "react-redux";
import { ProjectPhase, ProjectVisibility } from "../../utils/enums";
import Dropdown from "react-bootstrap/Dropdown";
import { createProjectFormSchema } from "../../utils/validation-schemas/schema-create-post";
import { useNavigate } from "react-router-dom";
import SimpleMDE from "react-simplemde-editor";
import EasyMDE from "easymde/types/easymde";
import { ToolbarIcon } from "easymde/types/easymde";
import _ from "lodash";
import "easymde/dist/easymde.min.css";
import "./CreatePost.css";

const CreatePost = props => {
  const navigateToPage = useNavigate();
  const [isAddingHashTag, setIsAddingHashTag] = useState(false);
  const hashtagInputRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [fileBlobRef, setFileBlobRef] = useState<string[]>([]);

  const postProject = async (formData: any) => {
    const projectResponse = await axios.post("/api/project/create", formData).catch((err: AxiosError) => {
      console.log("error /api/project/create", err.response!.data);
      return;
    });
    if (projectResponse!.data.newProject && formData.files.length > 0) {
      const projectId = projectResponse!.data.newProject.id;
      // attempting to upload and attach media
      // then transform preview to real markdown;
      const reqBody = { projectId: projectId, files: Object.assign({}, formData.files) };
      const mediaResponse = await axios
        .post("/api/media/attach", reqBody)
        .catch((err: AxiosError) => console.log("error /api/media/attach", err.response!.data));
    }

    console.log("success /api/project/create", projectResponse!.data);
    navigateToPage(`/view-project/${projectResponse!.data.newProject.id}`);
  };

  // Video and Image Files
  // OnSuccess Takes a FileURL as string to ass to the markdown
  const S3upload = async (file: File, onSuccess: (s: string) => any, onError: (s: string) => any) => {
    setIsUploadingImage(true);
    // await axios.post("/api/media/attach", {});
    onSuccess(URL.createObjectURL(file));
    // <img src="blob:http://localhost:8080/a02c6732-15ca-4d6c-947c-86a3c2f6a975"><img>
    // find a way to push this to description file then on post upload it to s3
    setIsUploadingImage(false);
  };

  const onchangeDisplayImages = (filesArray: []) => {
    if (filesArray.length === 0) return;
    const fileBlobs = filesArray.map(blob => URL.createObjectURL(blob));
    setFileBlobRef(fileBlobs);

    // ![image](blob:http://localhost:8080/97bf531f-defc-4d65-8bf2-17459be8ed2d)
    // ![](https://nl-at-media-prod.s3.eu-west-2.amazonaws.com/130/203/925/bunny_1by1.mp4)
  };

  const formatMyHashTags = (tags: string[]): string[] => {
    //TODO handle hashtags with spaces currently not working
    const formattedTags = tags.map(currentTag => {
      let format = currentTag?.trim();

      // if empty string
      if (!format) {
        return;
      }

      // replace spaces only if it doesn't end with a space
      format = currentTag.replaceAll(" ", "_");
      format = currentTag.replaceAll("  ", "_");
      format = currentTag.replaceAll("   ", "_");
      format = currentTag.replaceAll("    ", "_");

      // if the user only entered #
      if (currentTag === "#" || currentTag === "") {
        //return nothing (don't add to array)
        return format;
      }
      // if tag doesn't starts with # symbol
      if (currentTag.charAt(0) !== "#") {
        // add the # symbol
        format = "#" + currentTag;
        return format;
      } else {
        // else return the tag as is
        return format;
      }
    });

    // map replacing empty return with an index of undefined;\
    // @ts-ignore
    return formattedTags.filter(t => t !== undefined || t !== "" || t !== " ");
  };
  const markdownEditorOptions = useMemo((): EasyMDE.Options => {
    return {
      imageUploadFunction: S3upload,
      uploadImage: true,
      status: false,
      toolbar: [
        "bold",
        "italic",
        "quote",
        "unordered-list",
        "ordered-list",
        "link",
        "image",
        {
          name: "redText",
          action: editor => {
            var cm = editor.codemirror;
            var output = "";
            var selectedText = cm.getSelection();
            var text = selectedText || "https://";
            output = "[![video](/static/video-banner.jpg)](" + text + ")";
            cm.replaceSelection(output);
          },
          className: "bi bi-film",
          title: "insert Video"
        },
        "strikethrough",
        "code",
        "table",
        "heading",
        "heading-bigger",
        "heading-smaller",
        "heading-1",
        "heading-2",
        "heading-3",
        "redo",
        "undo",
        "clean-block",
        "horizontal-rule",
        "preview",
        "side-by-side",
        "fullscreen",
        "guide"
      ]
      // Adjust settings for parsing the Markdown during previewing (not editing).
      // renderingConfig: {
      //   markedOptions: {
      //     renderer: () => {
      //       return
      //     }
      //   },
      //   // used to validate/sanatize rawHtmL
      //   sanitizerFunction(html) {
      //       return ""
      //   },
      // },
      // hideIcons: ["preview", "fullscreen"]
    };
  }, []);
  const defaultVisibility = ProjectVisibility.PUBLIC;
  const defaultPhase = ProjectPhase.IDEA;

  return (
    <Formik
      initialValues={{
        title: "",
        description: "",
        tags: [],
        visibility: defaultVisibility,
        phase: defaultPhase,
        files: [] as File[]
      }}
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
          className="col-md-12 create-post"
          style={{ margin: "10px", paddingBottom: "40px" }}
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
              {/* TODO Validate HTML before consuming it make sure its safe */}
              {/* TODO Preview is broken prob because of display block */}
              <SimpleMDE
                className={`mt-5 markdown-editor ${isUploadingImage && "invisible"}`}
                onBlur={handleBlur}
                value={values.description}
                onChange={(value: string, changeObj) => {
                  const files = changeObj?.text.filter(t => t.includes("blob:"));
                  if (files?.length && files.length > 0) {
                    console.log("inserting a file");
                  }
                  setFieldValue("description", value);
                }}
                onDropCapture={e => {
                  // TODO check for video and check for image
                  const fileIndex = e.dataTransfer.getData("file-index");
                  const fileType = e.dataTransfer.getData("file-type");
                  let markdown;
                  if (fileType.includes("video")) {
                    markdown = "[![video](/static/video-banner.jpg)](" + fileBlobRef[fileIndex] + ")";
                  }
                  if (fileType.includes("image")) {
                    markdown = "![image](" + fileBlobRef[fileIndex] + ")";
                  }
                  setFieldValue("description", values.description + markdown);
                  console.log("dropCapture", fileIndex);
                }}
                options={markdownEditorOptions}
              />
              ;
            </div>
            <div>
              {/* TODO make this a carousel component with props fileBlobRef, onChangeDisplayImages */}
              {values.files.length > 0 &&
                fileBlobRef.map((blob, index) => (
                  <div data-file-index={index} key={index}>
                    <button
                      type="button"
                      onClick={() => {
                        const filesLeftAfterRemove = values.files.filter((img, i) => i !== index);
                        // remove from fromik
                        setFieldValue("files", filesLeftAfterRemove);
                        // update image blob render
                        onchangeDisplayImages(filesLeftAfterRemove);
                      }}
                    >
                      X
                    </button>
                    {values.files[index]?.type.includes("image") && (
                      <img
                        data-file-index={index}
                        width={150}
                        draggable
                        src={blob}
                        onDragStart={e => {
                          e.dataTransfer.setData("file-index", `${index}`);
                          e.dataTransfer.setData("file-type", values.files[index].type);
                          console.log(values.files[index].type);
                        }}
                      />
                    )}
                    {values.files[index]?.type.includes("video") && (
                      <video
                        data-file-index={index}
                        width={150}
                        controls
                        draggable
                        src={blob}
                        onDragStart={e => {
                          e.dataTransfer.setData("file-index", `${index}`);
                          e.dataTransfer.setData("file-type", values.files[index].type);
                          console.log(values.files[index].type);
                        }}
                      />
                    )}
                  </div>
                ))}
            </div>
            <div className="card-footer">
              <div className="mb-3 float-end">
                <input
                  style={{ width: "7em" }}
                  className="form-control"
                  type="file"
                  id="formFileMultiple"
                  onChange={event => {
                    if (!event.target.files) return;
                    const filesArray = Array.from(event.target.files);
                    const existingFiles = [...values.files];
                    const combinedFiles = [...existingFiles, ...filesArray];
                    values.files = combinedFiles;
                    onchangeDisplayImages(combinedFiles);
                    event.target.value = "";
                    // console.log('formik file value', values.files)
                  }}
                  multiple
                />
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
