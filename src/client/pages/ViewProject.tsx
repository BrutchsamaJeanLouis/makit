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
import Project from "../../database/models/project";
import ModelHelper from "../../utils/ModelHelper";

const ViewProject = (props: any) => {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState<Project>(ModelHelper.null);
  const [serverError, setServerError] = useState(null);

  const user: any = useSelector((reduxState: RootState) => reduxState.auth.user);
  const isOwnerOfProject: boolean = project?.userId === user.id;

  const fetchProject = async () => {
    const response: any = await axios.get(`/api/project/${projectId}`).catch(err => setServerError(err.response.data));
    response.data.project && setProject(response.data.project);
    setLoading(false);
  };

  useEffect(() => {
    fetchProject();
  }, []);

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
    <div className="view-project col-lg-8 mx-auto" style={{ margin: "10px" }}>
      <div className="card mb-3">
        <h5 className="card-header">
          <div className="rounded-circle bg-secondary user-circle">{project.User.username.charAt(0).toUpperCase()}</div>
          <div className="post-user" style={{ display: "inline-block" }}>
            {project.User.username}
            <p style={{ fontSize: "0.7em" }}>{project.createdAt.toString()}</p>
          </div>
          {isOwnerOfProject && (
            <div className="float-end" style={{ cursor: "pointer" }}>
              <i className="bi bi-three-dots-vertical" />
            </div>
          )}
        </h5>
        <div className="card-body" style={{ borderTopRightRadius: "50px" }}>
          <h5 className="card-title text-center pb-3">{project.title}</h5>
          <div className="progresses justify-content-center pb-5">
            <div className="steps" style={styles.phaseProgress.ideaSpan}>
              <span className="text-center">
                Idea
                <i className="bi bi-lightbulb text-white" />
              </span>
            </div>
            <span className="line" style={styles.phaseProgress.planLine}></span>
            <div className="steps" style={styles.phaseProgress.planSpan}>
              <span className="text-center">
                Planning
                <i className="bi bi-book text-white" />
              </span>
            </div>
            <span className="line" style={styles.phaseProgress.creationLine}></span>
            <div className="steps" style={styles.phaseProgress.creationSpan}>
              <span className="text-center">
                Creation
                <i className="bi bi-wrench-adjustable text-white" />
              </span>
            </div>
            <span className="line" style={styles.phaseProgress.launchLine}></span>
            <div className="steps" style={styles.phaseProgress.launchSpan}>
              <span className="text-center">
                Launch
                <i className="bi bi-rocket-takeoff text-white" />
              </span>
            </div>
          </div>
          <div className="card-text">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="markdown">
              {project.description}
            </ReactMarkdown>
          </div>
          <div className="hashtags mb-3">
            {project.ProjectHashTags.length > 0 &&
              project.ProjectHashTags.map((projectHashTag, i) => (
                <span key={i} className="palette-pink-text pe-2">
                  {projectHashTag.HashTag.name}
                </span>
              ))}
          </div>
          {/* TODO: polls result is currently dummy data */}
          <div className="polls mx-auto pt-5" style={{ maxWidth: "550px" }}>
            {project.Polls?.map((poll, i) => (
              <div key={i} className="card mb-3" style={{ width: "18rem;" }}>
                <div className="card-header" style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}>
                  {poll.question}
                </div>
                <div className="card-body">
                  {poll?.PollChoices?.map((choice, i) => (
                    <div key={i}>
                      {choice.option}
                      <div key={i} className="progress mb-2" style={{ backgroundColor: "#ccc" }}>
                        <div className="progress-bar" role="progressbar" style={{ width: "25%" }}>
                          {choice.PollVotes.length} %
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
