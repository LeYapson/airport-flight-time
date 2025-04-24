import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import './style.css';
import FlightsDeparture from './components/FlightsDeparture.vue';
import FlightsArrival from './components/FlightsArrival.vue';

const routes = [
  { path: '/departures', component: FlightsDeparture },
  { path: '/arrivals', component: FlightsArrival },
  { path: '/', redirect: '/departures' } // Redirection par défaut
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

createApp(App).use(router).mount('#app');
