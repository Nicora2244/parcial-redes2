/**
 * Creates a response object.
 *
 * @param {number} status - The status code of the response.
 * @param {any} [data=null] - The data to be included in the response.
 * @param {string|null} [message=null] - An optional message to be included in the response.
 * @returns {Object} The response object containing status, data, and message.
 */
const createResponse = (status, data = null, message = null) => {
    return {
        status,
        data,
        message,
    };
};

module.exports = { createResponse };