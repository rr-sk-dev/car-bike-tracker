import './style.css';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import QRCode from 'qrcode';

const map = L.map('map').setView([0, 0], 15);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
}).addTo(map);

const marker = L.marker([0, 0]).addTo(map);

// Speed Display
const speedElement = document.getElementById('speed') as HTMLSpanElement;

// QR Code Elements
const qrContainer = document.getElementById('qr-container') as HTMLDivElement;
const qrCodeCanvas = document.getElementById('qr-code') as HTMLCanvasElement;
const generateQRButton = document.getElementById('generate-qr') as HTMLButtonElement;
const closeQRButton = document.getElementById('close-qr') as HTMLButtonElement;

let currentLat = 0;
let currentLng = 0;

// Watch user's location
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, speed } = position.coords;

      currentLat = latitude;
      currentLng = longitude;

      // Update map and marker
      map.setView([latitude, longitude], 15);
      marker.setLatLng([latitude, longitude]);

      // Update speed
      speedElement.textContent = speed ? (speed * 3.6).toFixed(2) : '0';
    },
    (error) => {
      console.error('Geolocation error:', error);
    },
    { enableHighAccuracy: true }
  );
} else {
  alert('Geolocation is not supported by your browser.');
}

// Generate QR Code
generateQRButton.addEventListener('click', async () => {
  const locationUrl = `${window.location.origin}?lat=${currentLat}&lng=${currentLng}`;
  try {
    await QRCode.toCanvas(qrCodeCanvas, locationUrl, { width: 200 });
    qrContainer.style.display = 'block';
  } catch (error) {
    console.error('Failed to generate QR code:', error);
  }
});

// Close QR Code
closeQRButton.addEventListener('click', () => {
  qrContainer.style.display = 'none';
});
