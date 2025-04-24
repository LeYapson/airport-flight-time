import { ref, inject, provide } from 'vue';

// Clé d'injection pour le filtre
const companyFilterKey = Symbol('companyFilter');

export function provideCompanyFilter() {
  const companyFilter = ref('');
  
  const setCompanyFilter = (value) => {
    companyFilter.value = value;
  };
  
  provide(companyFilterKey, {
    companyFilter,
    setCompanyFilter
  });
}

export function useCompanyFilter() {
  const filterContext = inject(companyFilterKey);
  
  if (!filterContext) {
    throw new Error('useCompanyFilter() doit être utilisé dans un composant enfant de provideCompanyFilter()');
  }
  
  return filterContext;
}