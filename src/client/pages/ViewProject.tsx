import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { LoadingSpinnerWholePage } from "../components/LoadingSpinners";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import "./ViewProject.css";
import Project from "../../database/models/project";
import ModelHelper from "../../utils/ModelHelper";

const ViewProject = (props: any) => {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project>(ModelHelper.null);
  const [serverError, setServerError] = useState(null);

  const user: any = useSelector((reduxState: RootState) => reduxState.auth.user);

  const fetchProject = async () => {
    const response: any = await axios.get(`/api/project/${projectId}`).catch(err => setServerError(err.response.data));
    response.data.project && setProject(response.data.project);
    setLoading(false);
  };

  useEffect(() => {
    fetchProject();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isOwner = project?.userId === user.id;
  if (loading) {
    return <LoadingSpinnerWholePage />;
  }

  const lightPlanStep = project.phase === "planning" || project.phase === "creation" || project.phase === "launch";
  const lightCreationStep = project.phase === "creation" || project.phase === "launch";
  const lightLaunchStep = project.phase === "launch";

  const styles = {
    phaseProgress: {
      ideaSpan: { backgroundColor: "#ec5f5f" },
      planSpan: { backgroundColor: lightPlanStep ? "#ec5f5f" : "#a7a6a6" },
      planLine: { backgroundColor: lightPlanStep ? "#fd9999" : "#c9c9c9" },
      creationSpan: { backgroundColor: lightCreationStep ? "#ec5f5f" : "#a7a6a6" },
      creationLine: { backgroundColor: lightCreationStep ? "#fd9999" : "#c9c9c9" },
      launchSpan: { backgroundColor: lightLaunchStep ? "#ec5f5f" : "#a7a6a6" },
      launchLine: { backgroundColor: lightLaunchStep ? "#fd9999" : "#c9c9c9" }
    }
  };

  return (
    <div className="view-project col-lg-12" style={{ margin: "10px" }}>
      <div className="card mb-3">
        <h5 className="card-header">
          <div className="user-circle-post" style={{ color: "white" }}>
            {project.User.username.charAt(0).toUpperCase()}
          </div>
          <div className="post-user" style={{ display: "inline-block" }}>
            {project.User.username}
            <p style={{ fontSize: "0.7em" }}>{project.createdAt.toString()}</p>
          </div>
          {isOwner && (
            <div className="float-end" style={{ cursor: "pointer" }}>
              <i className="bi bi-three-dots-vertical" />
            </div>
          )}
        </h5>
        <div className="card-body" style={{ borderTopRightRadius: "50px" }}>
          <div className="progresses justify-content-center pb-5">
            <div className="steps" style={styles.phaseProgress.ideaSpan}>
              <span>Idea</span>
            </div>
            <span className="line" style={styles.phaseProgress.planLine}></span>

            <div className="steps" style={styles.phaseProgress.planSpan}>
              <span>Planning</span>
            </div>

            <span className="line" style={styles.phaseProgress.creationLine}></span>

            <div className="steps" style={styles.phaseProgress.creationSpan}>
              <span>Creation</span>
            </div>
            <span className="line" style={styles.phaseProgress.launchLine}></span>

            <div className="steps" style={styles.phaseProgress.launchSpan}>
              <span>Launch</span>
            </div>
          </div>
          <h5 className="card-title">{project.title}</h5>
          <div className="card-text">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="markdown">
              {project.description}
            </ReactMarkdown>
          </div>
        </div>
        <div className="card-footer">
          <div className="float-end">
            <i className="bi bi-chat-left-dots" style={{ fontSize: "20px", marginRight: "10px", cursor: "pointer" }} />
            <i className="bi bi-hand-thumbs-up" style={{ fontSize: "20px", marginRight: "10px", cursor: "pointer" }} />
            <i
              className="bi bi-hand-thumbs-down"
              style={{ fontSize: "20px", marginRight: "10px", cursor: "pointer" }}
            />
          </div>
        </div>
        <div className="card-footer">
          {/* <span style={{whiteSpace: 'nowrap'}}>
              <input className='form-control form-control-lg' placeholder='comment' style={{ display: 'inline' }}/>
              <button className='btn btn-primary' style={{display: 'inline' }}>Post</button>
            </span> */}

          <div className="input-group mb-3">
            <input type="text" placeholder="comment" className="form-control form-control-lg" />
            <div className="input-group-prepend" style={{ alignItems: "center", display: "flex" }}>
              <button className="btn btn-primary palette-pink" type="button" style={{ marginLeft: "10px" }}>
                Comment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect()(ViewProject);