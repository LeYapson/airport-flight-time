<template>
  <div class="container">
    <h1>{{ title }}</h1>
    
    <nav class="nav mb-4">
      <ul class="nav-menu">
        <li class="nav-item">
          <router-link to="/departures" class="nav-link" active-class="active">Vols au départ</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/arrivals" class="nav-link" active-class="active">Vols à l'arrivée</router-link>
        </li>
      </ul>
    </nav>
    
    <div class="text-center mb-3">
      <a href="#" @click.prevent="toggleFilter" class="link">
        {{ showFilter ? 'Masquer les filtres' : 'Afficher les filtres' }}
      </a>
    </div>
    
    <Transition name="fade">
      <div v-show="showFilter" class="mb-4">
        <FilterFlights />
      </div>
    </Transition>
    
    <div class="text-center mb-3">
      <button @click="toggleDialog" class="btn btn-info">
        <i class="fas fa-info-circle"></i> Afficher le statut du trafic
      </button>
    </div>
    
    <Transition name="fade">
      <div v-show="dialogShow" class="alert alert-danger mb-4">
        <span class="alert-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </span>
        {{ dialogLabel }}
      </div>
    </Transition>
    
    <router-view></router-view>
    
    <footer class="footer">
      <p>Aéroport de Montpellier &copy; {{ new Date().getFullYear() }}</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import FilterFlights from './components/FilterFlights.vue';
import { provideCompanyFilter } from './composables/useCompanyFilter';

// Fournir le système de filtrage aux composants enfants
provideCompanyFilter();

const title = ref("Aéroport de Montpellier");
const dialogShow = ref(false);
const dialogLabel = ref("Grève prévue le 08/05/2025");
const showFilter = ref(false);

const toggleDialog = () => {
  dialogShow.value = !dialogShow.value;
};

const toggleFilter = () => {
  showFilter.value = !showFilter.value;
};
</script>
