/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
const geoQueryWithAddress = (term: string) => `SELECT *
FROM (
  SELECT
    a.id,
    a.establishment_id as establishmentId,
    a.latitude,
    a.longitude,
    e.name as brand,
    i.image,
    i.cover,
    e.primary_color as primaryColor,
    a.name as title,
    a.address as address,
    c.name as city,
    s.name as state,
    ( 3959 * acos( cos( radians(u.lat) )
              * cos( radians( a.latitude ) )
              * cos( radians( a.longitude ) - radians( u.lng ) )
              + sin( radians( u.lat ) )
              * sin( radians( a.latitude ) ) ) ) AS distance
  FROM establishments_addresses AS a
  JOIN establishments AS e ON a.establishment_id = e.id
  JOIN establishments_images AS i ON e.id = i.establishment_id
  JOIN cities as c on c.id = a.city_id
  JOIN states as s on s.id = c.state_id
  JOIN (
    SELECT
      :latitude AS lat,
      :longitude AS lng
    ) AS u
  WHERE e.active = 1 ${term}
) sub
WHERE distance <= :distance
ORDER BY distance
limit :offset, :limit`;

const geoQueryWithAddressUnique = (term: string) => `
SELECT *
FROM (
  SELECT
    id,
    establishmentId,
    latitude,
    longitude,
    brand,
    image,
    primaryColor,
    cover,
    title,
    address,
    city,
    state,
    distance,
    ROW_NUMBER() OVER (PARTITION BY establishmentId ORDER BY distance) as row_num
  FROM (
    SELECT
      a.id,
      a.establishment_id as establishmentId,
      a.latitude,
      a.longitude,
      e.name as brand,
      i.image,
      i.cover,
      e.primary_color as primaryColor,
      a.name as title,
      a.address as address,
      c.name as city,
      s.name as state,
      ( 3959 * acos( cos( radians(u.lat) )
                * cos( radians( a.latitude ) )
                * cos( radians( a.longitude ) - radians( u.lng ) )
                + sin( radians( u.lat ) )
                * sin( radians( a.latitude ) ) ) ) AS distance
    FROM establishments_addresses AS a
    JOIN establishments AS e ON a.establishment_id = e.id
    JOIN establishments_images AS i ON e.id = i.establishment_id
    JOIN cities as c on c.id = a.city_id
    JOIN states as s on s.id = c.state_id
    JOIN (
      SELECT
        :latitude AS lat,
        :longitude AS lng
      ) AS u
    WHERE e.active = 1 ${term}
  ) subquery
) sub
WHERE row_num = 1 AND distance <= :distance
ORDER BY distance
LIMIT :offset, :limit`;

const formatAddress = (term: string) =>
  term
    .split(' ')
    .map((el) => `a.address like '%${el}%'`)
    .join(' and ');

const formatAddressName = (term: string) =>
  term
    .split(' ')
    .map((el) => `a.name like '%${el}%'`)
    .join(' and ');

// const formatTerm = (term: string) => `((${formatAddress(term)}) or (${formatAddressName(term)}))`;

const formatEstablishmentName = (term: string) =>
  term
    .split(' ')
    .map((el) => `e.name like '%${el}%'`)
    .join(' and ');

const formatTerm = (term: string) =>
  `((${formatAddress(term)}) or (${formatAddressName(term)}) or (${formatEstablishmentName(
    term,
  )}))`;

const formatAddressId = (addressId: number[]) => addressId.map((id) => `a.id = ${id}`).join(' or ');

const createGeoSearchSqlQuery = ({
  term,
  cityId,
  stateId,
  establishmentId,
  addressId,
  unique,
}: {
  term?: string;
  cityId?: number;
  stateId?: number;
  establishmentId?: number;
  addressId?: number[];
  unique?: boolean;
}) => {
  // let query = ' and e.id not in (:blackIds)';
  let query = '';
  if (term) query += `and ${formatTerm(term)}`;
  if (establishmentId) query += ' and e.id = :establishmentId';
  if (addressId) query += ` and ${formatAddressId(addressId)}`;
  if (cityId) query += ' and c.id = :cityId';
  else if (stateId) query += ' and s.id = :stateId';

  return unique ? geoQueryWithAddressUnique(query) : geoQueryWithAddress(query);
};

export default createGeoSearchSqlQuery;
