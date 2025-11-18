<template>
  <ion-page>
    <ion-header :translucent="false">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :text="getBackButtonText()" default-href="/"></ion-back-button>
          <ion-title>Agregar Item</ion-title>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div class="form-container">
        <h2 class="form-title">Nuevo Item</h2>
        <p class="form-subtitle">Agrega un producto a tu lista de compras</p>

        <ion-item class="form-item" lines="none">
          <ion-input
            v-model="itemName"
            label="Nombre del Item"
            label-placement="stacked"
            placeholder="Ej: Leche, Pan, Huevos..."
            class="custom-input"
          ></ion-input>
        </ion-item>

        <ion-item class="form-item" lines="none">
          <ion-input
            v-model.number="quantity"
            label="Cantidad"
            label-placement="stacked"
            type="number"
            placeholder="¿Cuántos necesitas?"
            :min="1"
            class="custom-input"
          ></ion-input>
        </ion-item>

        <ion-button
          expand="block"
          @click="addItem"
          class="submit-button"
          :disabled="!canSubmit"
          size="large"
        >
          Agregar Item
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonPage,
  IonToolbar,
  IonInput,
  IonButton,
  IonTitle,
  toastController
} from '@ionic/vue';
import { useShoppingListStore } from '@/store/shoppingListStore';

const route = useRoute();
const router = useRouter();
const store = useShoppingListStore();

const itemName = ref('');
const quantity = ref(1);

const listId = computed(() => route.query.listId as string);

const canSubmit = computed(() => {
  return itemName.value.trim().length > 0 && quantity.value > 0;
});

const getBackButtonText = () => {
  const win = window as any;
  const mode = win && win.Ionic && win.Ionic.mode;
  return mode === 'ios' ? 'Inbox' : '';
};

async function addItem() {
  if (!canSubmit.value || !listId.value) return;

  try {
    const newItem = store.addItem(listId.value, itemName.value.trim(), quantity.value);

    if (newItem) {
      // Mostrar mensaje de éxito
      const toast = await toastController.create({
        message: `Item "${newItem.name}" agregado exitosamente`,
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();

      // Limpiar formulario
      itemName.value = '';
      quantity.value = 1;

      // Regresar a ListDetail
      router.push({ path: '/ListDetail', query: { id: listId.value } });
    } else {
      throw new Error('No se pudo agregar el item');
    }
  } catch (error) {
    const toast = await toastController.create({
      message: 'Error al agregar el item',
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

.form-item ion-input {
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
</style>
