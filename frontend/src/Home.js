import React, { useState } from "react";
import axios from "axios";

const Home = () => {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New state for loading

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResponse(null);
    setLoading(true); // Set loading to true when the request starts

    if (!resume || !jobDescription) {
      setError("Please upload a resume and enter a job description.");
      setLoading(false); // Stop loading if validation fails
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
    } finally {
      setLoading(false); // Stop loading after the request completes
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">
          Resume Analyzer
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Upload your resume and job description to analyze compatibility and get a detailed report.
        </p>
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
              placeholder="Paste the job description here..."
            ></textarea>
          </div>
          <button
            type="submit"
            className={`w-full py-3 px-4 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            }`}
            disabled={loading} // Disable the button while loading
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 text-white mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Analyzing...
              </div>
            ) : (
              "Analyze Resume"
            )}
          </button>
        </form>

        {error && (
          <div className="mt-4 text-red-600 font-medium text-center">{error}</div>
        )}

        {response && (
          <div className="mt-8 p-6 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Analysis Results
            </h2>
            <p className="text-lg">
              <strong>Skills Found:</strong>{" "}
              {response.skills_found?.length > 0
                ? response.skills_found.join(", ")
                : "None"}
            </p>
            <p className="text-lg">
              <strong>Skills Missing:</strong>{" "}
              {response?.skills_missing && response.skills_missing.length > 0
                ? response.skills_missing.join(", ")
                : "None"}
            </p>
            {response.report_path && (
              <a
                href={`http://localhost:5000/download/${response.report_path.split("\\").pop()}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
              >
                Download Feedback Report
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;