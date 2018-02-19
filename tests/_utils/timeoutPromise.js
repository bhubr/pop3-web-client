function timeoutPromise(timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(true), timeout || 1000);
    });
}

module.exports = timeoutPromise;