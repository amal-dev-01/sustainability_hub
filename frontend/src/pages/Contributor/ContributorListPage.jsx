import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchContributors,
  deleteContributor,
  setSearch,
  setPage,
  setFilter,
  resetFilters,
} from "../../features/contributors/contributorSlice";
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

const ContributorListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, count, loading, params } = useSelector(
    (state) => state.contributors
  );

  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Load contributors on mount & param change
  useEffect(() => {
    dispatch(fetchContributors({ ...params, ...params.filters }));
  }, [dispatch, params.page, params.search, params.filters]);

  const handleSearch = (e) => {
    dispatch(setSearch(e.target.value));
    dispatch(setPage(1));
  };


  const handleDelete = async () => {
    await dispatch(deleteContributor(selectedId));
    setShowModal(false);
  };


  return (
    <div className="container py-4">
      {/*  Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-danger">👥 Contributor Management</h3>
        <OverlayTrigger placement="left" overlay={<Tooltip>Add Contributor</Tooltip>}>
          <PlusCircle
            size={32}
            className="text-danger cursor-pointer"
            onClick={() => navigate("/contributors/new")}
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
                  placeholder="Search by contributor name..."
                  value={params.search}
                  onChange={handleSearch}
                  className="border-start-0"
                />
              </InputGroup>
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

      {/* Contributors Table */}
      <Card className="shadow-sm border-0">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5 text-muted">Loading contributors...</div>
          ) : (
            <div className="table-responsive">
              <Table hover borderless className="align-middle">
                <thead
                  style={{
                    background: "linear-gradient(90deg, #dc3545 0%, #f87171 100%)",
                    color: "white",
                  }}
                >
                  <tr>
                    <th className="fw-semibold text-uppercase py-3 ps-4">Name</th>
                    <th className="fw-semibold text-uppercase py-3">Email</th>
                    <th className="fw-semibold text-uppercase py-3">Skills</th>
                    <th className="fw-semibold text-uppercase text-center py-3 pe-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4 text-muted">
                        No contributors found.
                      </td>
                    </tr>
                  ) : (
                    items.map((user) => (
                      <tr
                        key={user.id}
                        className="border-bottom"
                        style={{ transition: "background-color 0.2s" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#fff5f5")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "transparent")
                        }
                      >
                        <td className="fw-semibold ps-4">{user.user.name}</td>
                        <td>{user.user.email}</td>
                        <td>
                          {user.skills?.skills?.length
                            ? user.skills.skills.join(", ")
                            : "—"}
                        </td>
                        <td className="text-center pe-4">
                          <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                            <Pencil
                              size={20}
                              className="text-primary mx-2 cursor-pointer"
                              onClick={() => navigate(`/contributors/${user.id}/edit`)}
                            />
                          </OverlayTrigger>
                          <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                            <Trash2
                              size={20}
                              className="text-danger mx-2 cursor-pointer"
                              onClick={() => {
                                setSelectedId(user.id);
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

export default ContributorListPage;
