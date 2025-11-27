<template>
  <ion-page>

    <ion-header translucent>
      <ion-toolbar class="header-toolbar">
        <ion-buttons slot="start">
          <ion-back-button :text="getBackButtonText()" default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ currentList?.name || 'Lista' }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>

      <!-- Refresher -->
      <ion-refresher slot="fixed" @ionRefresh="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div v-if="!currentList" class="empty-state">
        <p>No se encontró la lista</p>
      </div>

      <div v-else-if="currentList.items.length === 0" class="empty-state">
        <p>No hay items</p>
        <p class="hint">Agrega tu primer item</p>
      </div>

      <ion-list inset="true" class="modern-list">
        <ion-item-sliding
          v-for="item in currentList?.items"
          :key="item.id"
          class="slide-item"
        >

          <ion-item
            lines="none"
            class="item-row"
          >

            <ion-label
              :style="{ textDecoration: item.completed ? 'line-through' : 'none', opacity: item.completed ? 0.5 : 1 }"
            >
              <h2 class="item-title">{{ item.name }}</h2>
              <p v-if="item.quantity > 1" class="item-sub">
                Cantidad: {{ item.quantity }}
              </p>
            </ion-label>

            <ion-checkbox
              color="success"
              slot="end"
              :checked="item.completed"
              @ionChange="toggleItem(item.id)"
            ></ion-checkbox>

          </ion-item>

          <ion-item-options side="end">
            <ion-item-option
              color="danger"
              expandable
              @click="confirmDeleteItem(item.id, item.name)"
            >
              <ion-icon slot="icon-only" :icon="trash"></ion-icon>
            </ion-item-option>
          </ion-item-options>

        </ion-item-sliding>
      </ion-list>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button class="fab-modern" @click="goToaddItem">
          <ion-icon :icon="add"></ion-icon>
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
  alertController,
  IonItemSliding,
  IonItemOption,
  IonItemOptions
} from '@ionic/vue';
import { ellipse, trash, add } from 'ionicons/icons';
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

.header-toolbar {
  --background: transparent;
  backdrop-filter: blur(10px);
  --min-height: 90px; 
  padding-top: 30px; 
}

.empty-state {
  text-align: center;
  padding-top: 80px;
  color: var(--ion-color-medium);
}

.hint {
  font-size: 14px;
  opacity: 0.8;
}

.modern-list {
  margin: 0 12px 90px 12px;
  overflow: hidden;
}

.item-row {
  --background: var(--ion-color-light);
  --padding-start: 16px;
  --padding-end: 12px;
}

.item-row:active {
  background: rgba(0,0,0,0.04);
}

.item-icon {
  font-size: 24px;
  margin-right: 4px;
}

.item-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--ion-text-color);
}

.item-sub {
  font-size: 13px;
  color: var(--ion-color-medium);
}

.fab-modern {
  --border-radius: 50px;
  --box-shadow: 0px 6px 16px rgba(0,0,0,0.15);
  width: 60px;
  height: 60px;
  font-size: 24px;
}

ion-checkbox {
  --size: 22px;
  --checkbox-background: white;
  --checkbox-background-checked: var(--ion-color-success);
  --border-color: #bdbdbd;
  --border-width: 2px;
  --border-radius: 6px;
  --checkmark-color: white;
  transition: all 0.18s ease-in-out;
}

ion-checkbox[checked] {
  transform: scale(1.05);
  border-color: var(--ion-color-success);
}

</style>
