<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :text="getBackButtonText()" default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Ropa</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
            
       <ion-item :button="true">
        <ion-icon color="primary" slot="start" :icon="ellipse" size="large"></ion-icon>
        <ion-label>Camisa</ion-label>
        <ion-checkbox color="success" slot="end" aria-label="Toggle task completion"></ion-checkbox>
      </ion-item>

      <ion-item :button="true">
        <ion-icon color="primary" slot="start" :icon="ellipse" size="large"></ion-icon>
        <ion-label>Medias</ion-label>
        <ion-checkbox color="success" slot="end" aria-label="Toggle task completion"></ion-checkbox>
      </ion-item>

      <ion-item :button="true">
        <ion-icon color="primary" slot="start" :icon="ellipse" size="large"></ion-icon>
        <ion-label>Pantalón</ion-label>
        <ion-checkbox color="success" slot="end" aria-label="Toggle task completion"></ion-checkbox>
      </ion-item>


      <ion-fab  slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button class="additem" @click="goToaddItem">
          <label for="">Nuevo Item</label>
        </ion-fab-button>
      </ion-fab>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonContent,
  IonHeader,
  IonList,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  IonCard,
  IonFab,
  IonIcon,
  IonFabButton,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonButtons,
  IonBackButton,
  IonItem,
  IonLabel,
  IonNote,
  IonCheckbox

} from '@ionic/vue';
import { add, ellipse } from 'ionicons/icons';
import { chevronForward, listCircle } from 'ionicons/icons';
import { useRouter } from 'vue-router';

const router = useRouter();

function goToaddItem() {
  router.push('/addItem');
}

const getBackButtonText = () => {
  const win = window as any;
  const mode = win && win.Ionic && win.Ionic.mode;
  return mode === 'ios' ? 'Inbox' : '';
};

const refresh = (ev: CustomEvent) => {
  setTimeout(() => {
    ev.detail.complete();
  }, 3000);
};
</script>

