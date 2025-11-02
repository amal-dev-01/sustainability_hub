import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createContributor,
  getContributor,
  updateContributor,
  clearSelected,
} from "../../features/contributors/contributorSlice";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Form, Button, Row, Col, Spinner, Alert } from "react-bootstrap";
import { FaSave, FaArrowLeft, FaEdit } from "react-icons/fa";

const ContributorFormPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selected, loading } = useSelector((state) => state.contributors);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    skills: [],
    joined_on: "",
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState(null);

  // Load existing contributor if editing
  useEffect(() => {
    if (id) dispatch(getContributor(id));
    return () => dispatch(clearSelected());
  }, [dispatch, id]);

  // Prefill form when editing
  useEffect(() => {
    if (selected && id) {
      setFormData({
        name: selected.user?.name || "",
        email: selected.user?.email || "",
        password: "", 
        skills: selected.skills?.skills || [],
        joined_on: selected.joined_on?.split("T")[0] || "",
      });
    }
  }, [selected, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSkillsChange = (e) => {
    const value = e.target.value;
    const skillsArray = value.split(",").map((s) => s.trim());
    setFormData((prev) => ({ ...prev, skills: skillsArray }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError(null);

    const payload = {
      user: {
        name: formData.name,
        email: formData.email,
        ...(id ? {} : { password: formData.password }), // only send password if creating
      },
      skills: { skills: formData.skills },
      joined_on: formData.joined_on,
    };

    try {
      if (id) {
        await dispatch(updateContributor({ id, data: payload })).unwrap();
      } else {
        await dispatch(createContributor(payload)).unwrap();
      }
      navigate("/contributors");
    } catch (err) {
      console.error("Error submitting contributor:", err);

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
              <FaEdit className="me-2" /> Edit Contributor
            </>
          ) : (
            <>
              <FaSave className="me-2" /> Add New Contributor
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
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="name">
                  <Form.Label className="fw-semibold">Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter contributor name"
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
                <Form.Group controlId="email">
                <Form.Label className="fw-semibold">Email</Form.Label>
                <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`rounded-3 border ${errors.email ? "border-danger" : "border-secondary"}`}
                />
                {errors.email && (
                    <small className="text-danger">
                    {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                    </small>
                )}
                </Form.Group>
              </Col>
            </Row>

            {!id && (
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group controlId="password">
                    <Form.Label className="fw-semibold">Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      placeholder="Enter password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className={`rounded-3 border ${
                        errors.password ? "border-danger" : "border-secondary"
                      }`}
                    />
                    {errors.password && (
                      <small className="text-danger">
                        {errors.password[0]}
                      </small>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group controlId="skills">
                  <Form.Label className="fw-semibold">Skills</Form.Label>
                  <Form.Control
                    type="text"
                    name="skills"
                    placeholder="Enter comma-separated skills (e.g., Web Development, App Development)"
                    value={formData.skills.join(", ")}
                    onChange={handleSkillsChange}
                    className={`rounded-3 border ${
                      errors.skills ? "border-danger" : "border-secondary"
                    }`}
                  />
                  {errors.skills && (
                    <small className="text-danger">{errors.skills[0]}</small>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-4">
              <Col md={12}>
                <Form.Group controlId="joined_on">
                  <Form.Label className="fw-semibold">Joined On</Form.Label>
                  <Form.Control
                    type="date"
                    name="joined_on"
                    value={formData.joined_on}
                    onChange={handleChange}
                    required
                    className={`rounded-3 border ${
                      errors.joined_on ? "border-danger" : "border-secondary"
                    }`}
                  />
                  {errors.joined_on && (
                    <small className="text-danger">{errors.joined_on[0]}</small>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-between">
              <Button
                variant="outline-secondary"
                className="rounded-pill px-4"
                onClick={() => navigate("/contributors")}
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
                    <FaSave className="me-2" /> Save Contributor
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

export default ContributorFormPage;
