function passLog(label) {
  return v => {
    console.log('\n\n##############\n', label, '\n', v);
    return v;
  }
}

module.exports = passLog;