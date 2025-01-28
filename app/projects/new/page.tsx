"use client";
import React, { useState } from "react";
import axios from "axios";

const NewProject = () => {
  const [projectName, setProjectName] = useState("");
  const [projectWebUrl, setProjectWebUrl] = useState("");
  const [projectDescription, setProjectDescription] = useState("");

  const handleCreateProject = async () => {
    if (!projectName || !projectDescription) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/project/create-project`,
        {
          projectName,
          projectDescription,
          projectWebUrl
        },{
          headers : {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (response.status === 201) {
        alert("Project created successfully!");
        setProjectName(""); // Clear the input fields
        setProjectDescription("");
        window.location.href = "/projects"
      }
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Create New Project</h2>
      <input
        type="text"
        placeholder="Project Name"
        className="w-full p-2 mb-4 border rounded"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Project Name"
        className="w-full p-2 mb-4 border rounded"
        value={projectName}
        onChange={(e) => setProjectWebUrl(e.target.value)}
      />
      <textarea
        placeholder="Project Description"
        className="w-full p-2 mb-4 border rounded"
        value={projectDescription}
        onChange={(e) => setProjectDescription(e.target.value)}
      />
      <button
        onClick={handleCreateProject}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        Create Project
      </button>
    </div>
  );
};

export default NewProject;
