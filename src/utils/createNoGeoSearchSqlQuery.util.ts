/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable complexity */
/* eslint-disable max-lines-per-function */
const noGeoQueryWithAddress = (term: string) => `SELECT *
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
    e.available_tickets AS availableTickets,
    e.available_consumables AS availableConsumables
  FROM establishments_addresses AS a
  JOIN establishments AS e ON a.establishment_id = e.id
  JOIN establishments_images AS i ON e.id = i.establishment_id
  JOIN cities as c on c.id = a.city_id
  JOIN states as s on s.id = c.state_id
  WHERE e.active = 1 AND (e.available_tickets = 1 OR e.available_consumables = 1) ${term}
) sub
limit :offset, :limit`;

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

const createNoGeoSearchSqlQuery = ({
  term,
  cityId,
  stateId,
  establishmentId,
  addressId,
}: {
  term?: string;
  cityId?: number;
  stateId?: number;
  establishmentId?: number;
  addressId?: number[];
}) => {
  // let query = ' and e.id not in (:blackIds)';
  let query = '';
  if (term) query += `and ${formatTerm(term)}`;
  if (establishmentId) query += ' and e.id = :establishmentId';
  if (addressId) query += ` and ${formatAddressId(addressId)}`;
  if (cityId) query += ' and c.id = :cityId';
  else if (stateId) query += ' and s.id = :stateId';

  return noGeoQueryWithAddress(query);
};

export default createNoGeoSearchSqlQuery;
