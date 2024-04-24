import './ErrorMessage.css'

function ErrorMessage() {

    function hideErrorMessage(event) {
        const message = event.target.parentElement;
        message.className = 'hidden';
        setTimeout(() => {
            message.parentElement.style.zIndex = '-1';
        }, 1000);
    }

    return(
        <div id="error-message-container">
            <div id="error-message-display" className="hidden">
                <span onClick={hideErrorMessage}>&#10005;</span>
                <p>Something went wrong. Check if you specified every required informations.</p>
            </div>
        </div>
    )
}

export default ErrorMessage
