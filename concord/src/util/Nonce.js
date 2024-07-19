/**
 * Generates a random nonce for use in the application.
 * @param {Date|String} [timestamp] -- Optional timestamp to use in the nonce, defaults to current time
 * @returns {String} -- The nonce
 */
export default function generateNonce(date = "now") {
    let unixts;

    // Get the Unix timestamp
    if (date === "now") {
        unixts = Date.now() / 1000;  // Get current Unix timestamp in seconds
    } else {
        unixts = new Date(date).getTime() / 1000;  // Convert provided date to Unix timestamp in seconds
    }

    // Adjust the timestamp and multiply by 2^22
    return String((Math.floor(unixts) * 1000 - 1420070400000) * 4194304);
}