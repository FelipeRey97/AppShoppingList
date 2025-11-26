<template>
  <ion-page>

    <!-- HEADER moderno -->
    <ion-header translucent>
      <ion-toolbar class="header-toolbar">
        <ion-title size="large">Mis Listas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content fullscreen>

      <!-- Searchbar flotante -->
      <div class="search-wrapper">
        <ion-searchbar
          v-model="searchText"
          @ionInput="handleSearch"
          placeholder="Buscar listas..."
          class="search-modern"
        ></ion-searchbar>
      </div>

      <!-- Refresher -->
      <ion-refresher slot="fixed" @ionRefresh="refresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <!-- Empty state -->
      <div v-if="filteredLists.length === 0" class="empty-state">
        <p>No hay listas disponibles</p>
        <p class="hint">Crea tu primera lista de compras</p>
      </div>

      <!-- LISTA moderna -->
      <ion-list inset="true" class="modern-list">
        <ion-item-sliding
          v-for="list in filteredLists"
          :key="list.id"
          class="slide-item"
        >
          <ion-item button detail="false" @click="goToListDetail(list.id)" class="list-row">

            <ion-label>
              <h2 class="list-title">{{ list.name }}</h2>
              <p class="list-sub">
                {{ formatDate(list.updatedAt) }} · {{ list.category }} · {{ list.items.length }} items
              </p>
            </ion-label>

          </ion-item>

          <ion-item-options side="end">
            <ion-item-option
              color="danger"
              expandable
              @click="confirmDelete(list.id, list.name)"
            >
              <ion-icon slot="icon-only" :icon="trash"></ion-icon>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <!-- BOTÓN flotante moderno -->
      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button class="fab-modern" @click="goToaddList">
          <ion-icon :icon="add"></ion-icon>
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
  IonItemSliding,
  IonItemOptions,
  IonItemOption,
  alertController
} from '@ionic/vue';
import { receipt, trash,add } from 'ionicons/icons';
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
.header-toolbar {
  --background: transparent;
  backdrop-filter: blur(10px);

  /* Aumenta la altura del header */
  --min-height: 90px; /* Prueba entre 80 y 120px */

  padding-top: 30px; /* separa el título de la barra de estado */
}

/* Searchbar flotante */
.search-wrapper {
  padding: 10px 16px 0 16px;
}

.search-modern {
  --background: var(--ion-color-light);
  --border-radius: 14px;
  --box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.search-modern {
  --background: white;
  --border-radius: 30px;
  --box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

/* Empty state */
.empty-state {
  text-align: center;
  padding-top: 80px;
  color: var(--ion-color-medium);
}

.empty-state p {
  margin: 6px 0;
}

.hint {
  font-size: 14px;
  opacity: 0.8;
}

/* Lista moderna */
.modern-list {
  margin: 0 12px 80px 12px;
  overflow: hidden;
}

.list-row {
  --padding-start: 16px;
  --padding-end: 10px;
  --detail-icon-color: transparent;
}

.list-row:active {
  background: rgba(0,0,0,0.04);
}

.icon-left {
  font-size: 22px;
  margin-right: 4px;
}

.list-title {
  font-size: 17px;
  font-weight: 600;
  color: var(--ion-color-dark);
}

.list-sub {
  font-size: 13px;
  color: var(--ion-color-medium);
}

/* FAB redondeado moderno */
.fab-modern {
  --border-radius: 50px;
  --box-shadow: 0px 6px 16px rgba(0,0,0,0.15);
  width: 60px;
  height: 60px;
  font-size: 24px;
}

</style>
