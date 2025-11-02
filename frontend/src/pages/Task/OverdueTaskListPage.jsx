import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOverdueTasks, deleteTask } from "../../features/tasks/taskSlice";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Form,
  InputGroup,
  Card,
  OverlayTrigger,
  Tooltip,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import { Search, RefreshCcw } from "lucide-react";
import ConfirmDeleteModal from "../../components/project/ConfirmDeleteModal";

const OverdueTaskListPage = () => {
  const dispatch = useDispatch();

  const { overdueTasks: items, loadingOverdue: loading } = useSelector(
    (state) => state.tasks
  );

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(fetchOverdueTasks({ search }));
  }, [dispatch, search]);

  const handleDelete = async () => {
    await dispatch(deleteTask(selectedId));
    setShowModal(false);
    dispatch(fetchOverdueTasks({ search }));
  };

  

  return (
    <div className="container py-4">
      {/*  Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-danger">⚠️ Overdue Tasks</h3>
      </div>

      {/* Search */}
      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="align-items-center g-3">
            <Col md={5}>
              <InputGroup>
                <InputGroup.Text className="bg-white border-end-0">
                  <Search className="text-danger" size={18} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Search overdue tasks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border-start-0"
                />
              </InputGroup>
            </Col>
            <Col md="auto">
              <OverlayTrigger placement="top" overlay={<Tooltip>Refresh</Tooltip>}>
                <RefreshCcw
                  className="text-secondary cursor-pointer"
                  size={22}
                  onClick={() => {
                    setSearch("");
                    dispatch(fetchOverdueTasks());
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
            <div className="text-center py-5 text-muted">Loading overdue tasks...</div>
          ) : (
            <div className="table-responsive">
              <Table hover borderless className="align-middle">
                <thead
                  style={{
                    background: "linear-gradient(90deg, #dc3545 0%, #ff6b6b 100%)",
                    color: "white",
                  }}
                >
                  <tr>
                    <th className="fw-semibold text-uppercase py-3 ps-4">Title</th>
                    <th className="fw-semibold text-uppercase py-3">Project</th>
                    <th className="fw-semibold text-uppercase py-3">Due Date</th>
                    <th className="fw-semibold text-uppercase py-3">Assigned To</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-muted">
                        No overdue tasks found.
                      </td>
                    </tr>
                  ) : (
                    items.map((task) => {
                      return (
                        <tr
                          key={task.id}
                          className="border-bottom"
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#fff5f5")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "transparent")
                          }
                        >
                          <td className="fw-semibold ps-4">{task.title}</td>
                          <td>{task.project?.name || "—"}</td>
                          <td>{task.due_date || "—"}</td>
                          <td>
                            {task.assigned_to?.length > 0 ? (
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

      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        isOpen={showModal}
        onCancel={() => setShowModal(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default OverdueTaskListPage;
