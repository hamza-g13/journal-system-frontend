
function StatusBadge({ status, type = 'status' }) {
    const className = `${type}-badge ${status.toLowerCase().replace('_', '-')}`;
    const displayText = status.replace('_', ' ');

    return (
        <span className={className}>
            {displayText}
        </span>
    );
}

export default StatusBadge;
