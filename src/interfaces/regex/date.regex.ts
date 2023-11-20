const dateRegex = /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/;
// date examples:
// 1899-12-28 is valid
// 1899-13-28 is invalid
// 1899-12-32 is invalid

export default dateRegex;
