<template>
  <div class="current-sale-page">
    <hero :title="saleDates"
          :is-loading="isLoading"
    />

    <product-list-component
      :products="products"
      :is-loading="areProductsLoading"
    />
  </div>
</template>


<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import SaleModel from '@/models/SaleModel';
  import ProductModel from '@/models/ProductModel';
  import Hero from '@/components/layout/Hero.vue';
  import ProductListComponent from '@/components/products/ProductListComponent.vue';
  import {State} from 'vuex-class';

  @Component({components: {Hero, ProductListComponent}})
  export default class CurrentSalePage extends Vue
  {
    @State('currentSale', { namespace: 'currentSale' }) currentSale!: SaleModel;
    @State('isLoading', { namespace: 'currentSale' })   isLoading!: boolean;

    areProductsLoading: boolean = false;
    loadingError?: string | null;
    products: ProductModel[] = [];

    created()
    {
      if (this.currentSale) {
        this.populateProducts();
      }
    }

    get saleDates()
    {
      if (!this.currentSale) {
        return 'Aucune vente en cours. Repassez plus tard.';
      }

      const dateFormatterOptions = {
        weekday: 'long',
        day:     'numeric',
        month:   'long',
        hour:    'numeric',
        minute:  'numeric',
      };

      return `Commande à passer avant ${this.currentSale.closureDate.toLocaleString('fr-fr',
        dateFormatterOptions)}`;
      }


      retryLoading()
      {
        if (this.loadingError) {
          this.loadingError = null;
          this.populateProducts();
        }
      }

      @Watch('currentSale')
      async populateProducts()
      {
        this.areProductsLoading = true;
        try {
          this.products = await ProductModel.findAll({
            fields: [
              'id',
              'slug',
              'nom',
              'description',
              'producteur.*.*',
              'categorie.*',
              'tags.tag_id.*',
              'variantes.*',
              'variantes.conditionnement.*',
              'variantes.unite_de_mesure.*',
              'variantes.ventes.*',
              'photos.*.*',
            ],
            filter: {
              'variantes.prix':             { nnull: true },
              'categorie':                  { nnull: true },
              'variantes.ventes.ventes_id': this.currentSale.id,
            },
          });
        } catch (e) {
          console.error(e); // eslint-disable-line no-console
          this.loadingError = e.message;
        } finally {
          this.areProductsLoading = false;
        }
    }
  }
</script>


<style scoped lang="scss">

</style>
