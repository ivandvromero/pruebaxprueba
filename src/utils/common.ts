import { maskingConfig } from '../config/service-configuration';

export const getProviderMaskingConfig = () => {
  return maskingConfig;
};

export const getItemValue = (data, key) => {
  const item = data.find((item) => item.key === key);
  return item ? item.value : undefined;
};
