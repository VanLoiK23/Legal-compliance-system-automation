import React, { useState } from 'react';

const DocumentManagement = () => {
    const [documents, setDocuments] = useState([
        {
            id: 1,
            name: "Hợp đồng lao động 2026.docx",
            type: "Word",
            uploadDate: "15/03/2026",
            size: "245 KB"
        },
        {
            id: 2,
            name: "Báo cáo tài chính quý 1.xlsx",
            type: "Excel",
            uploadDate: "20/03/2026",
            size: "1.8 MB"
        },
        {
            id: 3,
            name: "Hướng dẫn sử dụng hệ thống.pdf",
            type: "PDF",
            uploadDate: "10/03/2026",
            size: "3.4 MB"
        },
        {
            id: 4,
            name: "Danh sách nhân viên mới.xlsx",
            type: "Excel",
            uploadDate: "25/03/2026",
            size: "856 KB"
        },
        {
            id: 5,
            name: "Biên bản họp Ban Giám đốc.pdf",
            type: "PDF",
            uploadDate: "28/03/2026",
            size: "1.2 MB"
        },
        {
            id: 6,
            name: "Quy trình kiểm soát nội bộ.docx",
            type: "Word",
            uploadDate: "29/03/2026",
            size: "678 KB"
        }
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newDocName, setNewDocName] = useState('');
    const [newDocType, setNewDocType] = useState('PDF');

    // Lọc danh sách theo từ khóa tìm kiếm
    const filteredDocuments = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addDocument = () => {
        if (!newDocName.trim()) return;

        const newDoc = {
            id: Date.now(),
            name: newDocName.trim(),
            type: newDocType,
            uploadDate: new Date().toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }),
            size: Math.random() > 0.5
                ? `${(Math.random() * 4 + 0.5).toFixed(1)} MB`
                : `${Math.floor(Math.random() * 900 + 100)} KB`
        };

        setDocuments(prev => [...prev, newDoc]);
        setNewDocName('');
        setNewDocType('PDF');
        setIsModalOpen(false);
    };

    const deleteDocument = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tài liệu này không?')) {
            setDocuments(prev => prev.filter(doc => doc.id !== id));
        }
    };

    const getFileInfo = (type) => {
        switch (type) {
            case 'PDF':
                return { icon: 'bi-file-pdf-fill', color: 'danger', label: 'PDF' };
            case 'Word':
                return { icon: 'bi-file-word-fill', color: 'primary', label: 'Word' };
            case 'Excel':
                return { icon: 'bi-file-excel-fill', color: 'success', label: 'Excel' };
            default:
                return { icon: 'bi-file-fill', color: 'secondary', label: type };
        }
    };

    return (
        <div className="d-flex h-100">
            {/* ==================== SIDEBAR ==================== */}
            <div className="sidebar text-light d-flex flex-column" style={{ width: '260px', minHeight: '100vh' }}>
                {/* Logo */}
                <div className="p-3 border-bottom d-flex align-items-center">
                    <i className="bi bi-shield-check-fill fs-3 text-warning me-2"></i>
                    <h5 className="mb-0 text-white fw-semibold">AICHECK PRO</h5>
                    <span className="ms-auto badge bg-light text-dark small">1.0.0</span>
                </div>

                {/* Menu */}
                <div className="flex-grow-1 px-3 py-3 overflow-auto">
                    <ul className="nav flex-column">
                        <li className="nav-item mb-1">
                            <a href="#" className="nav-link text-light d-flex align-items-center py-3 px-3">
                                <i className="bi bi-house-door me-3 fs-5"></i>
                                <span>Tổng quan</span>
                            </a>
                        </li>
                        <li className="nav-item mb-1">
                            <a href="#" className="nav-link text-light d-flex align-items-center py-3 px-3">
                                <i className="bi bi-list-check me-3 fs-5"></i>
                                <span>Quản lý Rules (W1)</span>
                            </a>
                        </li>
                        <li className="nav-item mb-1">
                            <a href="#" className="nav-link active d-flex align-items-center py-3 px-3">
                                <i className="bi bi-folder2-open me-3 fs-5"></i>
                                <span>Hồ sơ tài liệu (W2)</span>
                            </a>
                        </li>
                        <li className="nav-item mb-1">
                            <a href="#" className="nav-link text-light d-flex align-items-center py-3 px-3">
                                <i className="bi bi-clipboard-check me-3 fs-5"></i>
                                <span>Kiểm tra tuân thủ (W3)</span>
                            </a>
                        </li>
                        <li className="nav-item">
                            <a href="#" className="nav-link text-light d-flex align-items-center py-3 px-3">
                                <i className="bi bi-gear-fill me-3 fs-5"></i>
                                <span>Cài đặt hệ thống</span>
                            </a>
                        </li>
                    </ul>
                </div>

                {/* User footer */}
                <div className="mt-auto border-top p-3 d-flex align-items-center">
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white" style={{ width: '38px', height: '38px' }}>
                        <i className="bi bi-person-fill fs-4"></i>
                    </div>
                    <div className="ms-3">
                        <div className="fw-semibold">Nguyễn Văn A</div>
                        <small className="text-light-50">Administrator</small>
                    </div>
                    <i className="bi bi-box-arrow-right ms-auto text-light-50 fs-5"></i>
                </div>
            </div>

            {/* ==================== MAIN CONTENT ==================== */}
            <div className="flex-grow-1 d-flex flex-column main-content">
                {/* Top navbar - khớp hoàn toàn với ảnh 1 */}
                <nav className="top-navbar navbar navbar-light bg-white px-4 py-3 border-bottom">
                    <div className="d-flex align-items-center w-100">
                        <h3 className="mb-0 fw-semibold text-dark">Hồ sơ tài liệu</h3>
                        <div className="ms-auto d-flex align-items-center gap-3">
                            <button className="btn position-relative p-2" style={{ fontSize: '1.4rem' }}>
                                <i className="bi bi-bell"></i>
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">3</span>
                            </button>
                            <div className="d-flex align-items-center gap-2">
                                <div className="text-end">
                                    <div className="small fw-medium">Nguyễn Văn A</div>
                                    <div className="text-muted">Da Nang City</div>
                                </div>
                                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px' }}>
                                    <i className="bi bi-person-circle fs-4"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Body - đã xóa hoàn toàn phần "Hồ sơ tài liệu (W2)" thừa ở ảnh 2 */}
                <div className="flex-grow-1 p-4 overflow-auto">
                    <div className="card h-100">
                        {/* Card header */}
                        <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center px-4 py-3">
                            <h5 className="mb-0 text-dark fw-semibold">Danh sách tài liệu</h5>
                            <div className="d-flex align-items-center gap-3">
                                {/* Search */}
                                <div className="input-group" style={{ width: '340px' }}>
                                    <span className="input-group-text bg-light border-end-0">
                                        <i className="bi bi-search text-muted"></i>
                                    </span>
                                    <input
                                        type="text"
                                        className="form-control border-start-0"
                                        placeholder="Tìm kiếm theo tên tài liệu..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* Add button */}
                                <button
                                    className="btn btn-primary d-flex align-items-center gap-2 px-4 py-2"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <i className="bi bi-plus-circle fs-5"></i>
                                    <span>Thêm tài liệu</span>
                                </button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="card-body p-0 overflow-auto">
                            <table className="table table-hover mb-0 align-middle">
                                <thead className="table-light sticky-top">
                                    <tr>
                                        <th className="ps-4" style={{ width: '70px' }}>STT</th>
                                        <th>Tên tài liệu</th>
                                        <th style={{ width: '160px' }}>Loại file</th>
                                        <th style={{ width: '150px' }}>Ngày upload</th>
                                        <th style={{ width: '130px' }}>Dung lượng</th>
                                        <th className="text-end pe-4" style={{ width: '100px' }}>Hành động</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDocuments.length > 0 ? (
                                        filteredDocuments.map((doc, index) => {
                                            const info = getFileInfo(doc.type);
                                            return (
                                                <tr key={doc.id} className="border-bottom">
                                                    <td className="ps-4 fw-medium">{index + 1}</td>
                                                    <td className="fw-medium">{doc.name}</td>
                                                    <td>
                                                        <span className={`badge bg-${info.color} text-white`}>
                                                            <i className={`bi ${info.icon} me-1`}></i>
                                                            {info.label}
                                                        </span>
                                                    </td>
                                                    <td className="text-muted">{doc.uploadDate}</td>
                                                    <td className="fw-medium">{doc.size}</td>
                                                    <td className="text-end pe-4">
                                                        <button
                                                            className="btn btn-sm btn-outline-danger rounded-3"
                                                            onClick={() => deleteDocument(doc.id)}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center py-5 text-muted">
                                                <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                                                <h6>Không có dữ liệu</h6>
                                                <p className="mb-0">
                                                    {searchTerm
                                                        ? 'Không tìm thấy tài liệu phù hợp'
                                                        : 'Chưa có tài liệu nào trong hệ thống'}
                                                </p>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================== MODAL THÊM TÀI LIỆU ==================== */}
            {isModalOpen && (
                <div
                    className="modal fade show d-block"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
                    onClick={(e) => {
                        if (e.target.classList.contains('modal')) setIsModalOpen(false);
                    }}
                >
                    <div
                        className="modal-dialog modal-dialog-centered"
                        style={{ maxWidth: '460px' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modal-content">
                            <div className="modal-header border-0 pb-0">
                                <h4 className="modal-title fw-semibold">Thêm tài liệu mới</h4>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setIsModalOpen(false)}
                                ></button>
                            </div>

                            <div className="modal-body">
                                <div className="mb-4">
                                    <label className="form-label fw-medium">Tên tài liệu</label>
                                    <input
                                        type="text"
                                        className="form-control form-control-lg"
                                        placeholder="Nhập tên tài liệu..."
                                        value={newDocName}
                                        onChange={(e) => setNewDocName(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="form-label fw-medium">Loại file</label>
                                    <div className="d-flex gap-2">
                                        <button
                                            className={`flex-fill btn ${newDocType === 'PDF' ? 'btn-danger' : 'btn-outline-secondary'}`}
                                            onClick={() => setNewDocType('PDF')}
                                        >
                                            <i className="bi bi-file-pdf-fill me-2"></i>
                                            PDF
                                        </button>
                                        <button
                                            className={`flex-fill btn ${newDocType === 'Word' ? 'btn-primary' : 'btn-outline-secondary'}`}
                                            onClick={() => setNewDocType('Word')}
                                        >
                                            <i className="bi bi-file-word-fill me-2"></i>
                                            Word
                                        </button>
                                        <button
                                            className={`flex-fill btn ${newDocType === 'Excel' ? 'btn-success' : 'btn-outline-secondary'}`}
                                            onClick={() => setNewDocType('Excel')}
                                        >
                                            <i className="bi bi-file-excel-fill me-2"></i>
                                            Excel
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer border-0">
                                <button
                                    className="btn btn-light px-4"
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    className="btn btn-primary px-5"
                                    onClick={addDocument}
                                >
                                    <i className="bi bi-cloud-upload me-2"></i>
                                    Tải lên
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