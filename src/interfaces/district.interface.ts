export interface District {
  state: string;
  stateCode: string;
  districtCode: string;
  district: string;
  headquarters: string;
  population: number;
  area: number;
  density: number;
}

export interface DistrictsData {
  districts: District[];
}
