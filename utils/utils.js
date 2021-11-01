
exports.createRef = (data, key, value) => {
    const lookup = {};
    for (let item of data) {
        lookup[item[key]] = item[value];
    }
    return lookup;
  };