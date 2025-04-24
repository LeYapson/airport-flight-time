<template>
  <div class="modal-overlay">
    <div class="modal-container">
      <div class="modal-header">
        <h3 class="modal-title">Suivre le vol {{ flightNumber }}</h3>
        <button class="modal-close" @click="closeModal">×</button>
      </div>
      
      <div class="modal-body">
        <div class="form-group">
          <label for="email">Votre adresse e-mail</label>
          <input 
            type="email" 
            id="email"
            v-model="email" 
            placeholder="Entrez votre email" 
            class="form-input" 
          />
          <p v-if="emailError" class="form-error">{{ emailError }}</p>
        </div>
        
        <div class="form-group">
          <label for="notifications">Type de notifications</label>
          <select id="notifications" v-model="notificationType" class="form-input">
            <option value="all">Toutes les mises à jour</option>
            <option value="delays">Uniquement les retards</option>
            <option value="gate">Changements de porte</option>
          </select>
        </div>
      </div>
      
      <div class="modal-footer">
        <button @click="followFlight" class="btn btn-primary">Confirmer</button>
        <button @click="closeModal" class="btn btn-outline">Annuler</button>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref } from 'vue';

const props = defineProps({
  flightNumber: {
    type: String,
    required: true
  }
});

const emit = defineEmits(['close']);
const email = ref('');
const emailError = ref('');
const notificationType = ref('all');

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value) {
    emailError.value = 'L\'adresse email est requise';
    return false;
  } else if (!emailRegex.test(email.value)) {
    emailError.value = 'Veuillez entrer une adresse email valide';
    return false;
  }
  emailError.value = '';
  return true;
};

const followFlight = () => {
  if (validateEmail()) {
    console.log(`Suivi du vol ${props.flightNumber} avec l'email ${email.value} (type: ${notificationType.value})`);
    // Ici vous pourriez envoyer les données à un serveur
    closeModal();
  }
};

const closeModal = () => {
  emit('close');
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease-out;
}

.modal-container {
  background-color: white;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  animation: slideUp 0.3s ease-out;
  overflow: hidden;
}

.modal-header {
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--gray-light);
}

.modal-title {
  margin: 0;
  color: var(--primary-color);
  font-weight: 600;
}

.modal-close {
  border: none;
  background: none;
  font-size: 1.5rem;
  color: var(--gray-color);
  cursor: pointer;
  transition: color 0.2s;
}

.modal-close:hover {
  color: var(--danger-color);
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid var(--gray-light);
}

.form-error {
  color: var(--danger-color);
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
</style>
