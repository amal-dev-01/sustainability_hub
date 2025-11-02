import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  deleteProject,
  setSearch,
  setPage,
  setFilter,
  resetFilters,
} from "../../features/projects/projectSlice";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Form,
  InputGroup,
  Card,
  Row,
  Col,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { PlusCircle, Pencil, Trash2, Search, RefreshCcw } from "lucide-react";
import PaginationComponent from "../../components/project/Pagination";
import ConfirmDeleteModal from "../../components/project/ConfirmDeleteModal";

const ProjectListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, count, loading, params } = useSelector((state) => state.projects);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const currentStatus = params.filters?.status || "";

  useEffect(() => {
    dispatch(fetchProjects({ ...params, ...params.filters }));
  }, [dispatch, params.page, params.search, params.filters]);

  const handleSearch = (e) => {
    dispatch(setSearch(e.target.value));
    dispatch(setPage(1));
  };

  const handleStatusChange = (e) => {
    dispatch(setFilter({ status: e.target.value }));
    dispatch(setPage(1));
  };

  const handleDelete = async () => {
    await dispatch(deleteProject(selectedId));
    setShowModal(false);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-success-subtle text-success border border-success";
      case "COMPLETED":
        return "bg-primary-subtle text-primary border border-primary";
      case "ON_HOLD":
        return "bg-warning-subtle text-warning border border-warning";
      default:
        return "bg-secondary-subtle text-secondary border border-secondary";
    }
  };

  return (
    <div className="container py-4">
      {/*  Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-danger">📁 Project Management</h3>
        <OverlayTrigger placement="left" overlay={<Tooltip>Add Project</Tooltip>}>
          <PlusCircle
            size={32}
            className="text-danger cursor-pointer"
            onClick={() => navigate("/projects/new")}
          />
        </OverlayTrigger>
      </div>

      {/* Filters and Search */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="g-3 align-items-center">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text className="bg-white border-end-0">
                  <Search className="text-danger" size={18} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by project name..."
                  value={params.search}
                  onChange={handleSearch}
                  className="border-start-0"
                />
              </InputGroup>
            </Col>

            <Col md={3}>
              <Form.Select value={currentStatus} onChange={handleStatusChange}>
                <option value="">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
              </Form.Select>
            </Col>

            <Col md="auto">
              <OverlayTrigger placement="top" overlay={<Tooltip>Reset Filters</Tooltip>}>
                <RefreshCcw
                  className="text-secondary cursor-pointer"
                  size={22}
                  onClick={() => {
                    dispatch(resetFilters());
                    dispatch(setSearch(""));
                    dispatch(setPage(1));
                  }}
                />
              </OverlayTrigger>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/*  Projects Table */}
      <Card className="shadow-sm border-0">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5 text-muted">Loading projects...</div>
          ) : (
            <div className="table-responsive">
              <Table hover borderless className="align-middle">
                <thead
                  style={{
                    background: "linear-gradient(90deg, #dc3545 0%, #f87171 100%)",
                    color: "white",
                    borderRadius: "12px",
                  }}
                  className="rounded-top"
                >
                  <tr>
                    <th
                      className="fw-semibold text-uppercase py-3 ps-4"
                      style={{ letterSpacing: "0.05rem" }}
                    >
                      Project Name
                    </th>
                    <th
                      className="fw-semibold text-uppercase py-3"
                      style={{ letterSpacing: "0.05rem" }}
                    >
                      Description
                    </th>
                    <th
                      className="fw-semibold text-uppercase py-3"
                      style={{ letterSpacing: "0.05rem" }}
                    >
                      Status
                    </th>
                    <th
                      className="fw-semibold text-uppercase text-center py-3 pe-4"
                      style={{ letterSpacing: "0.05rem" }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted">
                        No projects found.
                      </td>
                    </tr>
                  ) : (
                    items.map((proj) => (
                      <tr
                        key={proj.id}
                        className="border-bottom"
                        style={{
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#fff5f5")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        <td className="fw-semibold ps-4">{proj.name}</td>
                        <td>{proj.description}</td>
                        <td>
                          <span
                            className={`badge rounded-pill px-3 py-2 ${getStatusBadgeClass(
                              proj.status
                            )}`}
                          >
                            {proj.status === "ACTIVE"
                              ? "Active"
                              : proj.status === "COMPLETED"
                              ? "Completed"
                              : proj.status === "ON_HOLD"
                              ? "On Hold"
                              : "Unknown"}
                          </span>
                        </td>
                        <td className="text-center pe-4">
                          <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                            <Pencil
                              size={20}
                              className="text-primary mx-2 cursor-pointer"
                              onClick={() => navigate(`/projects/${proj.id}/edit`)}
                            />
                          </OverlayTrigger>
                          <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                            <Trash2
                              size={20}
                              className="text-danger mx-2 cursor-pointer"
                              onClick={() => {
                                setSelectedId(proj.id);
                                setShowModal(true);
                              }}
                            />
                          </OverlayTrigger>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Pagination */}
      <div className="mt-4">
        <PaginationComponent
          count={count}
          page={params.page}
          pageSize={params.page_size}
          onPageChange={(p) => dispatch(setPage(p))}
        />
      </div>

      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        isOpen={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default ProjectListPage;
