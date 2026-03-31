import React, { useState, useEffect } from 'react';

const DocumentManagement = () => {

    const URL_HOST = import.meta.env.VITE_URL_HOST;
    const [documents, setDocuments] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDocName, setNewDocName] = useState('');
    const [newDocType, setNewDocType] = useState('PDF');

  
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const itemsPerPage = 5;

    
 useEffect(() => {
    const fetchDocuments = async () => {
        try {
            const res = await fetch(
                `${URL_HOST}/v1/api/receive?page=${currentPage}&limit=${itemsPerPage}&search=${encodeURIComponent(searchTerm)}`
            );

            if (!res.ok) throw new Error("API lỗi");

            const data = await res.json();

            setDocuments(data.data);
            setTotalPages(data.totalPages);

        } catch (err) {
            console.error("Lỗi fetch:", err);
        }
    };

    fetchDocuments();
}, [currentPage, searchTerm]);

    const addDocument = () => {
        alert("Chưa làm API thêm 😎");
    };

const deleteDocument = async (id) => {
  try {
    const res = await fetch(`${URL_HOST}/v1/api/receive/${id}`, {
      method: "DELETE"
    });

    if (!res.ok) throw new Error("API lỗi");

    const data = await res.json();
  alert(data.message.message);

    // reload lại data
    setDocuments(prev => prev.filter(doc => doc._id !== id));

  } catch (err) {
    console.error("Lỗi xóa:", err);
  }
};

    const getFileInfo = (type) => {
        switch (type) {
            case 'PDF':
                return { color: 'danger', label: 'PDF' };
            case 'Word':
                return { color: 'primary', label: 'Word' };
            case 'Excel':
                return { color: 'success', label: 'Excel' };
            default:
                return { color: 'secondary', label: type };
        }
    };

    return (
        <div className="p-4">
            <h3>Danh sách tài liệu</h3>

            {/* SEARCH + ADD */}
            <div className="d-flex mb-3 gap-2">
                <input
                    className="form-control"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                />
                <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                    Thêm
                </button>
            </div>

            {/* TABLE */}
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên</th>
                        <th>Loại file</th>
                        <th>Ngày</th>
                        <th>Email người gửi</th>
                        <th>Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    {documents.length > 0 ? (
                        documents.map((doc, index) => {
                            const info = getFileInfo(doc.type);
                            return (
                                <tr key={doc.id}>
                                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                                    <td>{doc.name || doc.message}</td>
                                    <td>
                                        <span className={`badge bg-${info.color}`}>
                                         <td>
                                         {(() => {
                                          try {
                                           const parsed = JSON.parse(doc.text);
                                           return parsed.doc_type;
                                        } catch {
                                           return "Không xác định";
    }
                                        })()}
                                   </td>
                                        </span>
                                    </td>
                                    <td>{new Date(doc.createdAt).toLocaleDateString("vi-vn")}</td>
                                    <td>{doc.email}</td>
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
                        })
                    ) : (
                        <tr>
                            <td colSpan="6" className="text-center">
                                Không có dữ liệu
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* PAGINATION */}
            <div className="d-flex justify-content-between align-items-center">
                <span>Trang {currentPage} / {totalPages || 1}</span>

                <div className="btn-group">
                    <button
                        className="btn btn-outline-secondary"
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                        ←
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i}
                            className={`btn ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setCurrentPage(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        className="btn btn-outline-secondary"
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                        →
                    </button>
                </div>
            </div>

            {/* MODAL */}
            {isModalOpen && (
                <div className="modal d-block" style={{ background: "#00000066" }}>
                    <div className="modal-dialog">
                        <div className="modal-content p-3">
                            <h5>Thêm tài liệu</h5>
                            <input
                                className="form-control my-2"
                                placeholder="Tên tài liệu"
                                value={newDocName}
                                onChange={(e) => setNewDocName(e.target.value)}
                            />

                            <select
                                className="form-select mb-3"
                                value={newDocType}
                                onChange={(e) => setNewDocType(e.target.value)}
                            >
                                <option>PDF</option>
                                <option>Word</option>
                                <option>Excel</option>
                            </select>

                            <div className="d-flex justify-content-end gap-2">
                                <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                                    Hủy
                                </button>
                                <button className="btn btn-primary" onClick={addDocument}>
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentManagement;