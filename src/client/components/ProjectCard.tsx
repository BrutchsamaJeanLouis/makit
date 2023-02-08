import React, { useState } from "react";
import { Button, Overlay, OverlayTrigger, Popover } from "react-bootstrap";
import Project from "../../database/models/project";

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

const userCircle = {
  position: "relative",
  backgroundColor: "grey",
  borderRadius: "50%",
  width: "50px",
  height: "50px",
  display: "inline-block",
  lineHeight: "350%",
  textAlign: "center",
  marginRight: "10px"
};

export default function Projectcard({ project, editable = false }: ProjectCardProp) {
  const [showOptions, setShowOptions] = useState(false);

  const { User } = project;

  return (
    <div className="col-md-3 w-100 my-3" style={{ minWidth: "300px" }}>
      <div className="card mb-3">
        <h5 className="card-header">
          <div className="rounded-circle bg-secondary" style={userCircle}>
            {User.username.charAt(0).toUpperCase()}
          </div>
          <div className="post-user" style={{ display: "inline-block" }}>
            {User.username}
            <p style={{ fontSize: "0.7em" }}>{project.createdAt}</p>
          </div>
          {editable && (
            <div className="float-end" style={{ cursor: "pointer" }}>
              <i className="bi bi-three-dots-vertical" />
            </div>
          )}
        </h5>
        <div className="card-body" style={{ borderTopRightRadius: "50px" }}>
          <h5 className="card-title">{project.name}</h5>
          <p className="card-text">{project.description}</p>
          <button href="#" className="btn btn-link px-0" style={{ color: "#ec5f5f" }}>
            Read more
          </button>
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
