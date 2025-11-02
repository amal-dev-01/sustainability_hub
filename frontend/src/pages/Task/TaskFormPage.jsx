import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createTask,
  getTask,
  updateTask,
  clearSelected,
} from "../../features/tasks/taskSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Form, Button, Row, Col, Spinner, Alert } from "react-bootstrap";
import { FaSave, FaArrowLeft, FaEdit } from "react-icons/fa";
import AsyncSelect from "react-select/async";
import projectAPI from "../../features/projects/projectAPI";
import contributorAPI from "../../features/contributors/contributorAPI";

const TaskFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selected, loading } = useSelector((state) => state.tasks);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    project_id: "",
    due_date: "",
    is_completed: false,
    assigned_to_ids: [],
  });

  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedContributors, setSelectedContributors] = useState([]);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  useEffect(() => {
    if (id) dispatch(getTask(id));
    return () => dispatch(clearSelected());
  }, [dispatch, id]);

  useEffect(() => {
    if (selected && id) {
      setFormData({
        title: selected.title || "",
        description: selected.description || "",
        project_id: selected.project?.id || "",
        due_date: selected.due_date || "",
        is_completed: selected.is_completed || false,
        assigned_to_ids: selected.assigned_to
          ? selected.assigned_to.map((a) => a.id)
          : [],
      });

      if (selected.project) {
        setSelectedProject({
          value: selected.project.id,
          label: selected.project.name,
        });
      }

      if (selected.assigned_to) {
        setSelectedContributors(
          selected.assigned_to.map((c) => ({
            value: c.id,
            label: c.user?.name || "Unnamed Contributor",
          }))
        );
      }
    }
  }, [selected, id]);


  const loadProjectOptions = async (inputValue) => {
    try {
      const data = await projectAPI.search(inputValue);
      return (data.results || data).map((proj) => ({
        label: proj.name,
        value: proj.id,
      }));
    } catch (error) {
      console.error("Error loading projects:", error);
      return [];
    }
  };

  const loadContributorOptions = async (inputValue) => {
    try {
      const data = await contributorAPI.search(inputValue);
      return (data.results || data).map((c) => ({
        label: c.user?.name || "Unnamed Contributor",
        value: c.id,
      }));
    } catch (error) {
      console.error("Error loading contributors:", error);
      return [];
    }
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);

    try {
      const payload = {
        ...formData,
        project_id: selectedProject?.value || "",
        assigned_to_ids: selectedContributors.map((c) => c.value),
      };

      if (id) {
        await dispatch(updateTask({ id, data: payload })).unwrap();
      } else {
        await dispatch(createTask(payload)).unwrap();
      }

      navigate("/tasks");
    } catch (err) {
      console.error("Error submitting task:", err);
      if (err.errors) setErrors(err.errors);
      else if (typeof err === "object" && err !== null) {
        setErrors(err);
        if (err.non_field_errors) setGeneralError(err.non_field_errors[0]);
        else if (err.detail) setGeneralError(err.detail);
      } else setGeneralError("An unexpected error occurred.");
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
              <FaEdit className="me-2" /> Edit Task
            </>
          ) : (
            <>
              <FaSave className="me-2" /> Add New Task
            </>
          )}
        </Card.Header>

        <Card.Body className="p-4">
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
            {/* TITLE + PROJECT */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="title">
                  <Form.Label className="fw-semibold">Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    placeholder="Enter task title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className={`rounded-3 border ${
                      errors.title ? "border-danger" : "border-secondary"
                    }`}
                  />
                  {errors.title && (
                    <small className="text-danger">{errors.title[0]}</small>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="project_id">
                  <Form.Label className="fw-semibold">Project</Form.Label>
                  <AsyncSelect
                    cacheOptions
                    defaultOptions
                    loadOptions={loadProjectOptions}
                    value={selectedProject}
                    onChange={(selected) => {
                      setSelectedProject(selected);
                      setFormData({
                        ...formData,
                        project_id: selected ? selected.value : "",
                      });
                    }}
                    placeholder="Search project..."
                    isClearable
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "0.5rem",
                        borderColor: errors.project_id ? "red" : "#ced4da",
                      }),
                    }}
                  />
                  {errors.project_id && (
                    <small className="text-danger">
                      {errors.project_id[0]}
                    </small>
                  )}
                </Form.Group>
              </Col>
            </Row>

            {/* DUE DATE + STATUS */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="due_date">
                  <Form.Label className="fw-semibold">Due Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="due_date"
                    value={formData.due_date}
                    onChange={handleChange}
                    className={`rounded-3 border ${
                      errors.due_date ? "border-danger" : "border-secondary"
                    }`}
                  />
                  {errors.due_date && (
                    <small className="text-danger">{errors.due_date[0]}</small>
                  )}
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group controlId="is_completed">
                  <Form.Label className="fw-semibold">Status</Form.Label>
                  <Form.Select
                    name="is_completed"
                    value={formData.is_completed ? "true" : "false"}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        is_completed: e.target.value === "true",
                      })
                    }
                    className="rounded-3 border border-secondary"
                  >
                    <option value="false">Pending</option>
                    <option value="true">Completed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            {/* ASSIGN TO (ASYNC MULTI) */}
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group controlId="assigned_to_ids">
                  <Form.Label className="fw-semibold">Assign To</Form.Label>
                  <AsyncSelect
                    isMulti
                    cacheOptions
                    defaultOptions
                    loadOptions={loadContributorOptions}
                    value={selectedContributors}
                    onChange={(selected) => setSelectedContributors(selected || [])}
                    placeholder="Search and select contributors..."
                    styles={{
                      control: (base) => ({
                        ...base,
                        borderRadius: "0.5rem",
                        borderColor: errors.assigned_to_ids ? "red" : "#ced4da",
                      }),
                    }}
                  />
                  {errors.assigned_to_ids && (
                    <small className="text-danger">
                      {errors.assigned_to_ids[0]}
                    </small>
                  )}
                </Form.Group>
              </Col>
            </Row>

            {/* DESCRIPTION */}
            <Row className="mb-4">
              <Col md={12}>
                <Form.Group controlId="description">
                  <Form.Label className="fw-semibold">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    placeholder="Enter task description"
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

            {/* BUTTONS */}
            <div className="d-flex justify-content-between">
              <Button
                variant="outline-secondary"
                className="rounded-pill px-4"
                onClick={() => navigate("/tasks")}
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
                    <FaSave className="me-2" /> Save Task
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

export default TaskFormPage;
