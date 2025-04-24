<template>
  <div class="flight-filter">
    <h3 class="mb-2">Filtrer les vols</h3>
    
    <div class="form-group">
      <label for="company-filter">Recherche par compagnie</label>
      <div class="filter-input-group">
        <input 
          id="company-filter"
          v-model="searchInput" 
          placeholder="Nom de la compagnie" 
          class="form-input"
          @input="debounceSearch"
        />
        <button @click="applyFilter" class="btn btn-primary">
          <i class="fas fa-search"></i> Rechercher
        </button>
        <button @click="resetSearch" class="btn btn-outline">
          <i class="fas fa-times"></i> Réinitialiser
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useCompanyFilter } from '../composables/useCompanyFilter';

const searchInput = ref('');
const { companyFilter, setCompanyFilter } = useCompanyFilter();
let debounceTimeout = null;

// Synchroniser l'input avec le filtre global au chargement
onMounted(() => {
  searchInput.value = companyFilter.value || '';
});

const debounceSearch = () => {
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }
  debounceTimeout = setTimeout(() => {
    applyFilter();
  }, 300);
};

const applyFilter = () => {
  setCompanyFilter(searchInput.value);
};

const resetSearch = () => {
  searchInput.value = '';
  setCompanyFilter('');
};
</script>

<style scoped>
.flight-filter {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.filter-input-group {
  display: flex;
  gap: 10px;
}

.filter-input-group .form-input {
  flex: 1;
}

.btn-outline {
  background-color: transparent;
  color: var(--gray-color);
  border: 1px solid currentColor;
}

.btn-outline:hover {
  background-color: #f5f5f5;
}

@media (max-width: 768px) {
  .filter-input-group {
    flex-direction: column;
  }
}
</style>
