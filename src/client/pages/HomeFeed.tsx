import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Projectcard from "../components/ProjectCard";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Project from "../../database/models/project";
import { LoadingSpinnerWholePage } from "../components/LoadingSpinners";

const HomeFeed = props => {
  const navigateToPage = useNavigate();
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async () => {
    const method = "GET";
    const url = `/api/project/projects/?page=${page}`;
    const response: any = await axios.get(url).catch(err => console.log(method + url, err.response));
    if (response.data.projects) {
      setProjects(response.data.projects);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  if (loading) return <LoadingSpinnerWholePage />;

  return (
    <div className="home-feed row justify-content-center">
      {/* side view only desktops */}
      <div className="col-md-3 d-none d-lg-flex">
        <div className="card" style={{ minHeight: "70vh" }}>
          <div className="card-body">This is some text within a card body.</div>
        </div>
      </div>
      <div className="col-md-6 d-flex flex-grow-1">
        <div className="w-100">
          <div className="card" style={{ borderTop: "3px solid #ec5f5f" }}>
            <div className="card-body" style={{ height: "100px" }}>
              <button
                className="btn btn-primary float-end mt-lg-4 palette-pink"
                onClick={() => navigateToPage("/list-project")}
              >
                Post a project
              </button>
            </div>
          </div>
          {/* List of Projects */}
          {projects.map((project, index) => (
            <Projectcard key={index} project={project} />
          ))}
        </div>
      </div>
      {/* side view only desktops */}
      <div className="col-md-3 d-none d-lg-flex">
        <div className="card" style={{ minHeight: "70vh" }}>
          <div className="card-body">This is some text within a card body.</div>
        </div>
      </div>
    </div>
  );
};

export default connect()(HomeFeed);
