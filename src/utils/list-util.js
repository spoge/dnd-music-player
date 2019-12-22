const listUtils = {
  reorder(list, startIndex, endIndex) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  },
  sort(list, sortProperty) {
    return list.sort((a, b) => (a[sortProperty] > b[sortProperty] ? 1 : -1));
  },
  reverseSort(list, sortProperty) {
    return list.sort((a, b) => (a[sortProperty] < b[sortProperty] ? 1 : -1));
  }
};

export default listUtils;
