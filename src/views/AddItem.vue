<template>
  <ion-page>
    <ion-header :translucent="false">
      <ion-toolbar class="header-toolbar">
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
          class="soft-button"
          :disabled="!canSubmit"
          @click="addItem"
        >
          <ion-icon name="add-outline" slot="start"></ion-icon>
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
      const toast = await toastController.create({
        message: `Item "${newItem.name}" agregado exitosamente`,
        duration: 2000,
        position: 'bottom',
        color: 'success'
      });
      await toast.present();

      itemName.value = '';
      quantity.value = 1;

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

.header-toolbar {
  --background: transparent;
  backdrop-filter: blur(10px);
  --min-height: 90px; 
  padding-top: 30px; 
}

.form-container {
  padding: 0;
}

.form-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--ion-color-primary);
  margin-bottom: 4px;
}

.form-subtitle {
  font-size: 14px;
  color: var(--ion-color-medium);
  margin-bottom: 20px;
}

.form-item {
  --background: transparent;
  margin-bottom: 20px;
  padding-left: 8px;
  padding-right: 8px;
  border: 1px solid var(--ion-color-light-shade);
  border-radius: 12px;
}

.form-item ion-label {
  font-weight: 600;
  color: var(--ion-text-color); 
}

.form-item ion-input {
  --color: var(--ion-text-color); 
  --placeholder-color: var(--ion-color-medium);
  padding-bottom: 6px;
  font-size: 16px;
}

</style>
