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

    <ion-content class="ion-padding">
      <div class="form-container">
        <h2 class="form-title">Nueva Lista de Compras</h2>
        <p class="form-subtitle">Crea una nueva lista para organizar tus compras</p>

        <ion-item class="form-item" lines="none">
          <ion-input
            v-model="listName"
            label="Nombre de la Lista"
            label-placement="stacked"
            placeholder="Ej: Supermercado, Farmacia..."
            class="custom-input"
          ></ion-input>
        </ion-item>

        <ion-item class="form-item" lines="none">
          <ion-select
            v-model="category"
            label="Categoría"
            label-placement="stacked"
            placeholder="Selecciona una categoría"
            class="custom-select"
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
          @click="createList"
          class="submit-button"
          :disabled="!canSubmit"
          size="large"
        >
          Crear Lista
        </ion-button>
      </div>
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
  IonTitle,
  toastController
} from '@ionic/vue';
import { useShoppingListStore } from '@/store/shoppingListStore';

const router = useRouter();
const store = useShoppingListStore();

const listName = ref('');
const category = ref('');

const canSubmit = computed(() => {
  return listName.value.trim().length > 0 && category.value.trim().length > 0;
});

const getBackButtonText = () => {
  const win = window as any;
  const mode = win && win.Ionic && win.Ionic.mode;
  return mode === 'ios' ? 'Inbox' : '';
};

async function createList() {
  if (!canSubmit.value) return;

  try {
    const newList = store.createList(listName.value.trim(), category.value);

    // Mostrar mensaje de éxito
    const toast = await toastController.create({
      message: `Lista "${newList.name}" creada exitosamente`,
      duration: 2000,
      position: 'bottom',
      color: 'success'
    });
    await toast.present();

    // Limpiar formulario
    listName.value = '';
    category.value = '';

    // Regresar a home
    router.push('/home');
  } catch (error) {
    const toast = await toastController.create({
      message: 'Error al crear la lista',
      duration: 2000,
      position: 'bottom',
      color: 'danger'
    });
    await toast.present();
  }
}

</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.form-title {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 8px 0;
  color: var(--ion-color-primary);
}

.form-subtitle {
  font-size: 14px;
  color: var(--ion-color-medium);
  margin: 0 0 24px 0;
}

.form-item {
  --background: var(--ion-color-light);
  --border-radius: 12px;
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 12px;
  --padding-bottom: 12px;
  margin-bottom: 16px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-item ion-input,
.form-item ion-select {
  --padding-start: 0;
  --padding-end: 0;
}

.form-item ion-label {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
  color: var(--ion-color-dark);
}

.submit-button {
  margin-top: 24px;
  --border-radius: 12px;
  font-weight: 600;
  height: 50px;
}

/* Mejorar contraste del input */
ion-input {
  --color: var(--ion-color-dark);
  --placeholder-color: var(--ion-color-medium);
  --placeholder-opacity: 0.7;
  font-size: 16px;
}

ion-select {
  --color: var(--ion-color-dark);
  --placeholder-color: var(--ion-color-medium);
  --placeholder-opacity: 0.7;
  font-size: 16px;
}
</style>
