<template>
  <div :class="['flight-card', flightStatusClass, { 'flight-past': isPast }]">
    <div class="flight-header">
      <h3 class="flight-title">Vol {{ flightDetail.flight_number || 'N/A' }}</h3>
      <span v-if="isFollowed" class="badge badge-followed">Suivi</span>
    </div>
    
    <div class="flight-content">
      <div class="flight-info">
        <span class="flight-label">Destination</span>
        <span v-if="flightDetail.city" class="flight-value">{{ flightDetail.city }}</span>
        <span v-else class="flight-value flight-missing-info">Information non disponible</span>
      </div>
      
      <div class="flight-info">
        <span class="flight-label">Compagnie</span>
        <span v-if="flightDetail.company" class="flight-value">{{ flightDetail.company }}</span>
        <span v-else class="flight-value flight-missing-info">Information non disponible</span>
      </div>
      
      <div class="flight-info">
        <span class="flight-label">Heure prévue</span>
        <span v-if="validDepartureDate" class="flight-value">{{ formattedTime }}</span>
        <span v-else class="flight-value flight-missing-info">Horaire non disponible</span>
      </div>
      
      <div class="flight-info">
        <span class="flight-label">Statut</span>
        <span v-if="flightDetail.status" :class="['badge', statusBadgeClass]">{{ translatedStatus }}</span>
        <span v-else class="badge">Non défini</span>
      </div>
    </div>
    
    <div class="flight-actions mt-3">
      <button @click="openFollowModal" class="btn btn-primary">
        <i class="fas fa-bell"></i> Suivre ce vol
      </button>
    </div>
    
    <FollowModal v-if="showFollowModal" :flightNumber="flightDetail.flight_number || 'N/A'" @close="showFollowModal = false" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import FollowModal from './FollowModal.vue';

const props = defineProps({
  flightDetail: {
    type: Object,
    required: true,
    default: () => ({})
  }
});

const currentTime = new Date();
const validDepartureDate = computed(() => {
  return props.flightDetail.departure_time && 
         props.flightDetail.departure_time instanceof Date && 
         !isNaN(props.flightDetail.departure_time.getTime());
});

const departureDate = computed(() => {
  return validDepartureDate.value ? props.flightDetail.departure_time : new Date();
});

const isPast = computed(() => {
  return validDepartureDate.value && departureDate.value < currentTime;
});

const formattedTime = computed(() => {
  if (!validDepartureDate.value) return 'N/A';
  
  try {
    return departureDate.value.toLocaleTimeString('fr-FR', {
      hour: '2-digit', 
      minute: '2-digit'
    });
  } catch (e) {
    console.error('Erreur de formatage de date:', e);
    return 'Format invalide';
  }
});

const translatedStatus = computed(() => {
  if (!props.flightDetail.status) return 'Statut inconnu';
  
  const status = props.flightDetail.status.toLowerCase();
  if (status === 'on time' || status === 'on-time' || status === 'scheduled') return 'À l\'heure';
  if (status === 'delayed') return 'Retardé';
  if (status === 'cancelled') return 'Annulé';
  if (status === 'diverted') return 'Dérouté';
  return props.flightDetail.status;
});

const flightStatusClass = computed(() => {
  if (!props.flightDetail.status) return '';
  
  const status = props.flightDetail.status.toLowerCase();
  if (status === 'on time' || status === 'on-time' || status === 'scheduled') return 'flight-on-time';
  if (status === 'delayed') return 'flight-delayed';
  if (status === 'cancelled') return 'flight-cancelled';
  if (status === 'diverted') return 'flight-diverted';
  return '';
});

const statusBadgeClass = computed(() => {
  if (!props.flightDetail.status) return '';
  
  const status = props.flightDetail.status.toLowerCase();
  if (status === 'on time' || status === 'on-time' || status === 'scheduled') return 'badge-on-time';
  if (status === 'delayed') return 'badge-delayed';
  if (status === 'cancelled') return 'badge-cancelled';
  if (status === 'diverted') return 'badge-diverted';
  return '';
});

const isFollowed = ref(false);
const showFollowModal = ref(false);

const openFollowModal = () => {
  showFollowModal.value = true;
};
</script>

<style scoped>
.flight-card {
  background-color: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.08);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.flight-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.flight-past {
  opacity: 0.7;
  background-color: #f8f9fa;
}

.flight-on-time {
  border-left: 5px solid var(--status-on-time);
}

.flight-delayed {
  border-left: 5px solid var(--status-delayed);
}

.flight-cancelled {
  border-left: 5px solid var(--status-cancelled);
}

.flight-diverted {
  border-left: 5px solid var(--status-diverted);
}

.flight-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
  border-bottom: 1px solid var(--gray-light);
  padding-bottom: 0.75rem;
}

.flight-title {
  font-size: 1.25rem;
  margin: 0;
  color: var(--primary-color);
  font-weight: 600;
}

.flight-content {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.flight-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.flight-label {
  font-size: 0.875rem;
  color: var(--gray-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.flight-value {
  font-size: 1rem;
  font-weight: 500;
}

.flight-missing-info {
  color: var(--gray-color);
  font-style: italic;
}

.flight-actions {
  margin-top: 1.5rem;
  text-align: right;
}

.badge {
  padding: 0.4em 0.8em;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 50px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.badge-on-time {
  background-color: rgba(71, 184, 129, 0.15);
  color: var(--status-on-time);
  border: 1px solid var(--status-on-time);
}

.badge-delayed {
  background-color: rgba(255, 176, 32, 0.15);
  color: var(--status-delayed);
  border: 1px solid var(--status-delayed);
}

.badge-cancelled {
  background-color: rgba(244, 67, 54, 0.15);
  color: var(--status-cancelled);
  border: 1px solid var(--status-cancelled);
}

.badge-diverted {
  background-color: rgba(128, 90, 213, 0.15);
  color: var(--status-diverted);
  border: 1px solid var(--status-diverted);
}

.badge-followed {
  background-color: rgba(74, 105, 165, 0.15);
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.mt-3 {
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .flight-content {
    grid-template-columns: 1fr;
  }
  
  .flight-actions {
    text-align: center;
  }
}
</style>
