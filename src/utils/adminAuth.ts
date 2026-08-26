const KEY = 'sri_infra_admin_session';
const PIN_KEY = 'sri_infra_admin_pin';
const DEFAULT_PIN = '2025';

export const getStoredAdminPin = () => localStorage.getItem(PIN_KEY) || DEFAULT_PIN;
export const setCustomAdminPin = (pin: string) => {
  if (pin.trim().length < 4) return false;
  localStorage.setItem(PIN_KEY, pin.trim());
  return true;
};
export const checkIsAdmin = () => sessionStorage.getItem(KEY) === 'true';
export const loginAdmin = (pin: string) => {
  if (pin.trim() !== getStoredAdminPin()) return false;
  sessionStorage.setItem(KEY, 'true');
  return true;
};
export const logoutAdmin = () => sessionStorage.removeItem(KEY);
