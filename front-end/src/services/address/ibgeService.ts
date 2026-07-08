import axios from 'axios';

export interface State {
  sigla: string;
  nome: string;
}

export interface City {
  nome: string;
}

export const getStates = async () => {
  const { data } = await axios.get<State[]>(
    'https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome'
  );

  return data;
};

export const getCitiesByState = async (uf: string) => {
  const { data } = await axios.get<City[]>(
    `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`
  );

  return data;
};