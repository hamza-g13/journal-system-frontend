// src/components/admin/AdminTabs.jsx
function AdminTabs({ activeTab, onTabChange }) {
    const tabs = [
        { id: 'users', label: 'Users' },
        { id: 'organizations', label: 'Organizations' },
        { id: 'practitioners', label: 'Practitioners' }
    ];

    return (
        <div className="admin-tabs">
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    className={activeTab === tab.id ? 'tab active' : 'tab'}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}

export default AdminTabs;