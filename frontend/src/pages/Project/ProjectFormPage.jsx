import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createProject,
  getProject,
  updateProject,
  clearSelected,
} from "../../features/projects/projectSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Form, Button, Row, Col, Spinner, Alert } from "react-bootstrap";
import { FaSave, FaArrowLeft, FaEdit } from "react-icons/fa";

const ProjectFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selected, loading } = useSelector((state) => state.projects);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "",
    location: "",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  // Load existing project if editing
  useEffect(() => {
    if (id) dispatch(getProject(id));
    return () => dispatch(clearSelected());
  }, [dispatch, id]);

  // Prefill form for edit mode
  useEffect(() => {
    if (selected && id) {
      setFormData({
        name: selected.name || "",
        description: selected.description || "",
        status: selected.status || "",
        location: selected.location || "",
      });
    }
  }, [selected, id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);

    try {
      if (id) {
        await dispatch(updateProject({ id, data: formData })).unwrap();
      } else {
        await dispatch(createProject(formData)).unwrap();
      }
      navigate("/projects");
    } catch (err) {
      console.error("Error submitting project:", err);

      if (err.errors) {
        setErrors(err.errors);
      } else if (typeof err === "object" && err !== null) {
        setErrors(err);
        if (err.non_field_errors) {
          setGeneralError(err.non_field_errors[0]);
        } else if (err.detail) {
          setGeneralError(err.detail);
        }
      } else {
        setGeneralError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center py-4">
      <Card
        className="shadow-lg rounded-4 border-0 w-75"
        style={{ maxWidth: "800px" }}
      >
        <Card.Header
          className="text-center py-3 fw-bold fs-5"
          style={{
            background: "linear-gradient(90deg, #dc3545, #ff4d4d)",
            color: "white",
            borderTopLeftRadius: "1rem",
            borderTopRightRadius: "1rem",
          }}
        >
          {id ? (
            <>
              <FaEdit className="me-2" /> Edit Project
            </>
          ) : (
            <>
              <FaSave className="me-2" /> Add New Project
            </>
          )}
        </Card.Header>

        <Card.Body className="p-4">
          {/* General error alert */}
          {generalError && (
            <Alert
              variant="danger"
              onClose={() => setGeneralError(null)}
              dismissible
              className="mb-3"
            >
              {generalError}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="name">
                  <Form.Label className="fw-semibold">Project Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter project name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`rounded-3 border ${
                      errors.name ? "border-danger" : "border-secondary"
                    }`}
                  />
                  {errors.name && (
                    <small className="text-danger">{errors.name[0]}</small>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="status">
                  <Form.Label className="fw-semibold">Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className={`rounded-3 border ${
                      errors.status ? "border-danger" : "border-secondary"
                    }`}
                    required
                  >
                    <option value="">Select status...</option>
                    <option value="ACTIVE">Active</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="ON_HOLD">On Hold</option>
                  </Form.Select>
                  {errors.status && (
                    <small className="text-danger">{errors.status[0]}</small>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group controlId="location">
                  <Form.Label className="fw-semibold">Location</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    placeholder="Enter project location"
                    value={formData.location}
                    onChange={handleChange}
                    className={`rounded-3 border ${
                      errors.location ? "border-danger" : "border-secondary"
                    }`}
                  />
                  {errors.location && (
                    <small className="text-danger">{errors.location[0]}</small>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={12}>
                <Form.Group controlId="description">
                  <Form.Label className="fw-semibold">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    placeholder="Enter project description"
                    value={formData.description}
                    onChange={handleChange}
                    className={`rounded-3 border ${
                      errors.description ? "border-danger" : "border-secondary"
                    }`}
                  />
                  {errors.description && (
                    <small className="text-danger">
                      {errors.description[0]}
                    </small>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-between">
              <Button
                variant="outline-secondary"
                className="rounded-pill px-4"
                onClick={() => navigate("/projects")}
              >
                <FaArrowLeft className="me-2" /> Back
              </Button>

              <Button
                type="submit"
                className="rounded-pill px-4"
                style={{
                  background: "linear-gradient(90deg, #dc3545, #ff4d4d)",
                  border: "none",
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner
                      animation="border"
                      size="sm"
                      className="me-2 text-light"
                    />
                    Saving...
                  </>
                ) : (
                  <>
                    <FaSave className="me-2" /> Save Project
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProjectFormPage;
