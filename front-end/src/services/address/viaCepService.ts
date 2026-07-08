import axios from 'axios';

export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export const getAddressByCep = async (cep: string) => {
  const cleanCep = cep.replace(/\D/g, '');

  const { data } = await axios.get<ViaCepResponse>(
    `https://viacep.com.br/ws/${cleanCep}/json/`
  );

  return data;
};