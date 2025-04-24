<template>
    <div class="container">
      <h2>Vols à l'arrivée</h2>
      
      <div class="sort-controls">
        <button @click="toggleSortOrder" class="btn sort-btn">
          <i :class="['fas', sortAscending ? 'fa-sort-amount-down-alt' : 'fa-sort-amount-up']"></i>
          {{ sortAscending ? 'Les plus proches d\'abord' : 'Les plus tardifs d\'abord' }}
        </button>
      </div>

      <div v-if="loading" class="alert alert-info">
        <span class="alert-icon">
          <i class="fas fa-spinner fa-spin"></i>
        </span>
        Chargement des données...
      </div>
      
      <div v-if="error" class="alert alert-danger">
        <span class="alert-icon">
          <i class="fas fa-exclamation-circle"></i>
        </span>
        {{ error }}
      </div>
      
      <div v-if="!loading && filteredFlights.length === 0 && !error" class="alert alert-warning">
        <span class="alert-icon">
          <i class="fas fa-info-circle"></i>
        </span>
        {{ companyFilter ? 'Aucun vol ne correspond à votre recherche.' : 'Aucun vol à l\'arrivée n\'est disponible pour le moment.' }}
      </div>

      <div class="grid">
        <div v-for="flight in filteredFlights" :key="flight.flight_number" class="flight-item">
          <Flight :flightDetail="flight" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import Flight from './Flight.vue';
  import { useCompanyFilter } from '../composables/useCompanyFilter';
  
  const flightsListArrival = ref([]);
  const error = ref(null);
  const loading = ref(true);
  const sortAscending = ref(true); // Ajouter cette ligne
  
  // Utiliser le composable pour la fonctionnalité de filtre
  const { companyFilter } = useCompanyFilter();
  
  // Ajouter cette fonction
  const toggleSortOrder = () => {
    sortAscending.value = !sortAscending.value;
  };
  
  // Filtrer les vols par compagnie et les trier par heure de départ avec prise en compte de l'ordre
  const filteredFlights = computed(() => {
    // Récupérer la liste des vols
    let flights = [...flightsListArrival.value];
    
    // Filtrer par compagnie si un filtre est appliqué
    if (companyFilter.value) {
      const searchTerm = companyFilter.value.toLowerCase();
      flights = flights.filter(flight => {
        return flight.company && flight.company.toLowerCase().includes(searchTerm);
      });
    }
    
    // Trier par heure d'arrivée avec prise en compte de l'ordre
    return flights.sort((a, b) => {
      // Gérer les cas où departure_time est null
      if (!a.departure_time) return 1;
      if (!b.departure_time) return -1;
      
      // Trier par heure selon l'ordre choisi
      return sortAscending.value 
        ? a.departure_time - b.departure_time 
        : b.departure_time - a.departure_time;
    });
  });
  
  onMounted(async () => {
    try {
      loading.value = true;
      
      // Commenté: appel API externe
      /*
      const response = await fetch(`http://api.aviationstack.com/v1/flights?access_key=${apiKey}&arr_iata=${airportCode}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'API Error');
      }
      
      flightsListArrival.value = data.data.map(flight => ({
        flight_number: flight.flight.iata || 'N/A',
        destination_airport_code: flight.departure.iata || 'N/A',
        city: flight.departure.airport || 'Information non disponible',
        company: flight.airline.name || 'Information non disponible',
        departure_time: flight.arrival.scheduled || null,
        status: flight.flight_status || 'unknown'
      }));
      */
      
      // Nouvel appel à la source de données locale
      const response = await fetch('/data/flights-arrival.json');
      if (!response.ok) {
        throw new Error('Impossible de charger les données locales');
      }
      const data = await response.json();
      
      // Adapter le format des données JSON locales
      flightsListArrival.value = data.flights.map(flight => ({
        flight_number: flight.flight_number || 'N/A',
        destination_airport_code: flight.origin_airport_code || 'N/A',
        city: flight.origin_city || 'Information non disponible',
        company: flight.company || 'Information non disponible',
        departure_time: formatDateTimeFromString(flight.arrival_time_due) || null,
        status: flight.status || 'unknown'
      }));
      
    } catch (err) {
      error.value = 'Impossible de récupérer les données de vol : ' + err.message;
      console.error(err);
    } finally {
      loading.value = false;
    }
  });
  
  // Fonction pour formater l'heure au format Date (pour permettre les comparaisons)
  function formatDateTimeFromString(timeStr) {
    if (!timeStr) return null;
    
    // Créer une date pour aujourd'hui
    const today = new Date();
    const [hours, minutes] = timeStr.split(':').map(num => parseInt(num, 10));
    
    // Définir les heures et minutes
    today.setHours(hours, minutes, 0, 0);
    
    return today;
  }
  </script>
  
  <style scoped>
  .grid {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .flight-item {
    flex: 1 1 calc(50% - 1rem);
  }
  
  .alert {
    padding: 1rem;
    border-radius: 0.5rem;
  }
  
  .alert-info {
    background-color: #d9edf7;
    color: #31708f;
  }
  
  .alert-danger {
    background-color: #f2dede;
    color: #a94442;
  }
  
  .alert-warning {
    background-color: #fcf8e3;
    color: #8a6d3b;
  }
  
  .alert-icon {
    margin-right: 0.5rem;
  }

  .sort-controls {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 1rem;
  }

  .sort-btn {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    background-color: #f5f7fa;
    color: var(--primary-color, #4a6fa5);
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.2s;
  }

  .sort-btn:hover {
    background-color: #edf2f7;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  }

  .sort-btn i {
    font-size: 1rem;
  }
  </style>