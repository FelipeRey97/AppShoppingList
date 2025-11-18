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

      <ion-searchbar
        v-model="searchText"
        showCancelButton="focus"
        class="custom"
        @ionInput="handleSearch"
        placeholder="Buscar listas..."
      ></ion-searchbar>

      <div v-if="filteredLists.length === 0" style="text-align: center; padding: 40px 20px; color: #666;">
        <p>No hay listas disponibles</p>
        <p style="font-size: 14px;">Crea tu primera lista de compras</p>
      </div>

      <div class="lists-container">
        <ion-card
          v-for="list in filteredLists"
          :key="list.id"
          @click="goToListDetail(list.id)"
          class="list-card"
          button
        >
          <ion-card-header>
            <ion-card-title class="title-row">
              <ion-icon :icon="receipt" color="secondary" size="small"></ion-icon>
              <span class="list-name">{{ list.name }}</span>
              <ion-button
                fill="clear"
                size="small"
                color="danger"
                @click.stop="confirmDelete(list.id, list.name)"
                class="delete-btn"
              >
                <ion-icon slot="icon-only" :icon="trash"></ion-icon>
              </ion-button>
            </ion-card-title>
            <ion-card-subtitle class="list-info">
              {{ formatDate(list.updatedAt) }} · {{ list.category }} · {{ list.items.length }} items
            </ion-card-subtitle>
          </ion-card-header>
        </ion-card>
      </div>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button class="additem" @click="goToaddList">
          <label for="">Nueva Lista</label>
        </ion-fab-button>
      </ion-fab>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
  IonContent,
  IonHeader,
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
  IonSearchbar,
  IonButton,
  alertController
} from '@ionic/vue';
import { receipt, trash } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { useShoppingListStore } from '@/store/shoppingListStore';

const router = useRouter();
const store = useShoppingListStore();
const searchText = ref('');

// Cargar listas al montar el componente
onMounted(() => {
  store.initializeSampleData();
  store.loadLists();
});

// Listas filtradas por búsqueda
const filteredLists = computed(() => {
  if (!searchText.value.trim()) {
    return store.sortedLists;
  }

  const search = searchText.value.toLowerCase();
  return store.sortedLists.filter(list =>
    list.name.toLowerCase().includes(search) ||
    list.category.toLowerCase().includes(search)
  );
});

function goToaddList() {
  router.push('/addList');
}

function goToListDetail(listId: string) {
  store.setCurrentList(listId);
  router.push({ path: '/ListDetail', query: { id: listId } });
}

function handleSearch(event: CustomEvent) {
  searchText.value = event.detail.value;
}

const refresh = (ev: CustomEvent) => {
  store.loadLists();
  setTimeout(() => {
    ev.detail.complete();
  }, 500);
};

async function confirmDelete(listId: string, listName: string) {
  const alert = await alertController.create({
    header: 'Confirmar eliminación',
    message: `¿Estás seguro de eliminar la lista "${listName}"?`,
    buttons: [
      {
        text: 'Cancelar',
        role: 'cancel'
      },
      {
        text: 'Eliminar',
        role: 'destructive',
        handler: () => {
          store.deleteList(listId);
        }
      }
    ]
  });

  await alert.present();
}

function formatDate(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
</script>

<style scoped>
.lists-container {
  padding: 0 16px 80px 16px;
}

.list-card {
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.list-card:active {
  transform: scale(0.98);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
}

.list-name {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.list-info {
  margin-top: 8px;
  font-size: 13px;
  color: var(--ion-color-medium);
}

.delete-btn {
  margin: 0;
  --padding-start: 8px;
  --padding-end: 8px;
}

ion-searchbar {
  --background: var(--ion-color-light);
  --border-radius: 12px;
  --box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 8px 16px;
}
</style>
