import React, { useState } from "react";
import axios from "axios";

const AnalysisResume = () => {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponse(null);

    if (!resume || !jobDescription) {
      setError("Please upload a resume and enter a job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("job_description", jobDescription);

    try {
      const res = await axios.post("http://localhost:5000/analyze", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Response Data:", res.data); // Debugging
      setResponse(res.data);
    } catch (err) {
      console.error("Error:", err);
      setError("An error occurred while analyzing the resume.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
        Resume Analyzer
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="resume"
            className="block text-lg font-medium text-gray-700"
          >
            Upload Resume (PDF):
          </label>
          <input
            type="file"
            id="resume"
            accept=".pdf"
            onChange={handleFileChange}
            className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="jobDescription"
            className="block text-lg font-medium text-gray-700"
          >
            Job Description:
          </label>
          <textarea
            id="jobDescription"
            rows="5"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Analyze Resume
        </button>
      </form>

      {error && (
        <div className="mt-4 text-red-600 font-medium text-center">{error}</div>
      )}

      {response && (
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Analysis Results
          </h2>
          <p>
            <strong>Match Score:</strong> {response.match_score.toFixed(2)}
          </p>
          {response.skills_found.length > 0 ? (
            <p><strong>Skills Found:</strong> {response.skills_found.join(", ")}</p>
          ) : (
            <p><strong>Skills Found:</strong> None</p>
          )}
          {response.skills_missing.length > 0 ? (
            <p><strong>Skills Missing:</strong> {response.skills_missing.join(", ")}</p>
          ) : (
            <p><strong>Skills Missing:</strong> None</p>
          )}
          <a
            href={`http://localhost:5000/${response.report_path}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Download Feedback Report
          </a>
        </div>
      )}
    </div>
  );
};

export default AnalysisResume;