const SaveButton = ({ loading, onClick }) => {
    return (
        <button 
            className={`button ${loading ? 'loading-button' : ''}`}
            disabled={loading}
            onClick={onClick}
        >
            {loading ? (
                <div className="loading-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            ) : (
                'Save'
            )}
        </button>
    );
}; 