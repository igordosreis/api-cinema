/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
const highlightQueryWithAddress = (unique?: true) => (unique ? `
SELECT *
FROM (
  SELECT
    id,
    establishmentId,
    latitude,
    longitude,
    brand,
    logo,
    primaryColor,
    cover,
    title,
    address,
    city,
    state,
    ROW_NUMBER() OVER (PARTITION BY establishmentId) as row_num
  FROM (
    SELECT
      a.id,
      a.establishment_id AS establishmentId,
      a.latitude,
      a.longitude,
      e.name AS brand,
      i.logo,
      i.cover,
      e.primary_color AS primaryColor,
      a.name AS title,
      a.address AS address,
      c.name AS city,
      s.name AS state
    FROM establishments_addresses AS a
    JOIN establishments AS e ON a.establishment_id = e.id
    JOIN establishments_images AS i ON e.id = i.establishment_id
    JOIN cities as c ON c.id = a.city_id
    JOIN states as s ON s.id = c.state_id
    JOIN highlights AS h ON h.address_id = a.id
    WHERE e.active = 1
  ) subquery
) sub
WHERE row_num = 1
LIMIT 0, 20 `
  : `SELECT *
FROM (
  SELECT
    a.id,
    a.establishment_id as establishmentId,
    a.latitude,
    a.longitude,
    e.name as brand,
    i.logo,
    i.cover,
    e.primary_color as primaryColor,
    a.name as title,
    a.address as address,
    c.name as city,
    s.name as state,
    h.position as position
  FROM establishments_addresses AS a
  JOIN establishments AS e ON a.establishment_id = e.id
  JOIN establishments_images AS i ON e.id = i.establishment_id
  JOIN cities AS c ON c.id = a.city_id
  JOIN states AS s ON s.id = c.state_id
  JOIN highlights AS h ON h.address_id = a.id
  WHERE e.active = 1
) sub
ORDER BY position
limit 0, 20`);

// const highlightQueryWithAddress = () => `SELECT *
// FROM (
//   SELECT
//     a.id,
//     a.establishment_id as establishmentId,
//     a.latitude,
//     a.longitude,
//     e.name as brand,
//     i.logo,
//     i.cover,
//     e.primary_color as primaryColor,
//     a.name as title,
//     a.address as address,
//     c.name as city,
//     s.name as state,
//     h.position as position
//   FROM establishments_addresses AS a
//   JOIN establishments AS e ON a.establishment_id = e.id
//   JOIN establishments_images AS i ON e.id = i.establishment_id
//   JOIN cities AS c ON c.id = a.city_id
//   JOIN states AS s ON s.id = c.state_id
//   JOIN highlights AS h ON h.address_id = a.id
//   WHERE e.active = 1
// ) sub
// ORDER BY position
// limit 0, 20`;

// const formatAddress = (term: string) =>
//   term
//     .split(' ')
//     .map((el) => `a.address like '%${el}%'`)
//     .join(' and ');

// const formatAddressName = (term: string) =>
//   term
//     .split(' ')
//     .map((el) => `a.name like '%${el}%'`)
//     .join(' and ');

// // const formatTerm = (term: string) => `((${formatAddress(term)}) or (${formatAddressName(term)}))`;

// const formatEstablishmentName = (term: string) =>
//   term
//     .split(' ')
//     .map((el) => `e.name like '%${el}%'`)
//     .join(' and ');

// const formatTerm = (term: string) =>
//   `((${formatAddress(term)}) or (${formatAddressName(term)}) or (${formatEstablishmentName(
//     term,
//   )}))`;

// const formatAddressId = (addressId: number[]) => addressId.map((id) => `a.id = ${id}`).join(' or ');

// const createGeoSearchSqlQuery = () => {
//   let query = ' and e.id not in (:blackIds)';
//   let query = '';
//   if (term) query += `and ${formatTerm(term)}`;
//   if (establishmentId) query += ' and e.id = :establishmentId';
//   if (addressId) query += ` and ${formatAddressId(addressId)}`;
//   if (cityId) query += ' and c.id = :cityId';
//   else if (stateId) query += ' and s.id = :stateId';

//   return geoQueryWithAddress();
// };

const createHighlightSearchSqlQuery = (unique?: true) => highlightQueryWithAddress(unique);

export default createHighlightSearchSqlQuery;
