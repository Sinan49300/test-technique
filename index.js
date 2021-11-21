import productsItems from "./produits.json" assert { type: "json" };

const app = new Vue({
    el: '#app',
    data: {
        titleText: '',
        products: productsItems,
        panelActive: { gender: true, price: true, color: true, activity: true },
        mobileView: false,
        panelActiveFilter: true,
        // Filtres 
        genders: ['Homme', 'Femme', 'Mixte'],
        prices: [
            { label: 'Moins de 50€', values: [0, 50] },
            { label: '50€ - 100€', values: [50, 100] },
            { label: '100€ - 150€', values: [100, 150] },
            { label: 'Plus de 150€', values: [150, 9999] }
        ],
        colors: [
            { value: 'Noir', active: false },
            { value: 'Rouge', active: false },
            { value: 'Blanc', active: false },
            { value: 'Jaune', active: false },
            { value: 'Vert', active: false },
            { value: 'Bleu', active: false },
            { value: 'Rose', active: false },
            { value: 'Gris', active: false },
        ],
        activities: ['Football', 'Basket', 'Running'],
        selectedFilter: { genders: [], prices: [], colors: [], activities: [] },
    },
    created: function () {
        // écouteur sur taille de l'écran 
        window.addEventListener("resize", this.switchMobileView);
        this.switchMobileView();
    },
    computed: {
        filterProducts: function () {
            let productFilterArray = [];

             // Applique les filtres sur les produits 
            productFilterArray = this.products.filter((product) => {     
                if (Object.keys(product.article).length > 0) {
                    return this.filterGender(this.filterPrice(this.filterColors(this.filterActivities(product))));
                }
            })
            // définit le titre
            this.mainTitleText(productFilterArray);

            return productFilterArray;
        }
    },
    methods: {
        // check si mode Mobile ou non (responsive)
        switchMobileView: function () {
            this.windowWidth = window.innerWidth;
            //mobile
            if (this.windowWidth <= 767 && this.mobileView !=true) {
                this.mobileView = true;
                this.panelActiveFilter = false;
                // autres
            } else if (this.windowWidth >= 767 && this.mobileView != false) {
                this.mobileView = false;
                this.panelActiveFilter = true;
            }
        },
        // définition du title 
        mainTitleText: function (value) {
            let genderTextFilter = "";
            let priceTextFilter = "";
            let colorsTextFilter = "";
            let activitiesTextFilter = "";

            if (this.selectedFilter.genders.length == 1) {
                genderTextFilter = this.selectedFilter.genders
            }

            if (this.selectedFilter.prices.length == 1) {
                this.prices.map((price) => {
                    if (price.values[0] == this.selectedFilter.prices[0][0] && price.values[1] == this.selectedFilter.prices[0][1]) {
                        return priceTextFilter = price.label;
                    }
                })
            }

            if (this.selectedFilter.colors.length == 1) {
                colorsTextFilter = this.selectedFilter.colors
            }

            if (this.selectedFilter.activities.length == 1) {
                activitiesTextFilter = this.selectedFilter.activities
            }

            this.titleText = 'Nouveautés ' + genderTextFilter + ' ' + priceTextFilter + ' ' + colorsTextFilter + ' ' + activitiesTextFilter + ' (' + value.length + ')';
        },
        // retourne le path de l'image 
        getImage: function (item) {
            return 'img/' + item.photo;
        },
        // définit les couleurs selectionnées dans le filtre 
        getSelectedColor: function (color) {
            color.active = !color.active;

            if (color.active == true) {
                this.selectedFilter.colors.push(color.value);
            } else if (color.active == false) {
                this.selectedFilter.colors.splice(this.selectedFilter.colors.indexOf(color.value), 1);
            }
        },
        /*************** filtres sur les produits *******************/
        // Filtre sur Sexe
        filterGender: function (product) {
            if (this.selectedFilter.genders.length > 0 && product) {
                if (this.selectedFilter.genders.includes(product.sexe)) {
                    return product;
                }
            } else {
                return product;
            }
        },
        // Filtre sur l'interval de prix
        filterPrice: function (product) {
            if (this.selectedFilter.prices.length > 0 && product) {

                const productPriceParse = parseFloat(product.prix.replace(' €', ''));
                let productInRangePrice = "";
                // parcours les intervalles de prix selectionnés 
                this.selectedFilter.prices.map((priceRange) => {
                    const minPrice = priceRange[0];
                    const maxPrice = priceRange[1];

                    if (minPrice <= productPriceParse && productPriceParse <= maxPrice) {
                        return productInRangePrice = product;
                    }
                });

                if (productInRangePrice != "") {
                    return productInRangePrice;
                }
            } else {
                return product;
            }
        },
        // Filtre sur les couleurs
        filterColors: function (product) {
            if (this.selectedFilter.colors.length > 0 && product) {
                let productColorOk = "";

                this.selectedFilter.colors.map((colorValue) => {
                    if (product.couleur.toLowerCase().includes(colorValue.toLowerCase())) {
                        return productColorOk = product;
                    }
                })

                if (productColorOk != "") {
                    return productColorOk;
                }
            } else {
                return product;
            }
        },
        // Filtre sur Sport
        filterActivities: function (product) {
            if (this.selectedFilter.activities.length > 0 && product) {
                if (this.selectedFilter.activities.includes(product.sport)) {
                    return product;
                }
            } else {
                return product;
            }
        },
        /*************** Mobile actions *******************/
        toggleFilterPanel: function (action) {
            if(action == "close"){
                this.panelActiveFilter = false;
            } else if(action == "toggle"){
                this.panelActiveFilter = !this.panelActiveFilter;
            }           
        },
        eraseSelectedFilter: function () {
            this.selectedFilter = { genders: [], prices: [], colors: [], activities: [] };

            this.colors.map((color) => {
                color.active = false;
            })
        }
    },
    filters: {
        productColorText: function (value) {
            let nbColors = value.split(',').length;
            let textColor = (nbColors > 1 ? 'couleurs' : 'couleur');

            return nbColors + ' ' + textColor;
        },
        filterTitleText: function (value) {

            if (Array.isArray(value)) {
                return (value.length > 0 ? ' (' + value.length + ')' : '')
            } else if (Object.keys(value).length > 0) {
                let totalValueLenght = value["colors"].length + value["genders"].length + value["prices"].length + value["activities"].length;

                return ' (' + totalValueLenght + ')';
            }
        }
    }
});



