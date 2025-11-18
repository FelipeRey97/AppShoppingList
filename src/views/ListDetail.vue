<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button :text="getBackButtonText()" default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ currentList?.name || 'Lista' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div v-if="!currentList" style="text-align: center; padding: 40px 20px; color: #666;">
        <p>No se encontró la lista</p>
      </div>

      <div v-else-if="currentList.items.length === 0" style="text-align: center; padding: 40px 20px; color: #666;">
        <p>No hay items en esta lista</p>
        <p style="font-size: 14px;">Agrega tu primer item</p>
      </div>

      <div class="items-container">
        <ion-item
          v-for="item in currentList?.items"
          :key="item.id"
          :button="true"
          class="item-card"
          lines="none"
        >
          <ion-icon
            color="primary"
            slot="start"
            :icon="ellipse"
            size="large"
            :style="{ opacity: item.completed ? 0.3 : 1 }"
          ></ion-icon>
          <ion-label
            :style="{ textDecoration: item.completed ? 'line-through' : 'none', opacity: item.completed ? 0.5 : 1 }"
            class="item-label"
          >
            <h3>{{ item.name }}</h3>
            <p v-if="item.quantity > 1" class="quantity-text">Cantidad: {{ item.quantity }}</p>
          </ion-label>
          <ion-checkbox
            color="success"
            slot="end"
            :checked="item.completed"
            @ionChange="toggleItem(item.id)"
            aria-label="Toggle task completion"
          ></ion-checkbox>
          <ion-button
            fill="clear"
            size="small"
            color="danger"
            @click.stop="confirmDeleteItem(item.id, item.name)"
            class="delete-item-btn"
          >
            <ion-icon slot="icon-only" :icon="trash"></ion-icon>
          </ion-button>
        </ion-item>
      </div>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button class="additem" @click="goToaddItem">
          <label for="">Nuevo Item</label>
        </ion-fab-button>
      </ion-fab>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar,
  IonFab,
  IonIcon,
  IonFabButton,
  IonButtons,
  IonBackButton,
  IonItem,
  IonLabel,
  IonCheckbox,
  IonButton,
  alertController
} from '@ionic/vue';
import { ellipse, trash } from 'ionicons/icons';
import { useRouter, useRoute } from 'vue-router';
import { useShoppingListStore } from '@/store/shoppingListStore';

const router = useRouter();
const route = useRoute();
const store = useShoppingListStore();

const currentList = computed(() => {
  const listId = route.query.id as string;
  if (!listId) return store.currentList;
  return store.getListById(listId);
});

onMounted(() => {
  const listId = route.query.id as string;
  if (listId) {
    store.setCurrentList(listId);
  }
});

function goToaddItem() {
  const listId = currentList.value?.id;
  if (listId) {
    router.push({ path: '/addItem', query: { listId } });
  }
}

const getBackButtonText = () => {
  const win = window as any;
  const mode = win && win.Ionic && win.Ionic.mode;
  return mode === 'ios' ? 'Inbox' : '';
};

const refresh = (ev: CustomEvent) => {
  store.loadLists();
  setTimeout(() => {
    ev.detail.complete();
  }, 500);
};

function toggleItem(itemId: string) {
  const listId = currentList.value?.id;
  if (listId) {
    store.toggleItemCompleted(listId, itemId);
  }
}

async function confirmDeleteItem(itemId: string, itemName: string) {
  const alert = await alertController.create({
    header: 'Confirmar eliminación',
    message: `¿Estás seguro de eliminar "${itemName}"?`,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Eliminar',
        role: 'destructive',
        handler: () => {
          const listId = currentList.value?.id;
          if (listId) {
            store.deleteItem(listId, itemId);
          }
        }
      }
    ]
  });

  await alert.present();
}
</script>

<style scoped>
.items-container {
  padding: 16px;
  padding-bottom: 80px;
}

.item-card {
  --background: var(--ion-color-light);
  --border-radius: 12px;
  --padding-start: 16px;
  --padding-end: 8px;
  margin-bottom: 10px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.item-card:active {
  transform: scale(0.98);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.08);
}

.item-label h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.quantity-text {
  margin: 4px 0 0 0;
  font-size: 13px;
  color: var(--ion-color-medium);
}

.delete-item-btn {
  margin: 0;
  --padding-start: 8px;
  --padding-end: 8px;
}
</style>
