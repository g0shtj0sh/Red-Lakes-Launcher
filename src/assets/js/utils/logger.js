let console_log = console.log;
let console_info = console.info;
let console_warn = console.warn;
let console_debug = console.debug;
let console_error = console.error;

class logger {
    constructor(name, color) {
        this.Logger(name, color)
    }

    async Logger(name, color) {
        console.log = (value) => {
            console_log.call(console, `%c[${name}]:`, `color: ${color};`, value);
        };

        console.info = (value) => {
            console_info.call(console, `%c[${name}]:`, `color: ${color};`, value);
        };

        console.warn = (value) => {
            console_warn.call(console, `%c[${name}]:`, `color: ${color};`, value);
        };

        console.debug = (value) => {
            console_debug.call(console, `%c[${name}]:`, `color: ${color};`, value);
        };

        console.error = (value) => {
            console_error.call(console, `%c[${name}]:`, `color: ${color};`, value);
            createErrorPopup(value);
        };

        function createErrorPopup(value) {
            // Create the overlay element
            var overlay = document.createElement('div');
            overlay.style.position = 'fixed';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.background = 'rgba(0, 0, 0, 0.5)';
            overlay.style.zIndex = '9998';

            // Create the popup element
            var popup = document.createElement('div');
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.padding = '20px';
            popup.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.2)';
            popup.style.background = 'rgba(18, 18, 18, 0.9)';
            popup.style.borderRadius = '5px';
            popup.style.backdropFilter = 'blur(10px)';
            popup.style.color = '#fff';
            popup.style.font = 'normal normal normal 16px/25px Poppins';
            popup.style.zIndex = '9999';

            // Create the error message
            var errorMessage = document.createElement('p');
            errorMessage.innerText = 'An error occurred:\n' + value;

            // Create the close button
            var closeButton = document.createElement('button');
            closeButton.innerText = 'Close';
            closeButton.style.marginTop = '10px';
            closeButton.style.background = 'black';
            closeButton.style.border = 'none';
            closeButton.style.borderRadius = '5px';
            closeButton.style.width = '100px';
            closeButton.style.height = '35px';
            closeButton.style.color = 'white';
            closeButton.style.cursor = 'pointer';
            closeButton.style.font = 'normal normal normal 16px/25px Poppins';
            closeButton.style.transition = 'all 0.2s ease-in-out';
            //hover
            closeButton.addEventListener('mouseover', function () {
                closeButton.style.background = 'white';
                closeButton.style.color = 'black';
            });
            //unhover
            closeButton.addEventListener('mouseout', function () {
                closeButton.style.background = 'black';
                closeButton.style.color = 'white';
            });
            closeButton.onclick = function () {
                document.body.removeChild(overlay);
                document.body.removeChild(popup);
            };

            // Append the error message and close button to the popup
            popup.appendChild(errorMessage);
            popup.appendChild(closeButton);

            // Append the overlay and popup to the document body
            document.body.appendChild(overlay);
            document.body.appendChild(popup);
        }
    }
}

        export default logger;
