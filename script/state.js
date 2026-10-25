export const state = {
  customers: [],
  products: [],
  orders: [],
  search: "",
  selectedStatus: "Tous",
  selectedCategory: "Toutes",
  inscriptions: [],
  message: ""
};

export function setCustomers(customers) { state.customers = customers; }
export function setProducts(products) { state.products = products; }
export function setOrders(orders) { state.orders = orders; }
export function setSearch(search) { state.search = search; }
export function setSelectedStatus(status) { state.selectedStatus = status; }
export function setSelectedCategory(category) { state.selectedCategory = category; }
export function setInscriptions(inscriptions) { state.inscriptions = inscriptions; }
export function ajouterInscription(inscription) { state.inscriptions.push(inscription); }
export function setMessage(message) { state.message = message; }
