import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardSummary } from "../../features/dashboard/dashboardSlice";
import { Spinner, Alert, Row, Col, Card, Table } from "react-bootstrap";
import {
  FaTasks,
  FaUsers,
  FaProjectDiagram,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { summary, loading, error } = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardSummary());
  }, [dispatch]);

  if (loading)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (error)
    return (
      <Alert variant="danger" className="mt-4 text-center fw-semibold">
        {error}
      </Alert>
    );

  if (!summary) return null;

  const { projects, tasks, contributors, recent_projects } = summary;

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">
        📊 Dashboard Overview
      </h2>

      {/* Summary Cards */}
      <Row className="g-4">
        <Col md={3}>
          <Card className="dashboard-card bg-gradient-primary text-white border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase mb-1">Projects</h6>
                  <h2>{projects.total}</h2>
                  <small>
                    Active: {projects.active} | Completed: {projects.completed}
                  </small>
                </div>
                <FaProjectDiagram size={32} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="dashboard-card bg-gradient-success text-white border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase mb-1">Tasks</h6>
                  <h2>{tasks.total}</h2>
                  <small>
                    Completed: {tasks.completed} | Overdue: {tasks.overdue}
                  </small>
                </div>
                <FaTasks size={32} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="dashboard-card bg-gradient-warning text-dark border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase mb-1">Pending</h6>
                  <h2>{tasks.pending}</h2>
                  <small>Tasks awaiting completion</small>
                </div>
                <FaClock size={32} />
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="dashboard-card bg-gradient-info text-white border-0 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase mb-1">Contributors</h6>
                  <h2>{contributors.total}</h2>
                  <small>Active collaborators</small>
                </div>
                <FaUsers size={32} />
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Projects */}
      <div className="mt-5">
        <h5 className="fw-semibold mb-3">🧱 Recent Projects</h5>
        {recent_projects.length === 0 ? (
          <div className="text-center text-muted py-4">
            No recent projects found
          </div>
        ) : (
          <div className="modern-table">
            {recent_projects.map((proj) => (
              <Card
                key={proj.id}
                className="border-0 shadow-sm p-3 mb-3 rounded-3 project-card hover-lift"
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="fw-bold mb-1">{proj.name}</h6>
                    <small className="text-muted text-capitalize">
                      {proj.status}
                    </small>
                  </div>
                  <div className="d-flex align-items-center gap-3">
                    <div className="text-center">
                      <span className="fw-bold">{proj.total_tasks}</span>
                      <div className="text-muted small">Tasks</div>
                    </div>
                    <div className="text-center text-success">
                      <FaCheckCircle /> {proj.completed_tasks}
                    </div>
                    <div className="text-center text-danger">
                      <FaClock /> {proj.overdue_tasks}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* 💅 Extra Styles */}
      <style jsx="true">{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #4e73df, #224abe);
        }
        .bg-gradient-success {
          background: linear-gradient(135deg, #1cc88a, #0e8a62);
        }
        .bg-gradient-warning {
          background: linear-gradient(135deg, #f6c23e, #dda20a);
        }
        .bg-gradient-info {
          background: linear-gradient(135deg, #36b9cc, #258fa3);
        }
        .dashboard-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          cursor: pointer;
        }
        .dashboard-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        }
        .hover-lift {
          transition: all 0.2s ease-in-out;
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;
