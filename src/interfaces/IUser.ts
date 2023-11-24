interface User {
  id: number;
  name: string;
  cpf: string;
  email: string;
  telephone: string | null;
  active: boolean;
  companiesArray: string;
}

interface Company {
  id: number;
  name: string;
  corporateName: string;
  cnpj: string;
  nickname: string;
  active: number;
  type: number;
  status: number;
  createdAt: string;
  disabledAt: string | null;
  code: string;
  contract: string;
  externalLink: string | null;
  externalLinkName: string | null;
  segmentId: number;
  positionCPF: string;
  stateId: number;
  cityId: number | null;
  motherCompany: string | null;
  courtesy: boolean;
  physicalCard: number;
}

interface Location {
  latitude: string | null;
  longitude: string | null;
}

export interface IUserInfo {
  user: User;
  company: Company;
  location: Location;
}
