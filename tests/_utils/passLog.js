function passLog(...args) {
  return v => {
    console.log.apply(console, ['\n\n###############################\n', ...args, '\n', v]);
    return v;
  }
}

module.exports = passLog;