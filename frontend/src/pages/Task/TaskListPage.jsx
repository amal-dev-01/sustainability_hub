import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  deleteTask,
  setSearch,
  setPage,
  setFilter,
  resetFilters,
} from "../../features/tasks/taskSlice";
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
  Badge,
} from "react-bootstrap";
import { PlusCircle, Pencil, Trash2, Search, RefreshCcw } from "lucide-react";
import PaginationComponent from "../../components/project/Pagination";
import ConfirmDeleteModal from "../../components/project/ConfirmDeleteModal";

const TaskListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, count, loading, params } = useSelector((state) => state.tasks);
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const currentStatus = params.filters?.status || ""; 

  useEffect(() => {
    dispatch(fetchTasks({ ...params, ...params.filters }));
  }, [dispatch, params.page, params.search, params.filters]);

  const handleSearch = (e) => {
    dispatch(setSearch(e.target.value));
    dispatch(setPage(1));
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;

    let filters = { ...params.filters };

    if (value === "") {
      // clear filters
      filters = {};
    } else if (value === "pending") {
      filters = { is_completed: false, is_overdue: false, status: "pending" };
    } else if (value === "completed") {
      filters = { is_completed: true, is_overdue: false, status: "completed" };
    } else if (value === "overdue") {
      filters = { is_completed: false, is_overdue: true, status: "overdue" };
    }

    dispatch(setFilter(filters));
    dispatch(setPage(1));
  };

  const handleDelete = async () => {
    await dispatch(deleteTask(selectedId));
    setShowModal(false);
  };

  const getStatusBadge = (is_completed, is_overdue) => {
    if (is_completed) {
      return {
        label: "Completed",
        className: "bg-success-subtle text-success border border-success",
      };
    } else if (is_overdue) {
      return {
        label: "Overdue",
        className: "bg-danger-subtle text-danger border border-danger",
      };
    } else {
      return {
        label: "Pending",
        className: "bg-warning-subtle text-warning border border-warning",
      };
    }
  };

  return (
    <div className="container py-4">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-danger">📝 Task Management</h3>
        <OverlayTrigger placement="left" overlay={<Tooltip>Add Task</Tooltip>}>
          <PlusCircle
            size={32}
            className="text-danger cursor-pointer"
            onClick={() => navigate("/tasks/new")}
          />
        </OverlayTrigger>
      </div>

      {/*  Filters and Search */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="g-3 align-items-center">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text className="bg-white border-end-0">
                  <Search className="text-danger" size={18} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search by task title..."
                  value={params.search}
                  onChange={handleSearch}
                  className="border-start-0"
                />
              </InputGroup>
            </Col>

            {/* Unified Status Filter */}
            <Col md={3}>
              <Form.Select value={currentStatus} onChange={handleStatusChange}>
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
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

      {/* Tasks Table */}
      <Card className="shadow-sm border-0">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5 text-muted">Loading tasks...</div>
          ) : (
            <div className="table-responsive">
              <Table hover borderless className="align-middle">
                <thead
                  style={{
                    background: "linear-gradient(90deg, #0d6efd 0%, #6ea8fe 100%)",
                    color: "white",
                    borderRadius: "12px",
                  }}
                  className="rounded-top"
                >
                  <tr>
                    <th className="fw-semibold text-uppercase py-3 ps-4">Title</th>
                    <th className="fw-semibold text-uppercase py-3">Project</th>
                    <th className="fw-semibold text-uppercase py-3">Due Date</th>
                    <th className="fw-semibold text-uppercase py-3">Assigned To</th>
                    <th className="fw-semibold text-uppercase py-3">Status</th>
                    <th className="fw-semibold text-uppercase text-center py-3 pe-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No tasks found.
                      </td>
                    </tr>
                  ) : (
                    items.map((task) => {
                      const { label, className } = getStatusBadge(
                        task.is_completed,
                        task.is_overdue
                      );
                      return (
                        <tr
                          key={task.id}
                          className="border-bottom"
                          style={{ transition: "background-color 0.2s" }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#f0f7ff")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "transparent")
                          }
                        >
                          <td className="fw-semibold ps-4">{task.title}</td>
                          <td>{task.project?.name || "—"}</td>
                          <td>{task.due_date || "—"}</td>
                          <td>
                            {task.assigned_to && task.assigned_to.length > 0 ? (
                              task.assigned_to.map((user) => (
                                <Badge
                                  key={user.id || user.name}
                                  bg="light"
                                  text="dark"
                                  className="me-1 border"
                                >
                                  {user.user?.name || "Unnamed"}
                                </Badge>
                              ))
                            ) : (
                              <span className="text-muted">Unassigned</span>
                            )}
                          </td>
                          <td>
                            <span
                              className={`badge rounded-pill px-3 py-2 ${className}`}
                            >
                              {label}
                            </span>
                          </td>
                          <td className="text-center pe-4">
                            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                              <Pencil
                                size={20}
                                className="text-primary mx-2 cursor-pointer"
                                onClick={() => navigate(`/tasks/${task.id}/edit`)}
                              />
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                              <Trash2
                                size={20}
                                className="text-danger mx-2 cursor-pointer"
                                onClick={() => {
                                  setSelectedId(task.id);
                                  setShowModal(true);
                                }}
                              />
                            </OverlayTrigger>
                          </td>
                        </tr>
                      );
                    })
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

export default TaskListPage;
