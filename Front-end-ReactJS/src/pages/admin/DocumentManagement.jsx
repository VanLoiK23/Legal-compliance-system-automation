import React, { useState, useEffect } from 'react';
import instance from "../../utils/axios.customize";

const DocumentManagement = () => {

    const URL_HOST = import.meta.env.VITE_URL_HOST;
    const [documents, setDocuments] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');

    // FILTER
    const [statusFilter, setStatusFilter] = useState('');
    const [textFilter, setTextFilter] = useState(''); // doc_type

    // (Các state này hiện chưa dùng trong JSX nhưng giữ lại cho chức năng tương lai)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDocName, setNewDocName] = useState('');
    const [newDocType, setNewDocType] = useState('PDF');

    const [selectedDoc, setSelectedDoc] = useState(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const itemsPerPage = 5;

    // LẤY DANH SÁCH TÀI LIỆU
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const res = await instance.get(
                    `/receive?page=${currentPage}&limit=${itemsPerPage}`
                    + `&search=${encodeURIComponent(searchTerm)}`
                    + `&status=${encodeURIComponent(statusFilter)}`
                    + `&docType=${encodeURIComponent(textFilter)}`
                );

                // Xử lý chuẩn Axios (Hỗ trợ cả trường hợp có hoặc không có Interceptor)
                const responseData = res.data !== undefined ? res.data : res;

                setDocuments(responseData.data || []);
                setTotalPages(responseData.totalPages || 1);

            } catch (err) {
                console.error("Lỗi fetch:", err);
            }
        };

        fetchDocuments();
    }, [currentPage, searchTerm, statusFilter, textFilter]);

    // XÓA TÀI LIỆU
    const deleteDocument = async (id) => {
        try {
            const res = await instance.delete(`/receive/${id}`);

            // Xử lý chuẩn Axios thay vì dùng fetch (res.ok / res.json)
            const responseData = res.data !== undefined ? res.data : res;
            
            // Lấy thông báo từ backend (tùy thuộc vào cấu trúc JSON backend trả về)
            const message = responseData?.message?.message || responseData?.message || "Xóa thành công";
            alert(message);

            // Cập nhật lại state để xóa dòng đó khỏi table
            setDocuments(prev => prev.filter(doc => doc._id !== id));

        } catch (err) {
            console.error("Lỗi xóa:", err);
            alert("Có lỗi xảy ra khi xóa tài liệu!");
        }
    };

    const getFileInfo = (type) => {
        switch (type) {
            case 'PDF':
                return { color: 'danger' };
            case 'Word':
                return { color: 'primary' };
            case 'Excel':
                return { color: 'success' };
            default:
                return { color: 'secondary' };
        }
    };

    return (
        <div className="p-4">
            <h3>Danh sách tài liệu</h3>

            {/* SEARCH + FILTER */}
            <div className="d-flex mb-3 gap-2">

                <input
                    className="form-control"
                    placeholder="Tìm theo tên..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />

                {/* STATUS */}
                <select
                    className="form-select"
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="">-- Status --</option>
                    <option value="true">Success</option>
                    <option value="false">Failer</option>

                </select>

                {/* DOC TYPE (TEXT FILTER) */}
                <select
                    className="form-select"
                    value={textFilter}
                    onChange={(e) => {
                        setTextFilter(e.target.value);
                        setCurrentPage(1);
                    }}
                >
                    <option value="">-- Loại tài liệu --</option>
                    <option value="hợp_đồng">Hợp đồng</option>
                    <option value="biên_bản">Biên bản</option>
                    <option value="báo_cáo">Báo cáo</option>
                    <option value="unknown">Không xác định</option>
                </select>

            </div>

            {/* TABLE */}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên</th>
                        <th>Loại file</th>
                        <th>Ngày</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.map((doc, index) => {
                        const info = getFileInfo(doc.type);
                        return (
                            <tr key={doc._id}>
                                <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>

                                <td
                                    style={{ cursor: "pointer", color: "#0d6efd" }}
                                    onClick={() => {
                                        setSelectedDoc(doc);
                                        setIsDetailOpen(true);
                                    }}
                                >
                                    {doc.name || doc.message}
                                </td>

                                <td>
                                    <span className={`badge bg-${info.color}`}>
                                        {(() => {
                                            try {
                                                return JSON.parse(doc.text).doc_type;
                                            } catch {
                                                return "Không xác định";
                                            }
                                        })()}
                                    </span>
                                </td>

                                <td>{new Date(doc.createdAt).toLocaleDateString("vi-vn")}</td>
                                <td>{doc.email}</td>
                                <td>
                                    <span className={`badge bg-${info.color}`}>
                                        {doc.status}
                                    </span>
                                </td>
                                <td>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteDocument(doc._id)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>

            {/* MODAL CHI TIẾT FULL */}
            {isDetailOpen && selectedDoc && (
                <div className="modal d-block" style={{ background: "#00000080" }}>
                    <div className="modal-dialog modal-xl modal-dialog-centered">
                        <div className="modal-content p-4">

                            {/* HEADER */}
                            <div className="d-flex justify-content-between mb-3">
                                <h5 className="fw-bold">Chi tiết tài liệu (FULL)</h5>
                                <button className="btn btn-light" onClick={() => setIsDetailOpen(false)}>
                                    ✖
                                </button>
                            </div>

                            <div className="row g-4">

                                {/* LEFT */}
                                <div className="col-lg-8">

                                    {/* TÊN */}
                                    <div className="mb-2">
                                        <label className="fw-bold">Tên</label>
                                        <input className="form-control" value={selectedDoc.name || selectedDoc.message} readOnly />
                                    </div>

                                    {/* AI TYPE */}
                                    <div className="mb-2">
                                        <label className="fw-bold">Phân loại AI</label>
                                        <input
                                            className="form-control"
                                            value={(() => {
                                                try {
                                                    return JSON.parse(selectedDoc.text).doc_type;
                                                } catch {
                                                    return "Không xác định";
                                                }
                                            })()}
                                            readOnly
                                        />
                                    </div>

                                    {/* TEXT */}
                                    <div className="mb-3">
                                        <label className="fw-bold">Nội dung text</label>
                                        <textarea className="form-control" rows="6" value={selectedDoc.text} readOnly />
                                    </div>

                                    {/* NOTE */}
                                    <div className="mb-2">
                                        <label className="fw-bold">Ghi chú</label>
                                        <textarea className="form-control" rows="2" value={selectedDoc.note || ""} readOnly />
                                    </div>

                                    {/* TAG */}
                                    <div className="mb-2">
                                        <label className="fw-bold">Tag</label>
                                        <input className="form-control" value={(selectedDoc.tag || []).join(", ")} readOnly />
                                    </div>

                                    {/* MESSAGE */}
                                    <div className="mb-2">
                                        <label className="fw-bold">Message</label>
                                        <input className="form-control" value={selectedDoc.message || ""} readOnly />
                                    </div>

                                </div>

                                {/* RIGHT */}
                                <div className="col-lg-4">

                                    <div className="mb-2">
                                        <label className="fw-bold">Loại file</label>
                                        <input className="form-control" value={selectedDoc.type || ""} readOnly />
                                    </div>

                                    <div className="mb-2">
                                        <label className="fw-bold">Email</label>
                                        <input className="form-control" value={selectedDoc.email || ""} readOnly />
                                    </div>

                                    <div className="mb-2">
                                        <label className="fw-bold">Nhân viên</label>
                                        <input className="form-control" value={selectedDoc.employeeName || ""} readOnly />
                                    </div>

                                    <div className="mb-2">
                                        <label className="fw-bold">Ngày sinh</label>
                                        <input className="form-control" value={selectedDoc.birthDate || ""} readOnly />
                                    </div>

                                    <div className="mb-2">
                                        <label className="fw-bold">Công ty</label>
                                        <input className="form-control" value={selectedDoc.company || ""} readOnly />
                                    </div>

                                    <div className="mb-2">
                                        <label className="fw-bold">Source</label>
                                        <input className="form-control" value={selectedDoc.source || ""} readOnly />
                                    </div>

                                    <div className="mb-2">
                                        <label className="fw-bold">Status</label>
                                        <input className="form-control" value={selectedDoc.status || ""} readOnly />
                                    </div>

                                    <div className="mb-2">
                                        <label className="fw-bold">Hash</label>
                                        <input className="form-control" value={selectedDoc.hash || ""} readOnly />
                                    </div>

                                    <div className="mb-2">
                                        <label className="fw-bold">Ngày tạo</label>
                                        <input
                                            className="form-control"
                                            value={new Date(selectedDoc.createdAt).toLocaleString("vi-VN")}
                                            readOnly
                                        />
                                    </div>

                                    {/* FILE */}
                                    <div className="mb-2">
                                        <label className="fw-bold">File URL</label>
                                        <input className="form-control" value={selectedDoc.fileUrl || ""} readOnly />
                                    </div>

                                    {selectedDoc.fileUrl && (
                                        <a
                                            href={selectedDoc.fileUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-success w-100 mt-2"
                                        >
                                            Tải file
                                        </a>
                                    )}

                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            {/* PAGINATION */}
            <div className="d-flex justify-content-between align-items-center mt-3">
                <span>Trang {currentPage} / {totalPages}</span>

                <div className="btn-group">
                    {/* Prev */}
                    <button
                        className="btn btn-outline-primary"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                    >
                        ←
                    </button>

                    {/* Page buttons */}
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page =>
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 2 && page <= currentPage + 2)
                        )
                        .map((page, idx, arr) => {
                            const isEllipsis = idx > 0 && page - arr[idx - 1] > 1;
                            return (
                                <React.Fragment key={page}>
                                    {isEllipsis && <span className="btn btn-outline-secondary disabled">…</span>}
                                    <button
                                        className={`btn ${page === currentPage ? "btn-primary" : "btn-outline-primary"}`}
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                </React.Fragment>
                            );
                        })
                    }

                    {/* Next */}
                    <button
                        className="btn btn-outline-primary"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                    >
                        →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DocumentManagement;