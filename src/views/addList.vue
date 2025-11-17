<template>
  <ion-page>
    <ion-header :translucent="false">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :text="getBackButtonText()" default-href="/"></ion-back-button>
          <ion-title>Crear Nueva Lista</ion-title>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
    

    <ion-item>
      <ion-input label="Lista" placeholder="Nombre de tu Lista"></ion-input>

    </ion-item>

    <ion-item>
      
    <ion-select label="Categoría" placeholder="Selecciona Categoría">        
        <ion-select-option value="Mercado">Mercado</ion-select-option>
        <ion-select-option value="Hogar">Hogar</ion-select-option>
        <ion-select-option value="Electrónica">Electrónica</ion-select-option>
        <ion-select-option value="Farmacia">Farmacia</ion-select-option>
        <ion-select-option value="Otros">Otros</ion-select-option>
      </ion-select>
    </ion-item>

    <ion-button expand="block" type="submit" class="ion-margin-top">
      Crear Lista
    </ion-button>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonPage,
  IonToolbar,
  IonInput,
  IonSelect,
  IonSelectModal,
  IonSelectOption
} from '@ionic/vue';

const getBackButtonText = () => {
  const win = window as any;
  const mode = win && win.Ionic && win.Ionic.mode;
  return mode === 'ios' ? 'Inbox' : '';
};

</script>

<style scoped>
ion-item {
  --inner-padding-end: 0;
  --background: transparent;
}

ion-label {
  margin-top: 12px;
  margin-bottom: 12px;
}

ion-item h2 {
  font-weight: 600;
  
  /**
   * With larger font scales
   * the date/time should wrap to the next
   * line. However, there should be
   * space between the name and the date/time
   * if they can appear on the same line.
   */
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

ion-item .date {
  align-items: center;
  display: flex;
}

ion-item ion-icon {
  font-size: 42px;
  margin-right: 8px;
}

ion-item ion-note {
  font-size: 0.9375rem;
  margin-right: 12px;
  font-weight: normal;
}

h1 {
  margin: 0;
  font-weight: bold;
  font-size: 1.4rem;
}

p {
  line-height: 1.4;
}
</style>
