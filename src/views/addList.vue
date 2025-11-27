<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="header-toolbar">
        <ion-buttons slot="start">
          <ion-back-button default-href="/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Nueva Lista</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">

      <ion-card class="form-card">
        <ion-card-header>
          <ion-card-title class="title">Crear Nueva Lista</ion-card-title>
          <ion-card-subtitle class="subtitle">
            Organiza tus compras fácilmente
          </ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>

          <ion-item class="modern-item">
            <ion-label position="stacked">Nombre de la Lista</ion-label>
            <ion-input
              v-model="listName"
              placeholder="Ej: Supermercado, Farmacia..."
            ></ion-input>
          </ion-item>

          <ion-item class="modern-item">
            <ion-label position="stacked">Categoría</ion-label>
            <ion-select
              v-model="category"
              placeholder="Selecciona una categoría"
            >
              <ion-select-option value="Mercado">Mercado</ion-select-option>
              <ion-select-option value="Hogar">Hogar</ion-select-option>
              <ion-select-option value="Electrónica">Electrónica</ion-select-option>
              <ion-select-option value="Farmacia">Farmacia</ion-select-option>
              <ion-select-option value="Otros">Otros</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-button
          expand="block"
          class="soft-button"
          :disabled="!canSubmit"
          @click="createList"
        >
          <ion-icon name="add-outline" slot="start"></ion-icon>Crear Lista</ion-button>

        </ion-card-content>
      </ion-card>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonPage,
  IonToolbar,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonTitle,
  toastController
} from '@ionic/vue';
import { useShoppingListStore } from '@/store/shoppingListStore';

const router = useRouter();
const store = useShoppingListStore();

const listName = ref('');
const category = ref('');

const canSubmit = computed(() =>
  listName.value.trim().length > 0 && category.value.trim().length > 0
);

async function createList() {
  if (!canSubmit.value) return;

  try {
    const newList = store.createList(listName.value.trim(), category.value);

    const toast = await toastController.create({
      message: `Lista "${newList.name}" creada exitosamente`,
      duration: 2000,
      position: 'middle',
      color: 'success',
      cssClass: 'modern-toast'
    });
    toast.present();

    listName.value = '';
    category.value = '';

    router.push('/home');

  } catch (error) {
    const toast = await toastController.create({
      message: 'Error al crear la lista',
      duration: 2000,
      position: 'middle',
      color: 'danger',
      cssClass: 'modern-toast'
    });
    toast.present();
  }
}
</script>

<style scoped>

.header-toolbar {
  --background: transparent;
  backdrop-filter: blur(10px);
  --min-height: 90px; 
  padding-top: 30px; 
}

.form-card {
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}

.title {
  font-size: 22px;
  font-weight: 700;
  color: var(--ion-color-primary);
}

.subtitle {
  font-size: 14px;
  color: var(--ion-color-medium);
}

.modern-item {
  --background: transparent;
  --border-radius: 12px;
  margin-bottom: 20px;
  padding-left: 8px;
  padding-right: 8px;
  border: 1px solid var(--ion-color-light-shade);
  border-radius: 12px;
}

.modern-item ion-label {
  font-weight: 600;
  color: var(--ion-text-color); 
}

.modern-item ion-input,
.modern-item ion-select {
  --color: var(--ion-text-color); 
  --placeholder-color: var(--ion-color-medium);
  padding-bottom: 6px;
}

ion-select-option{
  --color: var(--ion-text-color); 

}

</style>
