function filterDataIncludes(data, filter, value) {
  const filtered_data = data.filter((row) => {
    if (!value) return row;
    return row[filter].toString().toLowerCase().includes(value.toLowerCase());
  });
  return filtered_data;
}

function filterDataStrict(data, filter, value) {
  const filtered_data = data.filter((row) => {
    if (!value) return row;
    return row[filter].toLowerCase() == value.toLowerCase();
  });
  return filtered_data;
}

export { filterDataIncludes, filterDataStrict };
