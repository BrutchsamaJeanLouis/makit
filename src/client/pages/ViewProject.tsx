import axios from "axios";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { LoadingSpinnerWholePage } from "../components/LoadingSpinners";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const ViewProject = (props: any) => {
  const { projectId } = useParams();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
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

  return (
    <div className='col-md-3' style={{ margin: '10px', minWidth: '850px' }}>
      <div className='card mb-3'>
        <h5 className='card-header'>
          <div className='user-circle-post' style={{ color: 'white' }}>{project.User.username.charAt(0).toUpperCase()}</div>
          <div className='post-user' style={{ display: 'inline-block' }}>
            {project.User.username}
            <p style={{ fontSize: '0.7em' }}>{project.createdAt}</p>
          </div>
          {isOwner &&
            <div className='float-end' style={{ cursor: 'pointer' }}>
              <i className='bi bi-three-dots-vertical' />
            </div>}
        </h5>
        <div className='card-body' style={{ borderTopRightRadius: '50px' }}>
          <h5 className='card-title'>{project.name}</h5>
          <p className='card-text'>{project.description}</p>
          <button href='#' className='btn btn-secondary'>Learn more</button>
        </div>
        <div className='card-footer'>
          <div className='float-end'>
            <i className='bi bi-chat-left-dots' style={{ fontSize: '20px', marginRight: '10px', cursor: 'pointer' }} />
            <i className='bi bi-hand-thumbs-up' style={{ fontSize: '20px', marginRight: '10px', cursor: 'pointer' }} />
            <i className='bi bi-hand-thumbs-down' style={{ fontSize: '20px', marginRight: '10px', cursor: 'pointer' }} />
          </div>
        </div>
        <div className='card-footer'>
          {/* <span style={{whiteSpace: 'nowrap'}}>
              <input className='form-control form-control-lg' placeholder='comment' style={{ display: 'inline' }}/>
              <button className='btn btn-primary' style={{display: 'inline' }}>Post</button>
            </span> */}

          <div className='input-group mb-3'>
            <input type='text' placeholder='comment' className='form-control form-control-lg' />
            <div className='input-group-prepend' style={{ alignItems: 'center', display: 'flex' }}>
              <button className='btn btn-primary palette-pink' type='button' style={{ marginLeft: '10px' }}>Post</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect()(ViewProject);
