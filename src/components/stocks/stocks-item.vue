<template>
    <div class="stock-item">
        <div class="stock-item__info">
            <div class="stock-item__cover">
                <img
                    :src="item.image"
                    :alt="item.companyName"
                >
                <div class="stock-item__price">
                    ${{ item.price }}
                </div>
            </div>
            <div>
                <h4 class="stock-item__title">
                    {{ item.companyName }}
                </h4>
                <span class="stock-item__symbol">
                    {{ item.symbol }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'stock-item',
    props: {
        item: {
            type: Object,
        },
    },
};
</script>
