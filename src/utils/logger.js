/*
 * Custom logger and timestamp formatter.
 * Overrides native console methods to include timestamps in application logs,
 * and exports the formatter for use in HTTP access logs (Morgan).
 */

const getFormattedTime = () => {

    const now = new Date();
    const yyyy = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const DD = String(now.getDate()).padStart(2, '0');
    const HH = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const SS = String(now.getSeconds()).padStart(2, '0');
    const mmm = String(now.getMilliseconds()).padStart(3, '0');

    return `${yyyy}/${MM}/${DD} ${HH}:${min}:${SS}.${mmm}`;

};




/*
 * Application logs (system logs). 
 * Override native console methods to inject the formatted timestamp.
 */

const originalLog = console.log;
const originalError = console.error;

console.log = function (...args) {
    originalLog(`[${getFormattedTime()}]`, ...args);
};

console.error = function (...args) {
    originalError(`[${getFormattedTime()}]`, ...args);
};




exports.getFormattedTime = getFormattedTime;
