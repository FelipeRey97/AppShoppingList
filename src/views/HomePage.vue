<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Mis Listas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <ion-searchbar showCancelButton="focus" class="custom"></ion-searchbar>
            
      <ion-card @click="goToListDetail">
        <ion-card-header>
          
          <ion-card-title class="title-row">
            <ion-icon :icon="receipt" color="secondary" size="small" ></ion-icon>
            <span>Ropa</span>
            </ion-card-title>
          <ion-card-subtitle>2025-11-16</ion-card-subtitle>
        </ion-card-header>
      </ion-card>

            <ion-card>
        <ion-card-header>
          <ion-card-title class="title-row">
            <ion-icon :icon="receipt" color="secondary" size="small" ></ion-icon>
            <span>Medicamentos</span>
            </ion-card-title>
          <ion-card-subtitle>2025-11-16</ion-card-subtitle>
        </ion-card-header>
      </ion-card>

            <ion-card>
        <ion-card-header>
          <ion-card-title class="title-row">
            <ion-icon :icon="receipt" color="secondary" size="small" ></ion-icon>
            <span>Herramientas</span>
            </ion-card-title>
          <ion-card-subtitle>2025-11-16</ion-card-subtitle>
        </ion-card-header>
      </ion-card>


            <ion-card>
        <ion-card-header>
          <ion-card-title class="title-row">
            <ion-icon :icon="receipt" color="secondary" size="small" ></ion-icon>
            <span>Comida</span>
            </ion-card-title>
          <ion-card-subtitle>2025-11-16</ion-card-subtitle>
        </ion-card-header>
      </ion-card>


      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button class="additem" @click="goToaddList">
          <label for="">Nueva Lista</label>
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
  IonSearchbar
} from '@ionic/vue';
import { add, receipt } from 'ionicons/icons';
import { useRouter } from 'vue-router';

const router = useRouter();

function goToaddList() {
  router.push('/addList');
}

function goToListDetail() {
  router.push('/ListDetail');
}

const refresh = (ev: CustomEvent) => {
  setTimeout(() => {
    ev.detail.complete();
  }, 3000);
};
</script>

