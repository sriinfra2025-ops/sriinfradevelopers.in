// Admin Authentication and Permissions for Sri Infra Portal

const ADMIN_STORAGE_KEY = 'sri_infra_admin_authenticated';
const ADMIN_PIN_STORAGE_KEY = 'sri_infra_custom_admin_pin';

// Default accepted passcodes
const DEFAULT_PASSCODES = ['2025', 'sriinfra2025', 'sriinfra', '9848529229', 'admin'];

export const getStoredAdminPin = (): string => {
  try {
    return localStorage.getItem(ADMIN_PIN_STORAGE_KEY) || '2025';
  } catch {
    return '2025';
  }
};

export const setCustomAdminPin = (newPin: string): boolean => {
  if (!newPin || newPin.trim().length < 4) return false;
  try {
    localStorage.setItem(ADMIN_PIN_STORAGE_KEY, newPin.trim());
    return true;
  } catch {
    return false;
  }
};

/**
 * Check if the current browser session is actively authenticated as an Admin.
 * Default is FALSE unless explicitly logged in with PIN in this session.
 */
export const checkIsAdmin = (): boolean => {
  try {
    return sessionStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
};

export const loginAdmin = (enteredPin: string): boolean => {
  const cleanPin = enteredPin.trim().toLowerCase();
  const customPin = getStoredAdminPin().toLowerCase();
  
  const isValid =
    cleanPin === customPin ||
    DEFAULT_PASSCODES.some((p) => p.toLowerCase() === cleanPin);

  if (isValid) {
    try {
      sessionStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      window.dispatchEvent(new CustomEvent('sri_infra_admin_auth_changed', { detail: { isAdmin: true } }));
    } catch (e) {
      console.error(e);
    }
    return true;
  }
  return false;
};

export const logoutAdmin = (): void => {
  try {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    localStorage.removeItem(ADMIN_STORAGE_KEY); // Clean up any legacy localStorage flag
    window.dispatchEvent(new CustomEvent('sri_infra_admin_auth_changed', { detail: { isAdmin: false } }));
  } catch (e) {
    console.error(e);
  }
};
