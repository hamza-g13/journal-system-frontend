
function ErrorMessage({ message, onRetry }) {
    return (
        <div className="error-message">
            <div className="error-icon">⚠️</div>
            <h3>Error</h3>
            <p>{message}</p>
            {onRetry && (
                <button onClick={onRetry} className="btn-retry">
                    Try Again
                </button>
            )}
        </div>
    );
}

export default ErrorMessage;
