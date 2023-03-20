import React, { useState } from "react";
import { Button, Overlay, OverlayTrigger, Popover } from "react-bootstrap";
import Project from "../../database/models/project";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import { useNavigate } from "react-router-dom";

// const optionsPopover = (props) => {
//   return (
//     <Popover key={2049539} className='pop' id='popover-basic'>
//       <Popover.Header as='h3'>Popover right</Popover.Header>
//       <Popover.Body>
//         And here's some <strong>amazing</strong> content. It's very engaging.
//         right?
//       </Popover.Body>
//     </Popover>
//   )
// }
type ProjectCardProp = {
  project: Project;
  editable?: boolean;
};

function randColor() {
  var letters = "BCDEF".split("");
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

export default function ProjectCard({ project, editable = false }: ProjectCardProp) {
  const navigateToPage = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const [userCircleColor] = useState(randColor());

  const { User } = project;

  const styles = {
    userCircle: {
      backgroundColor: userCircleColor
    }
  };

  return (
    <div className="project-card col-md-3 w-100 my-3">
      <div className="card mb-3 pt-3">
        <h5 className="card-header bg-white">
          <div style={styles.userCircle} className="rounded-circle user-circle">
            {User.username.charAt(0).toUpperCase()}
          </div>
          <div className="post-user" style={{ display: "inline-block" }}>
            {User.username}
            <p style={{ fontSize: "0.7em" }}>{project.createdAt.toString()}</p>
          </div>
          {editable && (
            <div className="float-end" style={{ cursor: "pointer" }}>
              <i className="bi bi-three-dots-vertical" />
            </div>
          )}
        </h5>
        <div
          className="card-body point px-5"
          style={{ borderTopRightRadius: "50px" }}
          onClick={() => navigateToPage(`/view-project/${project.id}`)}
        >
          <h5 className="card-title text-center">{project.title}</h5>
          <p className="card-text">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} className="markdown">
              {project.description}
            </ReactMarkdown>
          </p>
          <button className="btn btn-link px-0" style={{ color: "#ec5f5f" }}>
            Read more
          </button>
        </div>
        <div className="card-footer bg-white">
          <div className="float-end">
            <i className="bi bi-chat-left-dots" style={{ fontSize: "20px", marginRight: "10px", cursor: "pointer" }} />
            <i className="bi bi-hand-thumbs-up" style={{ fontSize: "20px", marginRight: "10px", cursor: "pointer" }} />
            <i
              className="bi bi-hand-thumbs-down"
              style={{ fontSize: "20px", marginRight: "10px", cursor: "pointer" }}
            />
          </div>
        </div>
        {/* <div className='card-footer'>
          <div className='input-group mb-3'>
            <input type='text' placeholder='comment' className='form-control form-control-lg' />
            <div className='input-group-prepend' style={{ alignItems: 'center', display: 'flex' }}>
              <button className='btn btn-primary' type='button' style={{ marginLeft: '10px' }}>Post</button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
}
