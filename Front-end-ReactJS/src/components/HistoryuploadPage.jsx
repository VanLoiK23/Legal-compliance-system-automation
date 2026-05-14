// ===============================
// pages/HistoryuploadPage.jsx
// ===============================
import React, { useState, useEffect } from "react";
import instance from "../utils/axios.customize";

const HistoryuploadPage = () => {

  const [history, setHistory] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 1,
  });

  useEffect(() => {
    fetchHistory();
  }, [search, currentPage]);

  const fetchHistory = async () => {

    try {

      setLoading(true);

      const res = await instance.get("/history", {
        params: {
          search,
          page: currentPage,
          limit: itemsPerPage,
        },
        withCredentials: true,
      });

      setHistory(res.data.data || []);

      setPagination(
        res.data.pagination || {
          total: 0,
          totalPages: 1,
        }
      );

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  const formatDate = (dateString) => {

    if (!dateString) return "-";

    return new Date(dateString).toLocaleString("vi-VN");
  };

  const getStatusBadge = (status = "") => {

    const badges = {

      pending: (
        <span className="badge bg-warning">
          Pending
        </span>
      ),

      processing: (
        <span className="badge bg-primary">
          Processing
        </span>
      ),

      completed: (
        <span className="badge bg-success">
          Completed
        </span>
      ),

      failed: (
        <span className="badge bg-danger">
          Failed
        </span>
      ),
    };

    return (
      badges[status.toLowerCase()] ||
      <span className="badge bg-secondary">
        {status}
      </span>
    );
  };

  const getFileIcon = (fileUrl = "") => {

    if (fileUrl.includes(".pdf")) {
      return "bi-file-earmark-pdf text-danger";
    }

    if (
      fileUrl.includes(".png") ||
      fileUrl.includes(".jpg") ||
      fileUrl.includes(".jpeg")
    ) {
      return "bi-file-earmark-image text-primary";
    }

    return "bi-file-earmark-text text-success";
  };

  return (
    <div className="container py-5">

      <div className="card shadow border-0 p-4 rounded-4">

        <div className="d-flex justify-content-between align-items-center mb-4">

          <h4 className="fw-bold">
            Lịch sử Upload
          </h4>

          <input
            type="text"
            className="form-control"
            style={{ maxWidth: "300px" }}
            placeholder="Tìm tên file..."
            value={search}
            onChange={(e) => {
              setCurrentPage(1);
              setSearch(e.target.value);
            }}
          />

        </div>

        {loading ? (

          <div className="text-center py-5">

            <div className="spinner-border text-primary"></div>

          </div>

        ) : history.length === 0 ? (

          <div className="text-center py-5">

            <h5>Không có dữ liệu</h5>

          </div>

        ) : (

          <>
            <div className="table-responsive">

              <table className="table align-middle">

                <thead>

                  <tr>

                    <th>Tên file</th>

                    <th>Trạng thái</th>

                    <th>Ngày upload</th>

                    <th>Download</th>

                  </tr>

                </thead>

                <tbody>

                  {history.map((item) => (

                    <tr key={item._id}>

                      <td>

                        <i
                          className={`bi ${getFileIcon(item.fileUrl)} me-2`}
                        ></i>

                        {item.name}

                      </td>

                      <td>
                        {getStatusBadge(item.status)}
                      </td>

                      <td>
                        {formatDate(item.createdAt)}
                      </td>

                      <td>

                        {item.fileUrl && (

                          <a
                            href={item.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="btn btn-sm btn-outline-primary"
                          >
                            Download
                          </a>

                        )}

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

            {pagination.totalPages > 1 && (

              <div className="d-flex justify-content-center mt-4">

                <ul className="pagination">

                  <li
                    className={`page-item ${
                      currentPage === 1
                        ? "disabled"
                        : ""
                    }`}
                  >

                    <button
                      className="page-link"
                      onClick={() =>
                        setCurrentPage(currentPage - 1)
                      }
                    >
                      Trước
                    </button>

                  </li>

                  {[...Array(
                    pagination.totalPages
                  )].map((_, index) => (

                    <li
                      key={index}
                      className={`page-item ${
                        currentPage === index + 1
                          ? "active"
                          : ""
                      }`}
                    >

                      <button
                        className="page-link"
                        onClick={() =>
                          setCurrentPage(index + 1)
                        }
                      >
                        {index + 1}
                      </button>

                    </li>

                  ))}

                  <li
                    className={`page-item ${
                      currentPage ===
                      pagination.totalPages
                        ? "disabled"
                        : ""
                    }`}
                  >

                    <button
                      className="page-link"
                      onClick={() =>
                        setCurrentPage(currentPage + 1)
                      }
                    >
                      Sau
                    </button>

                  </li>

                </ul>

              </div>

            )}

          </>
        )}

      </div>

    </div>
  );
};

export default HistoryuploadPage;