<template>
  <div class="producer-details-page">
    <section
      class="hero"
      :class="{
        'is-danger': loadingError,
        'is-medium': loadingError || producer,
        'is-primary': producer,
      }"
      :style="{
        backgroundSize:     'cover',
        backgroundPosition: 'center',
        backgroundImage:    `url('${photoUrl}')`,
      }"
    >
      <div class="hero-body">
        <div class="container has-text-centered">
          <clip-loader :loading="loading" color="#00d1b2" size="100px"/>

          <template v-if="loadingError">
            <h1 class="title">Erreur de chargement</h1>
            <h2 class="subtitle">{{ loadingError }}</h2>
          </template>

          <template v-if="producer">
            <h1 class="producer-details-page__name title" :data-content="producer.raison_sociale"></h1>
            <ul class="producer-details-page__activites tags" v-if="producer.activites.data">
              <li
                class="tag"
                v-for="activite in producer.activites.data"
                v-text="activite.nom"></li>
            </ul>
          </template>
        </div>
      </div>
    </section>

    <section class="section" v-if="producer">
      <div class="columns">
        <div class="column is-two-thirds">
          <div class="content" v-html="producer.presentation"></div>
        </div>

        <div class="column is-one-third">
          <contact-details-card-component
            :name="producer.raison_sociale"
            :latLng="latLng"
            :addressLine1="addressLine1"
            :addressLine2="addressLine2"
            :email="producer.email"
            :phone="producer.numero_de_telephone"
            :website="producer.site_internet"
          />
        </div>
      </div>
    </section>
  </div>
</template>


<script>
  import ClipLoader from 'vue-spinner/src/ClipLoader';
  import ContactDetailsCardComponent from '@/components/producers/ProducerContactDetailsCardComponent';

  export default {
    name: 'producers-page',

    components: {
      ClipLoader,
      ContactDetailsCardComponent,
    },

    data() {
      return {
        producer:     null,
        loadingError: null,
        loading:      true,
      };
    },

    computed: {
      latLng() {
        const parts = this.producer.adresse.split(',');
        return { lat: parseFloat(parts[ 0 ]), lng: parseFloat(parts[ 1 ]) };
      },

      photoUrl() {
        if (this.producer && this.producer.photo_de_presentation) {
          return this.$directusSdk.getThumbnailUrl(`/1200/675/crop/good/${this.producer.photo_de_presentation.data.name}`);
        }

        return 'https://via.placeholder.com/480x270';
      },

      addressLine1() {
        if (
          (this.producer.numero && this.producer.numero.trim().length > 0)
          || (this.producer.rue && this.producer.rue.trim().length > 0)
        ) {
          return [ this.producer.numero, this.producer.rue ].join(' ').trim();
        }

        return null;
      },

      addressLine2() {
        if (
          (this.producer.code_postal && this.producer.code_postal.trim().length > 0)
          || (this.producer.ville && this.producer.ville.trim().length > 0)
        ) {
          return [ this.producer.code_postal, this.producer.ville ].join(' ').trim();
        }

        return null;
      },
    },

    async created() {
      await this.fetchProducer();
    },

    watch: {
      '$route': 'fetchProducer',
    },

    methods: {
      async fetchProducer() {
        this.loadingError = null;
        this.loading      = true;

        try {
          const result = await this.$directusSdk.getItems('producteurs', {
            filters: { slug: this.$route.params.slug, },
            limit:   1,
          });

          if (result.data.length < 1) {
            this.loadingError = 'Erreur 404';
          }

          this.producer = result.data[ 0 ];
        } catch (e) {
          console.error(e);
          this.loadingError = e.toString();
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>


<style scoped lang="scss">
  .producer-details-page {
    &__name {
      position: relative;

      &::before {
        content:       '';
        position:      absolute;

        top:           0;
        bottom:        0;
        left:          0;
        right:         0;

        background:    black;
        border-radius: 50%;
        filter:        blur(50px);
        transform:     scaleX(0.5) scaleY(2);
      }

      &::after {
        content:  attr(data-content);
        position: relative;
      }
    }

    &__activites {
      position:        relative;

      justify-content: center;
    }
  }
</style>